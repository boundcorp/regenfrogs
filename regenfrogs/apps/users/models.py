from django.contrib.auth.models import AbstractUser
from django.core import signing
from django.db import models

from regenfrogs.utils.email import MailMixin
from regenfrogs.utils.models import MediumIDMixin, TimestampMixin


class AccountTypes(models.TextChoices):
    STAFF = "staff", "Staff"
    USER = "user", "User"


class User(TimestampMixin, MediumIDMixin, AbstractUser, MailMixin):
    account_type = models.CharField(max_length=50, choices=AccountTypes.choices, default=AccountTypes.STAFF)

    def __str__(self):
        return f"{self.get_full_name()} <{self.email}>"

    def get_jwt_token(self, action, **extra_data):
        payload = {"username": self.username, "action": action}
        if extra_data:
            payload.update(**extra_data)
        token = signing.dumps(payload)
        return token

    def send_password_reset_email(self, invitation=False):
        token = self.get_jwt_token("password_reset")
        reset_url = f"auth/password-reset/{token}"
        title = "regenfrogs"
        subject = f"{title}: {invitation and 'Account Invitation' or 'Password Reset'}"
        self.send_action_button_mail(
            subject,
            invitation and "Set Password" or "Reset Password",
            reset_url,
            invitation
            and [
                f"You've been invited to join '{self.name}' on {title}.",
                "Please click the button below to set your password and access your account.",
            ]
            or [
                f"You've requested a password reset for your {title} account.",
                "Please click the button below to reset your password.",
                "If you did not request a password reset, please ignore this email.",
            ],
        )
