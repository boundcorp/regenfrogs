import graphene

import regenfrogs.apps.users.schema


class Query(
    regenfrogs.apps.users.schema.Queries,
    graphene.ObjectType,
):
    pass


class Mutation(
    regenfrogs.apps.users.schema.Mutations,
    graphene.ObjectType,
):
    pass


application_schema = graphene.Schema(query=Query)
