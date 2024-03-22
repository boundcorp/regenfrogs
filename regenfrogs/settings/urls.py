# -*- coding: utf-8 -*-
from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.urls import path, re_path
from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie
from rest_framework.routers import DefaultRouter

from regenfrogs.utils.admin import admin_site
from regenfrogs.utils.views import healthz

# Unused
api_router = DefaultRouter(trailing_slash=True)
api_router.include_root_view = settings.DEBUG
api_router.include_format_suffixes = False

urlpatterns = [
    path("api/", include(api_router.urls)),
    path("mgmt/", admin_site.urls),
    path("healthz/", healthz),
    path(
        "api/graphql/",
        jwt_cookie(
            GraphQLView.as_view(
                graphiql=True,
            )
        ),
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
