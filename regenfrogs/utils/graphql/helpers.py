import re
from typing import Union

import graphene
from django.forms import NullBooleanField
from django_filters import filters

from regenfrogs.utils.graphql.errors import Error
from regenfrogs.utils.graphql.validator.errors import SingleValidationError


def define_model_list_query(return_type: graphene.Field, **arguments):
    def wrap(func):
        return _define_query(
            func,
            graphene.Field(
                graphene.List(graphene.NonNull(return_type), required=True),
                **{k: graphene.Argument(v) for k, v in arguments.items()},
            ),
        )

    return wrap


def define_query(return_type: Union[graphene.Field, graphene.List]):
    def wrap(func):
        return _define_query(func, return_type)

    return wrap


class _define_query:
    def __init__(self, fn, return_type):
        self.fn = fn
        self.return_type = return_type

    def __set_name__(self, owner, name):
        # do something with owner, i.e.
        self.fn.class_name = owner.__name__

        # then replace ourself with the original method
        setattr(owner, f"resolve_{name}", self.fn)
        setattr(owner, name, self.return_type)


def create_validation_error(code: str, message: str):
    return type(code, (SingleValidationError,), {"meta": property(lambda self: {"message": message})})


def camelCase_to_snake(input: str):
    return re.sub(r"(?<!^)(?=[A-Z])", "_", input).lower()


def kwargs_from_filterset(fs):
    return {key: graphene.String() for key, _ in fs.get_filters().items()}


def FilterInput(fs):
    return type(
        f"{fs.__name__}Input",
        (graphene.InputObjectType,),
        {key: graphene.String() for key, _ in fs.get_filters().items()},
    )


def union_type(type_name, *union_types):
    class ResultUnion(graphene.Union):
        class Meta:
            types = (*union_types,)
            name = type_name

    return ResultUnion


def success_or_error(cls, *error_types, name=None):
    if not name:
        success_name = cls.__name__
        if not issubclass(cls, graphene.ObjectType):
            raise NameError(f"{success_name} can only use the success_or_errors helper with type graphene.ObjectType")
        if not success_name.endswith("Success"):
            raise NameError(f"{success_name} can only use the success_or_errors helper when name ends with Success")
        name = success_name[:-7]
        if not name.endswith("Result"):
            name += "Result"

    types = list(error_types) + [
        Error,
    ]

    return union_type(name, cls, *types)


class ArchivedYesNoFormField(NullBooleanField):
    """
    ArchivedYesNoFilter swaps the boolean value and passes to "isnull" filter
    e.g. archived=true means archived_at__isnull=false
    """

    def clean(self, value):
        if value is False or value is None:
            return True
        if value is True:
            return False
        return super(ArchivedYesNoFormField, self).clean(value)


class ArchivedYesNoFilter(filters.BooleanFilter):
    """
    ArchivedYesNoFilter swaps the boolean value and passes to "isnull" filter
    e.g. archived=true means archived_at__isnull=false
    """

    field_class = ArchivedYesNoFormField


class FileBase64UploadInput(graphene.InputObjectType):
    file_data = graphene.String(required=True)
    file_name = graphene.String(required=True)


class IDInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
