#!/usr/bin/env bash

test -z "$DJANGO_SETTINGS_MODULE" && export DJANGO_SETTINGS_MODULE="regenfrogs.settings"

echo "Using settings: $DJANGO_SETTINGS_MODULE"

uwsgi --chdir=/app \
    --http 0.0.0.0:8000 \
    --module=wsgi:application \
    --env DJANGO_SETTINGS_MODULE="${DJANGO_SETTINGS_MODULE}" \
    --master --pidfile=/tmp/project-master.pid \
    --socket=127.0.0.1:49152 \
    --processes=5 \
    --uid=1000 --gid=2000 \
    --harakiri=20 \
    --max-requests=5000 \
    --vacuum
