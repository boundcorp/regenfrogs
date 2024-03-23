# Generated by Django 4.2.11 on 2024-03-22 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("frogs", "0008_frogimage_clothes_frogimage_hands_frogimage_species"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="frogimage",
            options={"ordering": ["-created_at"]},
        ),
        migrations.AddField(
            model_name="frogimage",
            name="vectorized_svg",
            field=models.TextField(blank=True, null=True),
        ),
    ]