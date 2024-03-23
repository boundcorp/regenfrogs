from django.contrib.auth.models import AbstractUser
from django.db import models

from regenfrogs.utils.email import MailMixin
from regenfrogs.utils.models import MediumIDMixin, TimestampMixin, UUIDMixin


class AccountTypes(models.TextChoices):
    STAFF = "staff", "Staff"
    USER = "user", "User"


class User(TimestampMixin, MediumIDMixin, AbstractUser, MailMixin):
    account_type = models.CharField(max_length=50, choices=AccountTypes.choices, default=AccountTypes.STAFF)
    farcaster_id = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.get_full_name()} <{self.email}>"

    @classmethod
    def frame_view(cls, user, frame_url, signed_bytes):
        pass


class FrameView(TimestampMixin, UUIDMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    frame_url = models.CharField(max_length=255)
    valid = models.BooleanField(default=False)
    reply = models.JSONField()
