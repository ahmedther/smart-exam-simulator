#!/bin/sh

set -e
# python manage.py runserver 0.0.0.0:8000

python manage.py collectstatic --noinput

exec gunicorn backend.asgi:application \
    --bind 0.0.0.0:8000 \
    --workers "${GUNICORN_WORKERS:-4}" \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout "${GUNICORN_TIMEOUT:-120}" \
    --access-logfile - \
    --error-logfile - \
    --log-level "${LOG_LEVEL:-info}" \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --forwarded-allow-ips '*' \
    --proxy-protocol