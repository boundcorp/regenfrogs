import graphene

from regenfrogs.utils.graphql import success_or_error
from regenfrogs.utils.graphql.validator.decorators import validated


class InteractionSuccess(graphene.ObjectType):
    success = graphene.Boolean()


@validated
class FrameInteractionMutation(graphene.Mutation):
    class Arguments:
        interaction_json = graphene.String()

    Output = success_or_error(InteractionSuccess)

    def mutate(self, info, interaction_json):
        print("interaction: ", interaction_json)
        return InteractionSuccess(success=True)


class Mutations(object):
    frame_interaction = FrameInteractionMutation.Field()
