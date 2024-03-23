import graphene

from regenfrogs.apps.frogs.schema import types
from regenfrogs.utils.graphql import define_query


class Queries(object):
    @define_query(graphene.Field(types.FrogProfile, id=graphene.String(required=True)))
    def frog(self, info, id):
        from regenfrogs.apps.frogs.models import FrogProfile

        return FrogProfile.objects.get(pk=id)
