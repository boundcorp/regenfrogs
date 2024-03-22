# type: ignore
from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.utils.safestring import mark_safe

from regenfrogs.utils.admin import register

from ...utils.ai_models import ImageGenerationStatus
from . import models


@register(models.FrogImage)
class FrogImageAdmin(ModelAdmin):
    list_display = [
        "id",
        "get_generated",
        "prompt",
        "generation_status",
        "requested_at",
        "completed_at",
    ]
    search_fields = ["prompt"]
    list_filter = [
        "generation_status",
    ]
    readonly_fields = [
        "prompt",
        "reply",
        "remote_id",
        "ipfs_hash",
        "generation_status",
        "status_response",
        "waiting_since",
        "waiting_until",
        "requested_at",
        "completed_at",
        "image_chosen",
        "references",
        "image_1",
        "image_2",
        "image_3",
        "image_4",
    ]
    actions = [
        "choose_one",
        "choose_two",
        "choose_three",
        "choose_four",
    ]

    @admin.display(description="Generated Images")
    def get_generated(self, obj):
        if obj.generation_status == ImageGenerationStatus.COMPLETED:
            if obj.image_chosen:
                return preview_image(getattr(obj, f"image_{obj.image_chosen}").url, height=600, width=600)
            return mark_safe(
                '<div style="width: 600px">%s</div>'
                % "".join(
                    [
                        preview_image(img.url)
                        for img in [obj.image_1, obj.image_2, obj.image_3, obj.image_4]
                        if img and img.url
                    ]
                )
            )

    @admin.action(description="Choose #1")
    def choose_one(self, request, queryset):
        for image in queryset:
            image.choose_number(1)
        self.message_user(request, "Number 1 chosen for selected images.")

    @admin.action(description="Choose #2")
    def choose_two(self, request, queryset):
        for image in queryset:
            image.choose_number(2)
        self.message_user(request, "Number 2 chosen for selected images.")

    @admin.action(description="Choose #3")
    def choose_three(self, request, queryset):
        for image in queryset:
            image.choose_number(3)
        self.message_user(request, "Number 3 chosen for selected images.")

    @admin.action(description="Choose #4")
    def choose_four(self, request, queryset):
        for image in queryset:
            image.choose_number(4)
        self.message_user(request, "Number 4 chosen for selected images.")


def preview_image(url, height=300, width=300):
    return mark_safe(f"<a href='{url}'><img src='{url}' width='{width}' height='{height}' /></a>")
