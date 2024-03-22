#!/usr/bin/env bash


# From: https://artifacthub.io/packages/helm/cert-manager/cert-manager

kubectl delete -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.12/deploy/manifests/00-crds.yaml

kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.7.2/cert-manager.crds.yaml

helm upgrade --install cert-manager cert-manager \
  --repo https://charts.jetstack.io \
  --namespace cert-manager --create-namespace \
  --version v1.7.2

# From: https://kubernetes.github.io/ingress-nginx/deploy/

helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set rbac.create=true

