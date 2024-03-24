import json

from django.contrib.auth.models import AbstractUser
from django.db import models

from regenfrogs.apps.frogs.models import FrogProfile
from regenfrogs.utils.email import MailMixin
from regenfrogs.utils.models import MediumIDMixin, TimestampMixin, UUIDMixin
from regenfrogs.utils.services.neynar import Author, Cast, FrameInteraction


class AccountTypes(models.TextChoices):
    STAFF = "staff", "Staff"
    USER = "user", "User"


class User(TimestampMixin, MediumIDMixin, AbstractUser, MailMixin):
    account_type = models.CharField(max_length=50, choices=AccountTypes.choices, default=AccountTypes.STAFF)
    farcaster_id = models.PositiveIntegerField(default=0)
    follower_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    verified_address = models.CharField(max_length=64, null=True, blank=True)

    def get_latest_frog(self):
        return self.frogprofile_set.order_by("-created_at").first()

    def get_current_living_frog(self):
        return self.frogprofile_set.filter(alive=True).first()

    def get_or_create_frog(self):
        return self.get_current_living_frog() or FrogProfile.adopt_from_image(self)

    def __str__(self):
        return f"{self.get_full_name()} <{self.email}>"

    @classmethod
    def frame_view(cls, frame_url, frame_interaction_json):
        loaded = json.loads(frame_interaction_json)
        loaded["interactor"] = loaded.get("interactor") or {}
        loaded["interactor"].pop("viewerContext", "")
        interaction = FrameInteraction(
            interactor=Author(
                **{
                    k: v
                    for k, v in loaded.get("interactor", {}).items()
                    if k in ["fid", "username", "displayName", "followerCount", "followingCount", "verifiedAddresses"]
                }
            ),
            cast=loaded.get("cast")
                 and Cast(**{k: v for k, v in loaded.get("cast", {}).items() if k in ["hash", "timestamp", "text"]}),
        )
        if not interaction or not interaction.interactor or not interaction.interactor.fid:
            user = None
        else:
            eth_addrs = (
                    interaction.interactor.verifiedAddresses
                    and interaction.interactor.verifiedAddresses["ethAddresses"]
                    or []
            )
            if isinstance(eth_addrs, str):
                eth_addrs = json.loads(eth_addrs)
            user = cls.objects.update_or_create(
                farcaster_id=interaction.interactor.fid,
                defaults={
                    "email": f"{interaction.interactor.fid}@farcaster.xyz",
                    "username": interaction.interactor.username,
                    "first_name": interaction.interactor.displayName,
                    "follower_count": interaction.interactor.followerCount,
                    "following_count": interaction.interactor.followingCount,
                    "verified_address": eth_addrs and eth_addrs[-1],
                },
            )[0]
        view = FrameView.objects.create(
            user=user,
            frame_url=frame_url,
            interaction=loaded,
            cast_hash=interaction and interaction.cast and interaction.cast.hash,
            cast_text=interaction and interaction.cast and interaction.cast.text,
            cast_timestamp=interaction and interaction.cast and interaction.cast.timestamp,
        )
        return view, interaction


class FrameView(TimestampMixin, UUIDMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    frame_url = models.CharField(max_length=255)
    interaction = models.JSONField()
    cast_hash = models.CharField(max_length=255, null=True, blank=True)
    cast_text = models.TextField(null=True, blank=True)
    cast_timestamp = models.DateTimeField(null=True, blank=True)
