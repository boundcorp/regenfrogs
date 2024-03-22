import random

from django.db import models

from regenfrogs.utils.ai_models import ImagePromptMixin
from regenfrogs.utils.models import MediumIDMixin, TimestampMixin, UUIDMixin

from . import profiles


class Frog(TimestampMixin, MediumIDMixin):
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE)
    image = models.OneToOneField("FrogImage", on_delete=models.CASCADE, null=True, blank=True)


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
        frog = Frog.objects.create(owner=owner)
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
