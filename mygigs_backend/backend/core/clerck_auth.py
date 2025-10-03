import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import ClerkUser

class ClerkJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        import jwt
        payload = jwt.decode(token, options={"verify_signature": False}, algorithms=["HS256", "RS256"])
        clerk_id = payload.get("sub") or payload.get("id")
        if not clerk_id:
            raise exceptions.AuthenticationFailed("Invalid Clerk token: no user id.")
        from .models import ClerkUser
        try:
            user = ClerkUser.objects.get(clerk_id=clerk_id)
        except ClerkUser.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found.")
        return (user, None)