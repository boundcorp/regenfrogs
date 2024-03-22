# type: ignore
from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.utils.safestring import mark_safe

from regenfrogs.utils.admin import register

from . import models
from ...utils.ai_models import ImageGenerationStatus


@register(models.FrogImage)
class FrogImageAdmin(ModelAdmin):
    list_display = [
        "id",
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

    @admin.display(description="Generated Images")
    def get_generated(self, obj):
        if obj.generation_status == ImageGenerationStatus.COMPLETED:
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


def preview_image(url, height=300, width=300):
    return mark_safe(f"<a href='{url}'><img src='{url}' width='{width}' height='{height}' /></a>")
