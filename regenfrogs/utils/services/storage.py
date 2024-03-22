from datetime import timedelta
from urllib import parse

import urllib3
from django.conf import settings
from minio import Minio


def presigned_put_object(key, content_type, expires=3600):
    if "minio" in settings.DEFAULT_FILE_STORAGE:
        return minio_presigned_put_object(key, expires)
    elif "gcloud" in settings.DEFAULT_FILE_STORAGE:
        return gcp_presigned_put_object(key, content_type, expires)


def gcp_presigned_put_object(key, content_type, expires=3600):
    from google.cloud import storage

    client = storage.Client(credentials=settings.GS_CREDENTIALS)
    bucket = client.bucket(settings.GS_BUCKET_NAME)
    blob = bucket.blob(key)
    return blob.generate_signed_url(
        version="v4",
        expiration=timedelta(seconds=expires),
        content_type=content_type,
        method="PUT",
    )


def minio_presigned_put_object(key, expires=3600):
    client = Minio(
        settings.MINIO_STORAGE_MEDIA_URL.split("/")[2],
        access_key=settings.MINIO_STORAGE_ACCESS_KEY,
        secret_key=settings.MINIO_STORAGE_SECRET_KEY,
        secure=False,
        http_client=urllib3.ProxyManager(f"http://{settings.MINIO_STORAGE_ENDPOINT}"),
    )
    return (
        settings.MINIO_STORAGE_MEDIA_URL
        + "/"
        + "/".join(
            client.presigned_put_object(
                settings.MINIO_STORAGE_MEDIA_BUCKET_NAME, key, expires=timedelta(seconds=expires)
            ).split("/")[4:]
        )
    )


def presigned_get_object(key):
    if "minio" in settings.DEFAULT_FILE_STORAGE:
        return minio_presigned_get_object(key)
    elif "gcloud" in settings.DEFAULT_FILE_STORAGE:
        return gcp_presigned_get_object(key)


def gcp_presigned_get_object(key, expires=86400):
    from google.cloud import storage

    client = storage.Client(credentials=settings.GS_CREDENTIALS)
    bucket = client.bucket(settings.GS_BUCKET_NAME)
    blob = bucket.blob(key)
    return blob.generate_signed_url(
        version="v4",
        method="GET",
        expiration=timedelta(seconds=expires),
    )


def minio_presigned_get_object(key):
    client = Minio(
        settings.MINIO_STORAGE_MEDIA_URL.split("/")[2],
        access_key=settings.MINIO_STORAGE_ACCESS_KEY,
        secret_key=settings.MINIO_STORAGE_SECRET_KEY,
        secure=False,
        http_client=urllib3.ProxyManager(f"http://{settings.MINIO_STORAGE_ENDPOINT}"),
    )
    return (
        settings.MINIO_STORAGE_MEDIA_URL
        + "/"
        + "/".join(client.presigned_get_object(settings.MINIO_STORAGE_MEDIA_BUCKET_NAME, key).split("/")[4:])
    )


def re_sign_url(url):
    if url.startswith(settings.STORAGE_MEDIA_URL):
        url = parse.unquote("/".join(url.split("?")[0].split("/")[4:]))
        return presigned_get_object(url)
