import graphene
from graphene_django import DjangoObjectType

from regenfrogs.apps.frogs import models


class FrogProfile(DjangoObjectType):
    image_url = graphene.String()

    def resolve_image_url(self, info):
        if self.image and self.image.chosen_image:
            return self.image.ipfs_proxy_url

    class Meta:
        model = models.FrogProfile
