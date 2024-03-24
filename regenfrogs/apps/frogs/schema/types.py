import graphene
from graphene_django import DjangoObjectType

from regenfrogs.apps.frogs import models


class FrogProfile(DjangoObjectType):
    image_url = graphene.String()

    def resolve_image_url(self, info):
        return self.image_url

    class Meta:
        model = models.FrogProfile
