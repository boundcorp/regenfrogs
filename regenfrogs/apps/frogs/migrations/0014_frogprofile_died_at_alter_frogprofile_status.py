# Generated by Django 4.2.11 on 2024-03-23 22:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("frogs", "0013_frogprofile_last_loop_frogprofile_next_loop"),
    ]

    operations = [
        migrations.AddField(
            model_name="frogprofile",
            name="died_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="frogprofile",
            name="status",
            field=models.CharField(
                choices=[("Happy", "Happy"), ("Content", "Content"), ("Sad", "Sad")], default="Happy"
            ),
        ),
    ]
