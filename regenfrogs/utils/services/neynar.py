import os
from dataclasses import dataclass, field
from typing import Dict, List, Optional

import requests


@dataclass
class Bio:
    text: str
    mentionedProfiles: List = field(default_factory=list)


@dataclass
class Profile:
    bio: Bio


@dataclass
class ViewerContext:
    following: bool
    followedBy: bool


@dataclass
class Author:
    fid: Optional[int]
    username: str
    displayName: str
    followerCount: int
    followingCount: int
    verifiedAddresses: Dict[str, List] = field(default_factory=dict)


@dataclass
class Button:
    index: int
    title: str
    actionType: str
    target: Optional[str] = None


@dataclass
class Frame:
    version: str
    title: str
    image: str
    imageAspectRatio: str
    buttons: List[Button]
    input: Dict
    state: Dict
    postUrl: str
    framesUrl: str


@dataclass
class Embed:
    url: str


@dataclass
class Reactions:
    likes: List = field(default_factory=list)
    recasts: List = field(default_factory=list)


@dataclass
class Replies:
    count: int


@dataclass
class Cast:
    object: str
    hash: str
    threadHash: str
    parentHash: Optional[str]
    parentUrl: Optional[str]
    rootParentUrl: Optional[str]
    parentAuthor: Dict[str, Optional[int]]
    author: Author
    text: str
    timestamp: str
    embeds: List[Embed]
    frames: List[Frame]
    reactions: Reactions
    replies: Replies
    mentionedProfiles: List = field(default_factory=list)


@dataclass
class FrameInteraction:
    interactor: Author
    cast: Optional[Cast] = None


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
