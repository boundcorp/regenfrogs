import django_filters

from . import models


class UserFilterSet(django_filters.FilterSet):
    class Meta:
        model = models.User
        fields = {
            "email": ["icontains"],
        }
