import os

from django.db import models
from django.utils import timezone
from django_q.models import Schedule
from django_q.tasks import async_task

from regenfrogs.utils.ai_models import ImagePromptMixin
from regenfrogs.utils.models import TimestampMixin, MediumIDMixin


class Frog(TimestampMixin, MediumIDMixin):
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE)
    image = models.OneToOneField('FrogImage', on_delete=models.CASCADE, null=True, blank=True)


class FrogImage(ImagePromptMixin, MediumIDMixin):
    pass
