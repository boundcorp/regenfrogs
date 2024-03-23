import os

import requests


def cast_from_bot(message, channel=None, reply=None, embed_urls=None):
    url = "https://api.neynar.com/v2/farcaster/cast"

    payload = {
        "signer_uuid": os.environ.get("NEYNAR_BOT_KEY"),
        "text": message,
        "embeds": [{"url": url} for url in embed_urls or []],
        "parent": reply,
        "channel_id": channel,
    }
    headers = {
        "accept": "application/json",
        "api_key": os.environ.get("NEYNAR_API_KEY"),
        "content-type": "application/json",
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        return response.json()
    except Exception as e:
        return {"error": str(e)}
