import base64

import graphene
from django.core.files.base import ContentFile

from regenfrogs.utils.models import _generate_medium_id


class IError(graphene.Interface):
    message = graphene.String(required=True)


class IFieldError(graphene.Interface):
    field = graphene.String(required=True)


class Error(graphene.ObjectType):
    message = graphene.String(required=True)

    class Meta:
        implements = (IError,)


class FieldError(graphene.ObjectType):
    message = graphene.String(required=True)
    field = graphene.String(required=True)

    class Meta:
        implements = (IFieldError,)


def file_upload_field(input, id=None, prefix="upload", allowed_types=None):
    format, data = input["file_data"].split(";base64,")  # format ~= data:image/X,
    ext = input["file_name"].split(".")[-1]  # guess file extension
    id = id or _generate_medium_id()
    if allowed_types:
        if ext not in allowed_types:
            raise ValueError(f"Invalid file extension {ext}, expected: {', '.join(allowed_types)}")

    return ContentFile(base64.b64decode(data), name=f"{prefix}.{id}.{ext}")
