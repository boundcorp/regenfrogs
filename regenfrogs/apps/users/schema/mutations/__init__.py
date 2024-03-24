import json

import graphene

from regenfrogs.apps.users.models import User
from regenfrogs.utils.graphql import success_or_error


class InteractionSuccess(graphene.ObjectType):
    success = graphene.Boolean()


class FrameInteractionMutation(graphene.Mutation):
    class Arguments:
        frame_url = graphene.String(required=True)
        interaction_json = graphene.String(required=True)

    Output = success_or_error(InteractionSuccess)

    def mutate(self, info, frame_url, interaction_json):
        view, interaction = User.frame_view(frame_url, interaction_json)
        print(frame_url, view.user)
        return InteractionSuccess(success=True)


class Mutations(object):
    frame_interaction = FrameInteractionMutation.Field()
