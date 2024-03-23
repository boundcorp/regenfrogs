import graphene

from regenfrogs.apps.frogs.models import FrogProfile
from regenfrogs.utils.graphql import Error, success_or_error
from regenfrogs.utils.graphql.validator.decorators import validated

from .. import types


class AdoptFrogInput(graphene.InputObjectType):
    id = graphene.String(required=True)
    address = graphene.String(required=True)


class AdoptFrogSuccess(graphene.ObjectType):
    frog = graphene.Field(types.FrogProfile)
    to = graphene.String()


@validated
class AdoptFrog(graphene.Mutation):
    class Arguments:
        input = AdoptFrogInput()

    Output = success_or_error(AdoptFrogSuccess)

    def mutate(self, info, input):
        try:
            frog = FrogProfile.objects.get(pk=input.id)

            return AdoptFrogSuccess(
                frog=frog,
            )
        except Exception as e:
            return Error(message=e)


class MintedFrogInput(graphene.InputObjectType):
    id = graphene.String(required=True)
    nft_id = graphene.Int(required=True)
    address = graphene.String(required=True)
    tx_hash = graphene.String(required=True)
    receipt = graphene.String(required=True)


class MintedFrogSuccess(graphene.ObjectType):
    frog = graphene.Field(types.FrogProfile)


@validated
class MintedFrog(graphene.Mutation):
    class Arguments:
        input = MintedFrogInput()

    Output = success_or_error(MintedFrogSuccess)

    def mutate(self, info, input):
        try:
            frog = FrogProfile.objects.get(pk=input.id)
            if frog.minted_nft_id:
                raise Exception("Frog already minted")
            frog.minted_nft_id = input.nft_id
            frog.minted_nft_address = input.address
            frog.minted_nft_tx = input.tx_hash
            frog.minted_nft_receipt = input.receipt
            frog.save()
            return MintedFrogSuccess(
                frog=frog,
            )
        except Exception as e:
            return Error(message=e)
