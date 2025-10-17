from django.urls import path, include
from .views import *

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# 🔑 Register the filtered view set to the endpoint the frontend is calling
router.register(r'gigs', UserGigViewSet, basename='user-gigs')

urlpatterns = [
    path('stk-push/', MpesaSTKPushAPIView.as_view(), name='stk_push_request'),
    path('callback/', MpesaCallbackAPIView.as_view(), name='mpesa_callback'),
    path('transactions-api/', MpesaTransactionListAPIView.as_view(), name='transaction_list_api'),
    # NEW: API endpoint for the frontend to check transaction status
    path('check-status/<str:checkout_request_id>/', MpesaTransactionStatusAPIView.as_view(), name='transaction_status'),
    path('gigs/', GigListAPIView.as_view(), name='gig_list'),
    path('clerk/', clerk_webhook_handler, name='clerk-webhook'),
    path('freelancers/', FreelancerListAPIView.as_view(), name='freelancer_list'),
    path('testimonials/', TestimonialListAPIView.as_view(), name='testimonial_list'),
    path('freelancers1/', FreelancerListCreateAPIView.as_view(), name='freelancer_list_create'),
    path('testimonials1/', TestimonialListCreateAPIView.as_view(), name='testimonial_list_create'),
    path('transactions/', MpesaTransactionListAPIView.as_view(), name='transaction_list'),
    path('clerk-users/', ClerkUserListAPIView.as_view(), name='clerk_user_list'),
    # APIView-based endpoints for freelancer dashboard
    path('freelancers-dashboard/', FreelancerDashboardAPIView.as_view(), name='dashboard_freelancer_list_create'),
    # The new API endpoint for the admin dashboard data
    path('dashboard-data/', DashboardDataAPIView.as_view(), name='dashboard_data'),
]
    