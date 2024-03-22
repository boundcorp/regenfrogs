from django.db import models

from regenfrogs.utils.ai_models import ImagePromptMixin
from regenfrogs.utils.models import MediumIDMixin, TimestampMixin


class Frog(TimestampMixin, MediumIDMixin):
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE)
    image = models.OneToOneField("FrogImage", on_delete=models.CASCADE, null=True, blank=True)


class FrogImage(ImagePromptMixin, MediumIDMixin):
    pass
