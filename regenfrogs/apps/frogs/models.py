import json
import random
from io import StringIO

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from regenfrogs.utils.ai_models import ImagePromptMixin
from regenfrogs.utils.models import MediumIDMixin, TimestampMixin, UUIDMixin

from . import profiles


class STATUS_CHOICES(models.TextChoices):
    HAPPY = ("Happy",)
    CONTENT = ("Content",)
    SAD = "Sad"


class CATEGORY_CHOICES(models.TextChoices):
    HEALTH = ("Health",)
    SANITY = ("Sanity",)
    HUNGER = "Hunger"


class FrogProfile(TimestampMixin, MediumIDMixin):
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE)
    image = models.OneToOneField("FrogImage", on_delete=models.CASCADE, null=True, blank=True)
    alive = models.BooleanField(default=True)
    health = models.IntegerField(default=100, validators=[MaxValueValidator(100), MinValueValidator(0)])
    sanity = models.IntegerField(default=100, validators=[MaxValueValidator(100), MinValueValidator(0)])
    hunger = models.IntegerField(default=100, validators=[MaxValueValidator(100), MinValueValidator(0)])
    status = models.CharField(default="HAPPY", choices=STATUS_CHOICES.choices)

    species = models.TextField(null=True, blank=True)
    hands = models.TextField(null=True, blank=True)
    clothes = models.TextField(null=True, blank=True)

    ipfs_image_cid = models.TextField(null=True, blank=True)
    ipfs_metadata_cid = models.TextField(null=True, blank=True)
    minted_nft_id = models.PositiveIntegerField(null=True, blank=True)
    minted_nft_address = models.TextField(null=True, blank=True)
    minted_nft_tx_hash = models.TextField(null=True, blank=True)
    minted_nft_receipt = models.TextField(null=True, blank=True)

    def calculate_alive(self):
        if self.health == 0 or self.sanity == 0 or self.hunger == 0:
            self.alive = False
        else:
            self.alive = True
        self.save()
        return self

    def calculate_status(self, number):
        if number > 40 and number < 60:
            return "CONTENT"
        if number < 40:
            return "SAD"
        if number > 60:
            return "HAPPY"

    def get_status(self):
        health_status = self.calculate_status(self.health)
        sanity_status = self.calculate_status(self.sanity)
        hunger_status = self.calculate_status(self.hunger)
        if "SAD" in [health_status, sanity_status, hunger_status]:
            self.status = "SAD"
        if "CONTENT" in [health_status, sanity_status, hunger_status]:
            self.status = "CONTENT"
        else:
            self.status = "HAPPY"
        self.save()
        return self

    def nft_attributes(self):
        return [
            {"trait_type": "Species", "value": self.species},
            # {"trait_type": "Hands", "value": self.hands},
            # {"trait_type": "Clothes", "value": self.clothes},
        ]

    def nft_metadata(self):
        return {
            "name": self.nft_title,
            "image": self.ipfs_image_url,
            "background_color": "#55a630",
            "attributes": self.nft_attributes(),
        }

    @property
    def nft_title(self):
        return f"{self.species}"

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
    created_by = models.TextField(null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    category = models.CharField(choices=CATEGORY_CHOICES.choices, null=True, blank=True)


class FrogImage(ImagePromptMixin, MediumIDMixin):
    IMPORT_NAME = "regenfrogs.apps.frogs.models.FrogImage"
    IPFS_PREFIX = "frogs"

    style = models.ForeignKey("FrogStyle", on_delete=models.CASCADE, related_name="outputs", null=True, blank=True)

    species = models.TextField(null=True, blank=True)
    hands = models.TextField(null=True, blank=True)
    clothes = models.TextField(null=True, blank=True)

    def choose_number(self, number):
        super().choose_number(number)
        self.pin_chosen_to_pinata()

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
