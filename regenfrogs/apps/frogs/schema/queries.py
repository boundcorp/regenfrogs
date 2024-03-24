import graphene
from django.utils import timezone

from regenfrogs.apps.frogs.schema import types
from regenfrogs.apps.users.models import User
from regenfrogs.apps.users.schema.types import UserProfile
from regenfrogs.utils.graphql import define_query


class VisitorResponse(graphene.ObjectType):
    user = graphene.Field(UserProfile)
    actions_allowed = graphene.Boolean(required=True)
    cooldown_until = graphene.Int()
    mint_parameters = graphene.Field(types.MintParameters)


class FrogForVisitor(graphene.ObjectType):
    frog = graphene.Field(types.FrogProfile)
    visitor = graphene.Field(VisitorResponse)


class Queries(object):
    @define_query(graphene.Field(FrogForVisitor, id=graphene.String(required=True), fid=graphene.Int()))
    def frog_for_visitor(self, info, id, fid=None):
        from regenfrogs.apps.frogs.models import FrogProfile

        frog = FrogProfile.objects.get(pk=id)
        visitor = User.objects.get(farcaster_id=fid) if fid else None
        cooldown_until = visitor is not None and frog.get_cooldown_until(visitor)
        actions_allowed = visitor is not None and cooldown_until < timezone.now()

        return FrogForVisitor(
            frog=frog,
            visitor=VisitorResponse(
                user=visitor,
                actions_allowed=actions_allowed,
                cooldown_until=cooldown_until and (cooldown_until - timezone.now()).total_seconds(),
                mint_parameters=frog.mint_for(visitor),
            ),
        )

    @define_query(graphene.Field(types.FrogProfile, fid=graphene.Int(required=True)))
    def frog_by_fid(self, info, fid):
        return User.objects.get(farcaster_id=fid).get_latest_frog()
