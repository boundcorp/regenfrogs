import graphene
from graphene_django import DjangoObjectType

from regenfrogs.apps.frogs import models


class FrogProfile(DjangoObjectType):
    image_url = graphene.String()

    def resolve_image_url(self, info):
        if self.chosen_avatar and self.avatar:
            return self.get_chosen_avatar().url

    class Meta:
        model = models.FrogProfile
