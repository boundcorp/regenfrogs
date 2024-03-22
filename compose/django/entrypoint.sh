#!/bin/sh

sleep 3
python3 manage.py migrate

if [ "$GS_CREDENTIALS_BASE64" != "" ] ; then
  export GOOGLE_APPLICATION_CREDENTIALS=/tmp/google-credentials.json
  echo "Dumping Google Application credentials to file $GOOGLE_APPLICATION_CREDENTIALS"
  echo $GS_CREDENTIALS_BASE64 | base64 -d > $GOOGLE_APPLICATION_CREDENTIALS
fi

if [ "$KUBE_CREDENTIALS_BASE64" != "" ] ; then
  export KUBECONFIG=/tmp/kube-credentials.json
  echo "Dumping Kubectl credentials to file $KUBECONFIG"
  echo $KUBE_CREDENTIALS_BASE64 | base64 -d > $KUBECONFIG
fi

if [ "$SERVICE" = "uwsgi" ] || [ "$SERVICE" = "backend" ] ; then
  python3 manage.py collectstatic --noinput || true
fi

exec "$@"
