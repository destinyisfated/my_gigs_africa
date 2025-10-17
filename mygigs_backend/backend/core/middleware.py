import jwt
from django.conf import settings
from django.contrib.auth.models import User

class ClerkJWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                decoded = jwt.decode(token, settings.CLERK_PUBLIC_KEY, algorithms=['RS256'], audience=settings.CLERK_AUDIENCE)
                clerk_id = decoded['sub']
                user = User.objects.get(clerk_id=clerk_id)
                request.user = user
            except Exception:
                pass  # Handle invalid token
        return self.get_response(request)