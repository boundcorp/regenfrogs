# Generated by Django 4.2.11 on 2024-03-24 13:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("frogs", "0016_frogprofile_sanity_counter"),
    ]

    operations = [
        migrations.RenameField(
            model_name="frogprofile",
            old_name="ipfs_image_cid",
            new_name="ipfs_image_hash",
        ),
    ]
