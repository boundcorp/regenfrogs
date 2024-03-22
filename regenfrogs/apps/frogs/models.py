from django.db import models

from regenfrogs.utils.ai_models import ImagePromptMixin
from regenfrogs.utils.models import MediumIDMixin, TimestampMixin, UUIDMixin


class Frog(TimestampMixin, MediumIDMixin):
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE)
    image = models.OneToOneField("FrogImage", on_delete=models.CASCADE, null=True, blank=True)


class FrogImage(ImagePromptMixin, MediumIDMixin):
    IMPORT_NAME = "regenfrogs.apps.frogs.models.FrogImage"
    IPFS_PREFIX = "frogs"

    style = models.ForeignKey("FrogStyle", on_delete=models.CASCADE, related_name="outputs", null=True, blank=True)


class FrogStyle(TimestampMixin, MediumIDMixin):
    name = models.CharField(max_length=255)
    prompt_suffix = models.CharField(max_length=255, null=True, blank=True)

    def imagine(self, prompt, references=None):
        if self.prompt_suffix:
            prompt = f"{prompt} {self.prompt_suffix}"
        image = FrogImage.imagine(prompt, references)
        self.outputs.create(frog=image)
        return image


class FrogStyleImageReference(TimestampMixin, UUIDMixin):
    image = models.ForeignKey("FrogImage", on_delete=models.CASCADE, related_name="image_references")
    style = models.ForeignKey("FrogStyle", on_delete=models.CASCADE, related_name="style_references")
