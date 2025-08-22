from django.urls import path
from .views import GigsView

urlpatterns = [
    path('gigs/', GigsView.as_view(), name='gigs'),
]