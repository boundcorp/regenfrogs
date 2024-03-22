import logging
import os
import sys

if "TEST_USE_ENV" not in os.environ:
    # Let's reset ENV variables values for testing

    del sys.modules["regenfrogs.settings"]
    del sys.modules["regenfrogs.settings.project"]

from regenfrogs.settings import *

SECRET_KEY = "Test Only Key"

IS_TEST = True

print("TEST MODE DEFAULTS, disabling unneeded plugins")

logging.disable(logging.CRITICAL)
DEBUG = True
print("TEST MODE: DEBUG=%s" % DEBUG)

# Once we reach a certain degree of complexity, this needs to be removed
print("TEST MODE: Using sqlite DB")
DATABASES["default"] = {
    "ENGINE": "django.db.backends.sqlite3",
    "NAME": ".sqlite-test-db",
}
print("TEST MODE: Use fast MD5PasswordHasher")
PASSWORD_HASHERS = ("django.contrib.auth.hashers.MD5PasswordHasher",)

EMAIL_BACKEND = "regenfrogs.conf.test_settings.MockEmailBackend"

STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"

BASE_URL = f"http://localhost:{BACKEND_PORT}"
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
