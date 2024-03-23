import json
import os
import time
from dataclasses import dataclass
from typing import Optional

from eth_account.messages import encode_defunct
from web3 import Web3

NFT_ABI = json.load(open('contracts/out/RegenFrogs.sol/RegenFrogs.json'))['abi']


def sign_mint_request(to: str, nonce: int, uri: str, price_wei: int, expires: Optional[int] = None):
    w3 = Web3(Web3.HTTPProvider("http://localhost:8545"))  # Never gets used
    args = ["address", "uint256", "string", "uint256", "uint256"]
    values = [Web3.to_checksum_address(to), nonce, uri, price_wei, expires or int(time.time() + 300)]
    base_message = Web3.solidity_keccak(args, values)
    print("Encoding", args, values, "to", base_message.hex())
    message = encode_defunct(base_message)
    signed_message = w3.eth.account.sign_message(message, private_key=os.environ.get("ETH_WALLET_KEY"))
    return signed_message.signature.hex()


@dataclass
class Network(object):
    def __init__(self, name):
        self.name = name
        self.rpc = os.environ.get(f"{name}_RPC")
        self.nft_addr = os.environ.get(f"NEXT_PUBLIC_{name}_NFT_ADDR")

    def __str__(self):
        return self.name

    @property
    def client(self):
        return Web3(Web3.HTTPProvider(self.rpc))

    @property
    def nft_contract(self):
        return self.client.eth.contract(address=self.nft_addr, abi=NFT_ABI)

    def next_nonce(self, address: str):
        if address:
            return self.nft_contract.functions.nonceOf(Web3.to_checksum_address(address)).call() + 1
        else:
            return 1

    def test_mint(self, nonce=None, expires=None):
        from regenfrogs.apps.frogs.models import Frog

        print("RPC:", self.rpc)
        w3 = self.client

        to = os.environ.get("ETH_WALLET_ADDR", "")
        frog = Frog.objects.filter(image__ipfs_hash__isnull=False).first()
        if frog:
            uri = frog.image.ipfs_url
        else:
            uri = "ipfs://debug.txt"
        price_wei = 3000 * 10 ** 18 // 1_000_000

        nonce = nonce or self.next_nonce(to)
        expires = expires or int(time.time() + 180)

        signature = sign_mint_request(to, nonce, uri, price_wei, expires)

        print("To:", to)
        print("Nonce:", nonce)
        print("URI:", uri)
        print("Price:", price_wei)
        print("Signature:", signature)
        print("NFT Balance:", self.nft_contract.functions.balanceOf(to).call())

        def send_tx(to, call, **kwargs):
            tx = call.build_transaction(
                dict(
                    chainId=84532,
                    gas=1000000,
                    maxFeePerGas=w3.to_wei("2", "gwei"),
                    maxPriorityFeePerGas=w3.to_wei("1", "gwei"),
                    nonce=w3.eth.get_transaction_count(to),
                    **kwargs,
                )
            )
            print(tx)
            signed_tx = w3.eth.account.sign_transaction(tx, private_key=os.environ.get("ETH_WALLET_KEY"))
            w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            print("Broadcast tx:", signed_tx.hash.hex())

        mint_is_live = self.nft_contract.functions.live().call()
        if not mint_is_live:
            print("Making it live...")
            send_tx(to, self.nft_contract.functions.toggleLive())

        time.sleep(5)

        print("Minting...")
        send_tx(
            to,
            self.nft_contract.functions.mint(to, nonce, uri, price_wei, expires, signature),
            value=price_wei,
        )


@dataclass
class Networks(object):
    BASE_SEPOLIA = Network("BASE_SEPOLIA")
    BASE_MAINNET = Network("BASE_MAINNET")


CurrentNetwork = getattr(Networks, os.environ.get("NEXT_PUBLIC_CHAIN_NAME", "BASE_SEPOLIA").upper())
