from django.contrib.auth.models import AbstractUser
from django.db import models

from regenfrogs.utils.email import MailMixin
from regenfrogs.utils.models import MediumIDMixin, TimestampMixin, UUIDMixin
from regenfrogs.utils.services.neynar import FrameInteraction


class AccountTypes(models.TextChoices):
    STAFF = "staff", "Staff"
    USER = "user", "User"


class User(TimestampMixin, MediumIDMixin, AbstractUser, MailMixin):
    account_type = models.CharField(max_length=50, choices=AccountTypes.choices, default=AccountTypes.STAFF)
    farcaster_id = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.get_full_name()} <{self.email}>"

    @classmethod
    def frame_view(cls, user, frame_url, valid, frame_interaction_json):
        interaction = FrameInteraction(frame_interaction_json)
        view = FrameView.objects.create(
            user=user,
            frame_url=frame_url,
            valid=valid,
            interaction=frame_interaction_json,
            cast_hash=interaction.cast.hash,
            cast_timestamp=interaction.cast.timestamp,
            interactor_fid=interaction.interactor.fid,
        )
        return view, interaction


class FrameView(TimestampMixin, UUIDMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    frame_url = models.CharField(max_length=255)
    valid = models.BooleanField(default=False)
    interaction = models.JSONField()
    cast_hash = models.CharField(max_length=255, null=True, blank=True)
    cast_timestamp = models.DateTimeField(null=True, blank=True)
    interactor_fid = models.PositiveIntegerField(null=True, blank=True)
