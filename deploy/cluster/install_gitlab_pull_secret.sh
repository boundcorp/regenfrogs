#!/usr/bin/env bash
cd $(dirname $0)/../..

kubectl create ns ${CI_PROJECT_NAME}-staging
kubectl apply -f deploy/cluster/gitlab-pull-secret.secrets.yaml -n ${CI_PROJECT_NAME}-staging
kubectl create ns ${CI_PROJECT_NAME}-production
kubectl apply -f deploy/cluster/gitlab-pull-secret.secrets.yaml -n ${CI_PROJECT_NAME}-production
