from django.urls import path
from .views import GigsView, GigListView

urlpatterns = [
    path('gigs/', GigsView.as_view(), name='gigs'),
    path('gigs/', GigListView.as_view(), name='gig-list'),
]