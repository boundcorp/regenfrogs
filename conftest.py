import json
from dataclasses import dataclass
from typing import Callable, Optional, Mapping, Any

import django.conf
import pytest
from graphql_jwt.shortcuts import get_token
from pytest_django.lazy_django import skip_if_no_django

from regenfrogs.apps.users.factories import UserFactory
from regenfrogs.apps.users.models import User

GRAPHQL_ENDPOINT = '/api/graphql/'


@pytest.fixture
def strong_pass():
    # Test password is very strong
    return "B0undC0rp!!"


@pytest.fixture
def test_user(db, strong_pass, client):
    user = UserFactory(password=strong_pass)

    headers = {'HTTP_AUTHORIZATION': f"JWT {get_token(user)}"}

    client.force_login(user)

    def gql(q, variables=None):
        return json.loads(client.post(GRAPHQL_ENDPOINT, {
            "query": q,
            "variables": variables and (json.dumps(variables)) or ""
        }, **headers).content)

    return user, client, gql


@dataclass
class ProjectFixture:
    settings: django.conf.Settings
    client: django.test.client.Client
    query: Callable[[str, Optional[str]], Mapping[str, Any]]
    mutation: Callable[[str, Optional[str]], Mapping[str, Any]]
    user: User


@pytest.fixture
def project_fixture_common(db, settings, test_user):
    user, client, gql = test_user

    def query(q, variables=None):
        reply = gql(q, variables)
        print("---\nQUERY\n---")
        print(q, variables or "")
        print("\n---\nRESULT\n---")
        print(json.dumps(reply, indent=2))
        return reply

    def mutation(q, variables=None):
        reply = gql(q, variables)
        print("---\nMUTATION\n---")
        print(q, variables or "")
        print("\n---\nRESULT\n---")
        print(json.dumps(reply, indent=2))
        return reply

    return ProjectFixture(settings=settings, user=user, client=client, query=query, mutation=mutation)

