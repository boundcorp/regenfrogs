from io import StringIO

from django.conf import settings

QUICKNODE_KEY = ""


def upload_to_ipfs(fn: str, buffer: StringIO, content_type: str = "text/plain"):
    import requests

    url = "https://api.quicknode.com/ipfs/rest/v1/s3/put-object"

    response = requests.post(
        url,
        headers={"x-api-key": QUICKNODE_KEY},
        data={"Key": fn, "ContentType": content_type},
        files=[("Body", (fn, buffer, content_type))],
    )
    print("Done!")
    print(response.content)

    return response.json()
