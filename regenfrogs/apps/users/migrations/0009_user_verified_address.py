# Generated by Django 4.2.11 on 2024-03-24 13:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0008_user_follower_count_user_following_count"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="verified_address",
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
    ]
