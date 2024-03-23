#!/usr/bin/env bash

set -eux
source ../.secrets.env

if [[ "${2-sepolia}" == "base-mainnet" ]]; then
  RPC_URL=$BASE_MAINNET_RPC
  BLOCKSCAN_KEY=$BASESCAN_API_KEY
  GAS_PRICE=500
elif [[ "${2-sepolia}" == "base-goerli" ]]; then
  RPC_URL=$BASE_GOERLI_RPC
  BLOCKSCAN_KEY=$BASESCAN_API_KEY
  GAS_PRICE=200000000
else
  RPC_URL=$BASE_SEPOLIA_RPC
  BLOCKSCAN_KEY=$BASESCAN_API_KEY
  GAS_PRICE=200000000
fi

forge create #finish this later

