import graphene

import regenfrogs.apps.frogs.schema
import regenfrogs.apps.users.schema


class Query(
    regenfrogs.apps.users.schema.Queries,
    regenfrogs.apps.frogs.schema.Queries,
    graphene.ObjectType,
):
    pass


class Mutation(
    regenfrogs.apps.users.schema.Mutations,
    regenfrogs.apps.frogs.schema.Mutations,
    graphene.ObjectType,
):
    pass


application_schema = graphene.Schema(query=Query, mutation=Mutation)
