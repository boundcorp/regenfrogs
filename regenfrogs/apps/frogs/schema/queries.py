import graphene

from regenfrogs.apps.frogs.schema import types
from regenfrogs.apps.users.models import User
from regenfrogs.utils.graphql import define_query


class Queries(object):
    @define_query(graphene.Field(types.FrogProfile, id=graphene.String(required=True), fid=graphene.Int(required=True)))
    def frog_for_visitor(self, info, id, fid):
        from regenfrogs.apps.frogs.models import FrogProfile

        return FrogProfile.objects.get(pk=id)
    @define_query(graphene.Field(types.FrogProfile, fid=graphene.Int(required=True)))
    def frog_by_fid(self, info, fid):
        return User.objects.get(farcaster_id=fid).get_current_living_frog()
