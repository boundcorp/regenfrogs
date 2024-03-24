from graphene_django import DjangoObjectType

from regenfrogs.apps.users import models


class UserProfile(DjangoObjectType):
    class Meta:
        model = models.User
        fields = [
            "id",
            "is_staff",
            "email",
            "username",
            "first_name",
            "last_name",
            "farcaster_id",
        ]
