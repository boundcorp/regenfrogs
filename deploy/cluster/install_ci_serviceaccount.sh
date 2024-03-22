#!/usr/bin/env bash
cd $(dirname $0)/../..


for ENV in staging production ; do
  NAMESPACE="${CI_PROJECT_NAME}-${ENV}"
  kubens $NAMESPACE

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ci-service-account
  namespace: $NAMESPACE
EOF

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: ci-service-account-token
  namespace: $NAMESPACE
  annotations:
    kubernetes.io/service-account.name: ci-service-account
type: kubernetes.io/service-account-token
EOF

cat <<EOF | kubectl apply -f -
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: ci-$NAMESPACE-role
  namespace: $NAMESPACE
rules:
  - apiGroups:
        - "*"
    resources:
        - "*"
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
EOF

cat <<EOF | kubectl apply -f -
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: ci-role-binding
subjects:
- namespace: $NAMESPACE
  kind: ServiceAccount
  name: ci-service-account
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: ci-$NAMESPACE-role
EOF

echo "Verifying the service account..."
kubectl auth can-i get pods --as=system:serviceaccount:$NAMESPACE:ci-service-account

echo "Getting the service account connection file..."
SERVICE_ACCOUNT_NAME=ci-service-account
CONTEXT=$(kubectl config current-context)

NEW_CONTEXT=$NAMESPACE
KUBECONFIG_FILE="kubeconfig-sa.$ENV.secrets.yaml"


TOKEN_DATA=$(kubectl get secret ci-service-account-token \
  --context ${CONTEXT} \
  --namespace ${NAMESPACE} \
  -o jsonpath='{.data.token}')

TOKEN=$(echo ${TOKEN_DATA} | base64 -d)
echo "Got ci-service-account-token: ${TOKEN}"

# Create dedicated kubeconfig
# Create a full copy
kubectl config view --raw > ${KUBECONFIG_FILE}.full.tmp
# Switch working context to correct context
kubectl --kubeconfig ${KUBECONFIG_FILE}.full.tmp config use-context ${CONTEXT}
# Minify
kubectl --kubeconfig ${KUBECONFIG_FILE}.full.tmp \
  config view --flatten --minify > ${KUBECONFIG_FILE}.tmp
# Rename context
kubectl config --kubeconfig ${KUBECONFIG_FILE}.tmp \
  rename-context ${CONTEXT} ${NEW_CONTEXT}
# Create token user
kubectl config --kubeconfig ${KUBECONFIG_FILE}.tmp \
  set-credentials ${CONTEXT}-${NAMESPACE}-token-user \
  --token ${TOKEN}
# Set context to use token user
kubectl config --kubeconfig ${KUBECONFIG_FILE}.tmp \
  set-context ${NEW_CONTEXT} --user ${CONTEXT}-${NAMESPACE}-token-user
# Set context to correct namespace
kubectl config --kubeconfig ${KUBECONFIG_FILE}.tmp \
  set-context ${NEW_CONTEXT} --namespace ${NAMESPACE}
# Flatten/minify kubeconfig
kubectl config --kubeconfig ${KUBECONFIG_FILE}.tmp \
  view --flatten --minify > ${KUBECONFIG_FILE}
# Remove tmp
rm ${KUBECONFIG_FILE}.full.tmp
rm ${KUBECONFIG_FILE}.tmp

done
