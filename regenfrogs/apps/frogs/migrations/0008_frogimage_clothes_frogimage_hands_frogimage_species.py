# Generated by Django 4.2.11 on 2024-03-22 20:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("frogs", "0007_frogstyle_prompt_prefix"),
    ]

    operations = [
        migrations.AddField(
            model_name="frogimage",
            name="clothes",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="frogimage",
            name="hands",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="frogimage",
            name="species",
            field=models.TextField(blank=True, null=True),
        ),
    ]
