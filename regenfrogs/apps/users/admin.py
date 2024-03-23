# type: ignore
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from regenfrogs.utils.admin import register

from . import models


@register(models.User)
class CustomUserAdmin(UserAdmin):
    list_display = [
        "email",
        "is_superuser",
        "is_staff",
        "date_joined",
        "last_login",
    ]
    search_fields = ["username", "email"]
    list_filter = [
        "is_staff",
    ]

    fieldsets = UserAdmin.fieldsets[0:2] + (
        (
            "Access",
            {
                "fields": [
                    "account_type",
                ]
            },
        ),
        ("Django Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
        ("Personal Info", {"fields": ("first_name", "last_name")}),
        (
            "Access",
            {
                "fields": [
                    "account_type",
                ]
            },
        ),
    )


@register(models.FrameView)
class FrameViewAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "frame_url",
        "created_at",
    ]
    search_fields = ["user__email", "frame_url"]
    list_filter = [
        "user",
    ]
    readonly_fields = [
        "user",
        "frame_url",
        "interaction",
        "created_at",
    ]
    fieldsets = (
        (
            None,
            {
                "fields": [
                    "user",
                    "frame_url",
                    "interaction",
                    "created_at",
                ]
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "fields": [
                    "user",
                    "frame_url",
                    "interaction",
                    "created_at",
                ]
            },
        ),
    )
    ordering = ["-created_at"]
    date_hierarchy = "created_at"
    save_on_top = True
    actions_on_top = True
    actions_on_bottom = True
    list_per_page = 25
    list_max_show_all = 100
    list_select_related = True