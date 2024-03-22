import os

from django.db import models
from django.utils import timezone
from django_q.models import Schedule
from django_q.tasks import async_task

from regenfrogs.utils.models import TimestampMixin


class ImageGenerationStatus(models.TextChoices):
    WAITING = "waiting"
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    FAILED = "failed"
    COMPLETED = "completed"


def to_reference_url(url_or_image_prompt):
    if isinstance(url_or_image_prompt, str):
        return url_or_image_prompt
    if getattr(url_or_image_prompt, "image_chosen", None):
        return getattr(url_or_image_prompt, "image_chosen").url


class ImagePromptMixin(TimestampMixin):
    MAX_CONCURRENCY = 4
    IPFS_PREFIX = "images"
    IMPORT_NAME = "regenfrogs.utils.ai_models.ImagePromptMixin"  # Must set this to install schedule

    prompt = models.TextField()
    reply = models.JSONField(null=True, blank=True)
    remote_id = models.CharField(max_length=255, null=True, blank=True)
    ipfs_hash = models.CharField(max_length=255, null=True, blank=True)
    generation_status = models.CharField(
        max_length=255, choices=ImageGenerationStatus.choices, default=ImageGenerationStatus.WAITING
    )
    status_response = models.JSONField(null=True, blank=True)
    waiting_since = models.DateTimeField(null=True, blank=True)
    waiting_until = models.DateTimeField(null=True, blank=True)
    requested_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    image_chosen = models.PositiveIntegerField(null=True, blank=True)
    references = models.JSONField(null=True, blank=True)
    image_1 = models.ImageField(upload_to="images/", null=True, blank=True)
    image_2 = models.ImageField(upload_to="images/", null=True, blank=True)
    image_3 = models.ImageField(upload_to="images/", null=True, blank=True)
    image_4 = models.ImageField(upload_to="images/", null=True, blank=True)

    class Meta:
        abstract = True

    @classmethod
    def imagine(cls, prompt, references=None, begin_waiting=True):
        if references and isinstance(references, list):
            references = list(set(map(to_reference_url, references)))
        obj = cls.objects.create(prompt=prompt, references=references)
        if begin_waiting:
            obj.begin_waiting()
        return obj

    @property
    def ipfs_filename(self):
        return f"{self.id}-{self.image_chosen}.jpg"

    @property
    def ipfs_path(self):
        return os.path.join(self.ipfs_hash, self.ipfs_filename)

    @property
    def ipfs_proxy_url(self):
        return f"https://ipfs.io/ipfs/{self.ipfs_path}"

    @property
    def ipfs_url(self):
        return f"ipfs://{self.ipfs_path}"

    def pin_chosen_to_pinata(self):
        if self.ipfs_hash:
            return self

        import json

        import requests

        name = f"{self.IPFS_PREFIX}/"
        files = {
            "file": (name, self.chosen_image),
        }

        pinata_jwt = os.environ.get("PINATA_KEY")
        pinata_url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
        headers = {
            "Authorization": f"Bearer {pinata_jwt}",
        }
        data = {
            "pinataMetadata": json.dumps({"name": name}),
            "pinataOptions": json.dumps({"cidVersion": 0}),
        }

        response = requests.post(pinata_url, headers=headers, data=data, files=files)
        print(response.json())
        self.ipfs_hash = response.json()["IpfsHash"]
        self.save()
        return self

    @property
    def chosen_image(self):
        if 1 <= self.image_chosen <= 4:
            return getattr(self, f"image_{self.image_chosen}")

    @classmethod
    def install_run_waiting(cls):
        return Schedule.objects.create(
            name="run_waiting", func=f"{cls.IMPORT_NAME}.run_waiting", schedule_type="I", minutes=1
        )

    @classmethod
    def run_waiting(cls):
        requested = cls.get_requested()
        waiting = cls.get_waiting()
        print("Run Waiting - Requested:", requested.count(), "Waiting:", waiting.count())
        for image in cls.get_requested():
            print("  Updating", image.generation_status, image.id)
            try:
                image.update_generation_status()
            except:
                print("  Failed to update image status", image.id)

        for image in waiting[: cls.MAX_CONCURRENCY]:
            image.refresh_from_db()
            if cls.queue_has_capacity() and image.generation_status == ImageGenerationStatus.WAITING:
                print("  Starting image...", image.id)
                image.request_images()

    @classmethod
    def queue_has_capacity(cls):
        return cls.get_requested().count() <= cls.MAX_CONCURRENCY

    def begin_waiting(self):
        self.generation_status = ImageGenerationStatus.WAITING
        if not self.waiting_since:
            self.waiting_since = timezone.now()
        self.save()
        if self.queue_has_capacity():
            async_task(f"{self.IMPORT_NAME}.run_waiting")
        return self

    @classmethod
    def get_waiting(cls):
        return cls.objects.filter(generation_status=ImageGenerationStatus.WAITING).order_by("waiting_since")

    @classmethod
    def get_pending(cls):
        return cls.objects.filter(generation_status=ImageGenerationStatus.PENDING).order_by("requested_at")

    @classmethod
    def get_requested(cls):
        return cls.objects.filter(
            generation_status__in=[ImageGenerationStatus.PENDING, ImageGenerationStatus.IN_PROGRESS]
        ).order_by("requested_at")

    def request_images(self, watch=False):
        import http.client
        import json

        self.requested_at = timezone.now()
        self.generation_status = ImageGenerationStatus.PENDING
        self.save()

        data = {"prompt": self.get_full_prompt()}

        headers = {"Authorization": f"Bearer {os.environ.get('IMAGINE_TOKEN')}", "Content-Type": "application/json"}

        conn = http.client.HTTPSConnection("cl.imagineapi.dev")
        conn.request("POST", "/items/images/", body=json.dumps(data), headers=headers)
        print("Requesting image", self.pk)

        response = conn.getresponse()
        self.reply = json.loads(response.read().decode("utf-8"))
        try:
            self.remote_id = self.reply["data"]["id"]
        finally:
            conn.close()
            self.save()

    def get_full_prompt(self):
        prompt = self.prompt
        print("Building prompt", prompt)
        if self.references and isinstance(self.references, list):
            print("With references", self.references)
            prompt = " ".join(self.references) + " " + prompt
        return prompt

    def on_complete(self):
        self.completed_at = timezone.now()
        self.save()

    def update_generation_status(self):
        import http.client
        import json

        headers = {"Authorization": f"Bearer {os.environ.get('IMAGINE_TOKEN')}", "Content-Type": "application/json"}

        conn = http.client.HTTPSConnection("cl.imagineapi.dev")
        conn.request("GET", f"/items/images/{self.remote_id}", headers=headers)

        response = conn.getresponse()
        self.status_response = json.loads(response.read().decode("utf-8"))
        if (
            "errors" in self.status_response
            and self.requested_at
            and timezone.now() - self.requested_at > timezone.timedelta(minutes=5)
        ):
            print("Error loading image", self.pk, self.status_response)
            self.generation_status = ImageGenerationStatus.FAILED
        try:
            self.generation_status = self.status_response["data"]["status"]
            if self.generation_status == ImageGenerationStatus.FAILED:
                print("Image generation failed", self.pk, self.status_response["data"])
            if self.generation_status == ImageGenerationStatus.COMPLETED:
                self.image_1 = download_image_for_field(self.status_response["data"]["upscaled_urls"][0])
                self.image_2 = download_image_for_field(self.status_response["data"]["upscaled_urls"][1])
                self.image_3 = download_image_for_field(self.status_response["data"]["upscaled_urls"][2])
                self.image_4 = download_image_for_field(self.status_response["data"]["upscaled_urls"][3])
                self.on_complete()
        except:
            print("Error loading image", self.pk, self.status_response)
        finally:
            conn.close()
            self.save()


def download_image_for_field(url):
    from io import BytesIO

    import requests
    from django.core.files.base import ContentFile
    from PIL import Image

    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    img_io = BytesIO()
    img.save(img_io, format="JPEG")
    return ContentFile(img_io.getvalue(), "image.jpg")
