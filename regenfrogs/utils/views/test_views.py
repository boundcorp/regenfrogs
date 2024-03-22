from unittest.mock import MagicMock

from django.db import connection


def test_health(client):
    # This raises an exception in testing, but we want to pretend the DB connection was OK
    connection.ensure_connection = MagicMock()

    assert client.get("/healthz/").status_code == 200

    # But if it did raise an exception, we expect healthz to fail
    def always_raise():
        raise

    connection.ensure_connection = MagicMock(side_effect=always_raise)

    assert client.get("/healthz/").status_code == 500
