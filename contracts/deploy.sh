#!/usr/bin/env bash

set -eux
source ../.secrets.env

# https://rainforestfoundation.org/give/cryptocurrency/
CHARITY="0x338326660F32319E2B0Ad165fcF4a528c1994aCb"

if [[ "${1-sepolia}" == "base-mainnet" ]]; then
  RPC_URL=$BASE_MAINNET_RPC
  BLOCKSCAN_KEY=$BASESCAN_API_KEY
  GAS_PRICE=150000000
elif [[ "${1-sepolia}" == "base-goerli" ]]; then
  RPC_URL=$BASE_GOERLI_RPC
  BLOCKSCAN_KEY=$BASESCAN_API_KEY
  GAS_PRICE=200000000
else
  RPC_URL=$BASE_SEPOLIA_RPC
  BLOCKSCAN_KEY=$BASESCAN_API_KEY
  GAS_PRICE=200000000
fi

echo "Deploying NFT"
forge create --rpc-url $RPC_URL \
--constructor-args "RegenFrogs" "REFROG" "$ETH_WALLET_ADDR" "$CHARITY" \
--private-key $ETH_WALLET_KEY \
--etherscan-api-key $BLOCKSCAN_KEY \
--optimize \
--optimizer-runs 5000 \
--gas-price $GAS_PRICE \
--gas-limit 3000000 \
--verify \
src/RegenFrogs.sol:RegenFrogs
