import json
import random
from datetime import timedelta
from io import StringIO

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from django_q.models import Schedule

from regenfrogs.utils.ai_models import (
    ImageGenerationStatus,
    ImagePromptMixin,
    ipfs_to_proxy_url,
    upload_to_ipfs,
)
from regenfrogs.utils.models import MediumIDMixin, TimestampMixin, UUIDMixin

from . import profiles


class STATUS_CHOICES(models.TextChoices):
    HAPPY = "Happy"
    CONTENT = "Content"
    SAD = "Sad"


class CATEGORY_CHOICES(models.TextChoices):
    HEALTH = "Health"
    SANITY = "Sanity"
    HUNGER = "Hunger"


def number_to_status(number: int):
    if number < 40:
        return STATUS_CHOICES.SAD
    elif 40 < number < 60:
        return STATUS_CHOICES.CONTENT
    elif number > 60:
        return STATUS_CHOICES.HAPPY


def get_ages():
    from django.conf import settings

    return {
        "baby": 0,
        "young": 1 * settings.FROG_GROWTH_PERIOD_SECONDS,
        "adult": 10 * settings.FROG_GROWTH_PERIOD_SECONDS,
        "old": 30 * settings.FROG_GROWTH_PERIOD_SECONDS,
    }


HUNGER_BY_AGES = {
    "baby": [1, 1, 2],
    "young": [1, 2, 3],
    "adult": [2, 3, 4],
    "old": [3, 4, 5, 6],
}

DANGER_BY_AGES = {
    "baby": (0.1, ["upset tummy"]),
    "young": (0.2, ["snake"]),
    "adult": (0.35, ["weasel"]),
    "old": (0.5, ["car"]),
}

INSANITY_BY_AGES = {
    "baby": [50, 30, 15],
    "young": [40, 20, 10],
    "adult": [30, 15, 5],
    "old": [10, 5],
}


class FrogProfile(TimestampMixin, MediumIDMixin):
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE)
    image = models.OneToOneField("FrogImage", on_delete=models.CASCADE, null=True, blank=True)
    alive = models.BooleanField(default=True)
    health = models.IntegerField(default=100, validators=[MaxValueValidator(100), MinValueValidator(0)])
    sanity = models.IntegerField(default=100, validators=[MaxValueValidator(100), MinValueValidator(0)])
    hunger = models.IntegerField(default=100, validators=[MaxValueValidator(100), MinValueValidator(0)])
    status = models.CharField(default=STATUS_CHOICES.HAPPY, choices=STATUS_CHOICES.choices)
    died_at = models.DateTimeField(null=True, blank=True)
    last_loop = models.DateTimeField(null=True, blank=True)
    next_loop = models.DateTimeField(null=True, blank=True)
    sanity_counter = models.PositiveIntegerField(default=0)

    species = models.TextField(null=True, blank=True)
    hands = models.TextField(null=True, blank=True)
    clothes = models.TextField(null=True, blank=True)

    ipfs_metadata_hash = models.TextField(null=True, blank=True)
    minted_nft_id = models.PositiveIntegerField(null=True, blank=True)
    minted_nft_address = models.TextField(null=True, blank=True)
    minted_nft_tx_hash = models.TextField(null=True, blank=True)
    minted_nft_receipt = models.TextField(null=True, blank=True)

    @classmethod
    def ensure(cls, wanted=20, add=5):
        available = FrogImage.available().count()
        in_progress = FrogImage.not_yet_ready().count()
        print("Frogs available:", available, "in_progress:", in_progress, "wanted:", wanted)
        if (available + in_progress) < wanted:
            print("Issuing", add, "new frogs")
            for i in range(add):
                FrogImage.random(FrogStyle.DRAWING)

    @classmethod
    def adopt_from_image(cls, owner, image=None):
        if not image:
            image = FrogImage.available().order_by("?").first()
            if not image:
                raise Exception("No available images to adopt from")
            if not image.image_chosen:
                image.choose_number(1)

        return cls.objects.create(
            image=image, owner=owner, species=image.species, hands=image.hands, clothes=image.clothes
        )

    @classmethod
    def install_game_loop(cls):
        return Schedule.objects.update_or_create(
            name="frog_profile_game_loop",
            defaults=dict(
                func=f"regenfrogs.apps.frogs.models.FrogProfile.game_loop",
                schedule_type="I",
                minutes=1,
            ),
        )

    @classmethod
    def game_loop(cls):
        from django.conf import settings

        due_for_loop = cls.objects.filter(
            models.Q(last_loop__isnull=True)
            | models.Q(last_loop__lt=timezone.now() - timedelta(seconds=settings.FROG_LOOP_SECONDS)),
        ).filter(alive=True)
        print("Due for loop", due_for_loop.count())
        for frog in due_for_loop:
            try:
                frog.perform_loop()
            except Exception as e:
                print("Failed to perform loop", frog.id, e)

    def get_cooldown_until(self, user):
        if user == self.owner:
            cooldown = timedelta(hours=2)
        else:
            cooldown = timedelta(hours=1)
        latest_log = self.logs.filter(actor=user).first()
        if latest_log:
            return latest_log.created_at + cooldown
        else:
            return timezone.now()

    def perform_loop(self):
        print("  processing frog loop", self.id, self.age, self.health, self.sanity, self.hunger)
        self.last_loop = timezone.now()
        hungry = random.choice(HUNGER_BY_AGES[self.age])
        self.hunger = max(0, self.hunger - hungry)
        rate, kinds = DANGER_BY_AGES[self.age]
        danger = random.random() < rate
        if danger:
            kind = random.choice(kinds)
            self.health = max(0, self.health - 10 * rate)
            self.logs.create(text=f"{kind} attacked!", category=CATEGORY_CHOICES.HEALTH)

        self.sanity_counter -= 1
        if self.sanity_counter <= 0:
            self.sanity_counter = random.choice(INSANITY_BY_AGES[self.age])
            insanity = (self.age == "old" and 2 or 1) * (1 + self.days_since_last_action())
            self.sanity = max(0, self.sanity - insanity)
            self.logs.create(text=f"lost {insanity} sanity", category=CATEGORY_CHOICES.SANITY)

        if self.health == 0 or self.sanity == 0 or self.hunger == 0:
            self.alive = False
        else:
            self.alive = True
        self.save()

        health_status = number_to_status(self.health)
        sanity_status = number_to_status(self.sanity)
        hunger_status = number_to_status(self.hunger)
        all_statuses = [health_status, sanity_status, hunger_status]
        if STATUS_CHOICES.SAD in all_statuses:
            self.status = STATUS_CHOICES.SAD
        if STATUS_CHOICES.CONTENT in all_statuses:
            self.status = STATUS_CHOICES.CONTENT
        else:
            self.status = STATUS_CHOICES.HAPPY
        self.save()
        return self

    @property
    def lifespan(self):
        if self.died_at:
            return self.died_at - self.created_at
        return timezone.now() - self.created_at

    @property
    def age(self):
        seconds = self.lifespan.total_seconds()
        AGES = get_ages()
        if seconds < AGES["young"]:
            return "baby"
        if seconds < AGES["adult"]:
            return "young"
        if seconds < AGES["old"]:
            return "adult"
        return "old"

    def last_action(self):
        return self.logs.filter(actor__isnull=False).order_by("-created_at").first()

    def days_since_last_action(self):
        last_action = self.last_action()
        if not last_action:
            return 10
        return (timezone.now() - last_action.created_at).days

    def days_since_death(self):
        if not self.died_at:
            return 0
        return (timezone.now() - self.died_at).days

    def mint_for(self, visitor):
        if self.alive or self.days_since_death() > 7 or not visitor:
            return
        return self.get_mint_parameters(visitor)

    def get_mint_parameters(self, user):
        from regenfrogs.utils.services.blockchain import CurrentNetwork

        from .schema.types import MintParameters

        EXPIRY = 900
        MICROETH_PRICE = 1000
        if not self.ipfs_metadata_hash:
            name = f"RegenFrogs/{self.ipfs_metadata_filename}"
            self.ipfs_metadata_hash, _ = upload_to_ipfs(name, StringIO(json.dumps(self.nft_metadata())))
            self.save()
        return MintParameters(
            to=user.verified_address,
            nonce=CurrentNetwork.next_nonce(user.verified_address),
            uri=self.ipfs_metadata_url,
            price_wei=MICROETH_PRICE * 10**18 // 1_000_000,
            expires=int(timezone.now().timestamp() + EXPIRY),
        )

    def nft_attributes(self):
        return [
            {"trait_type": "Species", "value": self.species},
            # {"trait_type": "Hands", "value": self.hands},
            # {"trait_type": "Clothes", "value": self.clothes},
        ]

    def nft_metadata(self):
        return {
            "name": self.nft_title,
            "image": self.image.ipfs_url,
            "background_color": "#55a630",
            "attributes": self.nft_attributes(),
        }

    @property
    def nft_title(self):
        return f"{self.species}"

    @property
    def ipfs_metadata_url(self):
        return f"ipfs://{self.ipfs_metadata_path}"

    @property
    def ipfs_proxy_metadata_url(self):
        return ipfs_to_proxy_url(self.ipfs_metadata_path)

    @property
    def ipfs_metadata_filename(self):
        return f"{self.image.id}.json"

    @property
    def ipfs_metadata_path(self):
        return f"{self.ipfs_metadata_hash}/{self.ipfs_metadata_filename}"

    @property
    def image_url(self):
        if self.image:
            if settings.DEBUG and not self.image.ipfs_hash:
                self.image.pin_chosen_to_pinata()
            if self.image.ipfs_hash:
                return self.image.ipfs_proxy_url
            return self.image.chosen_image.url

    def upload_to_ipfs(self):
        from regenfrogs.utils.services.ipfs import upload_to_ipfs

        image = self.image

        image_response = upload_to_ipfs(f"RegenFrogs/{self.id}.png", image.open("rb"))
        self.ipfs_image_cid = image_response["pin"]["cid"]
        metadata_response = upload_to_ipfs(f"RegenFrogs/{self.id}.json", StringIO(json.dumps(self.nft_metadata())))
        self.ipfs_metadata_cid = metadata_response["pin"]["cid"]
        self.save()


class FrogLog(TimestampMixin, MediumIDMixin):
    frog = models.ForeignKey("FrogProfile", on_delete=models.CASCADE, related_name="logs")
    actor = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="logs", null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    category = models.CharField(choices=CATEGORY_CHOICES.choices, null=True, blank=True)


class FrogImage(ImagePromptMixin, MediumIDMixin):
    IMPORT_NAME = "regenfrogs.apps.frogs.models.FrogImage"
    IPFS_PREFIX = "frogs"

    style = models.ForeignKey("FrogStyle", on_delete=models.CASCADE, related_name="outputs", null=True, blank=True)

    species = models.TextField(null=True, blank=True)
    hands = models.TextField(null=True, blank=True)
    clothes = models.TextField(null=True, blank=True)

    @classmethod
    def available(cls):
        return cls.objects.filter(frogprofile=None, generation_status=ImageGenerationStatus.COMPLETED)

    @classmethod
    def not_yet_ready(cls):
        return cls.objects.filter(
            generation_status__in=[
                ImageGenerationStatus.PENDING,
                ImageGenerationStatus.WAITING,
                ImageGenerationStatus.IN_PROGRESS,
            ]
        )

    @classmethod
    def random(cls, style, references=None):
        species = random.choice(profiles.SPECIES)
        hands = random.randint(0, 5) == 0 and random.choice(profiles.HANDS) or None
        clothes = not hands and random.randint(0, 5) == 0 and random.choice(profiles.CLOTHES) or None

        prompt = species
        if hands:
            prompt += f" with {hands}"
        if clothes:
            prompt += f" wearing {clothes}"

        image = style.imagine(prompt, references=references)
        image.species = species
        image.hands = hands
        image.clothes = clothes
        image.save()
        return image


class classproperty(property):
    def __get__(self, owner_self, owner_cls):
        return self.fget(owner_cls)


class FrogStyle(TimestampMixin, MediumIDMixin):
    name = models.CharField(max_length=255)
    prompt_prefix = models.CharField(max_length=255, null=True, blank=True)
    prompt_suffix = models.CharField(max_length=255, null=True, blank=True)

    def imagine(self, prompt, references=None):
        prompt = f"{self.prompt_prefix or ''}, {prompt}, {self.prompt_suffix or ''}"
        if not references:
            five_random_references = self.style_references.order_by("?")[:5]
            references = [ref.image for ref in five_random_references]

        image = FrogImage.imagine(prompt, references)
        image.style = self
        image.save()
        return image

    def generate_frog(self, owner):
        frog = FrogProfile.objects.create(owner=owner)
        return frog

    @classproperty
    def DRAWING(cls):
        return FrogStyle.objects.update_or_create(
            name="Drawing",
            defaults=dict(
                prompt_prefix="in this simple cartoon drawing style",
                prompt_suffix="white background, no decorations --style raw",
            ),
        )[0]


class FrogStyleImageReference(TimestampMixin, UUIDMixin):
    image = models.ForeignKey("FrogImage", on_delete=models.CASCADE, related_name="image_references")
    style = models.ForeignKey("FrogStyle", on_delete=models.CASCADE, related_name="style_references")
