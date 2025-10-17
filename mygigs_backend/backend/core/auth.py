import os
import requests
from rest_framework.exceptions import AuthenticationFailed

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

def verify_clerk_token(token):
    """
    Verify a Clerk JWT by calling Clerk API.
    Raises AuthenticationFailed if invalid.
    """
    if not token:
        raise AuthenticationFailed("Missing token")

    headers = {
        "Authorization": f"Bearer {CLERK_SECRET_KEY}",
    }

    response = requests.get(
        "https://api.clerk.dev/v1/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    if response.status_code != 200:
        raise AuthenticationFailed("Invalid or expired Clerk token")

    return response.json()  # includes user_id, email, etc.
