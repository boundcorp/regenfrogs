import json

import graphene

from regenfrogs.utils.graphql import success_or_error
from regenfrogs.utils.graphql.validator.decorators import validated
from regenfrogs.utils.services.neynar import FrameInteraction


class InteractionSuccess(graphene.ObjectType):
    success = graphene.Boolean()


class FrameInteractionMutation(graphene.Mutation):
    class Arguments:
        interaction_json = graphene.String()

    Output = success_or_error(InteractionSuccess)

    def mutate(self, info, interaction_json):
        interaction = FrameInteraction(**json.loads(interaction_json))
        print("interaction: ", interaction)
        return InteractionSuccess(success=True)


class Mutations(object):
    frame_interaction = FrameInteractionMutation.Field()
