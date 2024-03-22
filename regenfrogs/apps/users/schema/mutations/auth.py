from datetime import timedelta
from smtplib import SMTPException

import graphene
from django import forms
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.forms import SetPasswordForm
from django.core import signing
from django.core.exceptions import ObjectDoesNotExist
from django.core.signing import BadSignature, SignatureExpired
from graphql_jwt.exceptions import JSONWebTokenError
from graphql_jwt.refresh_token.shortcuts import create_refresh_token, refresh_token_lazy
from graphql_jwt.utils import jwt_encode, jwt_payload

from regenfrogs.apps.users.models import User
from regenfrogs.apps.users.schema.types import UserProfile
from regenfrogs.utils.graphql import Error, success_or_error


class TokenAuthSuccess(graphene.ObjectType):
    token = graphene.String()
    refresh_token = graphene.String()
    user = graphene.Field(UserProfile)


class TokenAuth(graphene.Mutation):
    class Arguments:
        username__iexact = graphene.String(required=True)
        password = graphene.String(required=True)

    Output = success_or_error(TokenAuthSuccess)

    def mutate(self, info, **kwargs):
        try:
            USERNAME_FIELD = "username__iexact"
            username = kwargs.get(USERNAME_FIELD)

            query_kwargs = {USERNAME_FIELD: username}
            password = kwargs.get("password")

            find_user = User.objects.get(**query_kwargs)
            info.context._jwt_token_auth = True
            if hasattr(info.context, "user"):
                info.context.user = find_user

            user = authenticate(
                request=info.context,
                username=find_user.username,
                password=password,
            )
            if not user:
                raise ValueError
            result = {"user": user}
            payload = jwt_payload(user, info.context)
            result["token"] = jwt_encode(payload, info.context)

            if settings.GRAPHQL_JWT.get("JWT_LONG_RUNNING_REFRESH_TOKEN", True):
                if getattr(info.context, "jwt_cookie", False):
                    info.context.jwt_refresh_token = create_refresh_token(user)
                    result["refresh_token"] = info.context.jwt_refresh_token.get_token()
                else:
                    result["refresh_token"] = refresh_token_lazy(user)

            if user:
                if getattr(info.context, "jwt_cookie", False):
                    info.context.jwt_token = result["token"]
                return TokenAuthSuccess(**result)
        except (JSONWebTokenError, ObjectDoesNotExist, ValueError):
            return Error(message="Invalid Credentials")


class SendPasswordResetEmailSuccess(graphene.ObjectType):
    success = graphene.Boolean()


class EmailForm(forms.Form):
    email = forms.EmailField(max_length=254)


class SendPasswordResetEmail(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)

    Output = success_or_error(SendPasswordResetEmailSuccess)

    def mutate(self, info, **kwargs):
        try:
            email = kwargs.get("email")
            f = EmailForm({"email": email})
            if f.is_valid():
                user = User.objects.get(email__iexact=email)
                if user.is_active:
                    user.send_password_reset_email()
                return SendPasswordResetEmailSuccess(success=True)
            return Error(message="Invalid email")
        except ObjectDoesNotExist:
            return SendPasswordResetEmailSuccess(success=True)  # even if user is not registred
        except SMTPException:
            return Error(message="Email could not be sent")


class PasswordResetSuccess(graphene.ObjectType):
    success = graphene.Boolean()


def get_token_payload(token, action, exp=None):
    payload = signing.loads(token, max_age=exp)
    _action = payload.pop("action")
    if _action != action:
        raise ValueError("This token is for something else")
    return payload


class PasswordReset(graphene.Mutation):
    class Arguments:
        token = graphene.String(required=True)
        new_password1 = graphene.String(required=True)
        new_password2 = graphene.String(required=True)

    Output = success_or_error(PasswordResetSuccess)

    def mutate(self, info, **kwargs):
        try:
            token = kwargs.pop("token")
            payload = get_token_payload(token, "password_reset", timedelta(hours=1))
            user = User.objects.get(**payload)
            f = SetPasswordForm(user, kwargs)
            if f.is_valid():
                revoke_user_refresh_token(user)
                user = f.save()
                return PasswordResetSuccess(success=True)
            return Error(message="Invalid password")
        except SignatureExpired:
            return Error(message="Token is expired")
        except (BadSignature, ValueError):
            return Error(message="Token is for something else")


def revoke_user_refresh_token(user):
    refresh_tokens = user.refresh_tokens.all()
    for refresh_token in refresh_tokens:
        try:
            refresh_token.revoke()
        except Exception:  # JSONWebTokenError
            pass


class LogoutSuccess(graphene.ObjectType):
    success = graphene.Boolean()


class Logout(graphene.Mutation):
    Output = success_or_error(LogoutSuccess)

    def mutate(self, info, **kwargs):
        info.context._jwt_token_auth = True
        info.context.jwt_token = ""

        if info.context.user.is_authenticated:
            revoke_user_refresh_token(info.context.user)
            return LogoutSuccess(success=True)
        return Error(message="User is not authenticated")
