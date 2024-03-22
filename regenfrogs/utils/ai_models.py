import os

from django.db import models
from django.utils import timezone
from django_q.models import Schedule
from django_q.tasks import async_task

from regenfrogs.utils.models import TimestampMixin

IMPORT_NAME = "regenfrogs.utils.ai_models"


class ImageGenerationStatus(models.TextChoices):
    WAITING = "waiting"
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    READY = "ready"


class ImagePromptMixin(TimestampMixin):
    MAX_CONCURRENCY = 4

    prompt = models.TextField()
    reply = models.JSONField(null=True, blank=True)
    remote_id = models.CharField(max_length=255, null=True, blank=True)
    generation_status = models.CharField(
        max_length=255, choices=ImageGenerationStatus.choices, default=ImageGenerationStatus.WAITING
    )
    status_response = models.JSONField(null=True, blank=True)
    waiting_since = models.DateTimeField(null=True, blank=True)
    waiting_until = models.DateTimeField(null=True, blank=True)
    requested_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    image_chosen = models.PositiveIntegerField(null=True, blank=True)
    image_1 = models.ImageField(upload_to="images/", null=True, blank=True)
    image_2 = models.ImageField(upload_to="images/", null=True, blank=True)
    image_3 = models.ImageField(upload_to="images/", null=True, blank=True)
    image_4 = models.ImageField(upload_to="images/", null=True, blank=True)

    class Meta:
        abstract = True

    @property
    def chosen_image(self):
        if 1 <= self.image_chosen <= 4:
            return getattr(self, f"image_{self.image_chosen}")

    @classmethod
    def install_run_waiting(cls):
        return Schedule.objects.create(
            name="run_waiting", func=f"{IMPORT_NAME}.ImagePrompt.run_waiting", schedule_type="I", minutes=1
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
            if image.get_requested().count() <= cls.MAX_CONCURRENCY:
                print("  Starting image...", image.id)
                image.request_images()

    def begin_waiting(self):
        self.status = "waiting"
        self.waiting_since = timezone.now()
        self.save()

    def enqueue_image_request(self):
        self.begin_waiting()
        async_task("regenfrogs.utils.ai_models.ImagePrompt.wait_turn_for_image_request", self.pk)

    @classmethod
    def get_waiting(cls):
        return cls.objects.filter(status=ImageGenerationStatus.WAITING).order_by("waiting_since")

    @classmethod
    def get_pending(cls):
        return cls.objects.filter(status=ImageGenerationStatus.PENDING).order_by("requested_at")

    @classmethod
    def get_requested(cls):
        return cls.objects.filter(
            status__in=[ImageGenerationStatus.PENDING, ImageGenerationStatus.IN_PROGRESS]
        ).order_by("requested_at")

    def request_images(self, watch=False):
        import http.client
        import json

        self.requested_at = timezone.now()
        self.status = "pending"
        self.save()

        data = {"prompt": self.prompt}

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

    def on_complete(self):
        self.completed_at = timezone.now()
        self.save()
        character = self.avatar_for.first()
        if character:
            character.generating = False
            character.save()

    def update_generation_status(self):
        import http.client
        import json

        headers = {"Authorization": f"Bearer {os.environ.get('IMAGINE_TOKEN')}", "Content-Type": "application/json"}

        conn = http.client.HTTPSConnection("cl.imagineapi.dev")
        conn.request("GET", f"/items/images/{self.remote_id}", headers=headers)

        response = conn.getresponse()
        self.status_response = json.loads(response.read().decode("utf-8"))
        try:
            self.status = self.status_response["data"]["status"]
            if self.status == "failed":
                print("Image generation failed", self.remote_id, self.status_response["data"])
            if self.status == "completed":
                self.image_1 = download_image_for_field(self.status_response["data"]["upscaled_urls"][0])
                self.image_2 = download_image_for_field(self.status_response["data"]["upscaled_urls"][1])
                self.image_3 = download_image_for_field(self.status_response["data"]["upscaled_urls"][2])
                self.image_4 = download_image_for_field(self.status_response["data"]["upscaled_urls"][3])
        except:
            print("Error loading image", self.status_response)
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
