from django.urls import path, include
from .views import *

from rest_framework.routers import DefaultRouter



# Create a router instance
router = DefaultRouter()

# Register the Gig ViewSet
# This will handle:
# - GET /gigs/ (list)
# - POST /gigs/ (create)
# - GET, PUT, PATCH, DELETE /gigs/{id}/
router.register(r'gigs', GigViewSet, basename='gig')

# Register the Application ViewSet
# This will handle:
# - GET /applications/ (list - filtered by user)
# - POST /applications/ (create - apply to a gig)
# - GET, PATCH /applications/{id}/ (retrieve/update status)
router.register(r'applications', ApplicationViewSet, basename='application')


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
    path('gigs1/', GigListCreateAPIView.as_view(), name='gigs_list_create'),
    path('transactions/', MpesaTransactionListAPIView.as_view(), name='transaction_list'),

    # APIView-based endpoints for freelancer dashboard
    path('dashboard-stats/<str:clerk_id>/', FreelancerDashboardStatsAPIView.as_view(), name='freelancer_dashboard_stats'),
    path('recent-applications/<str:clerk_id>/', FreelancerRecentApplicationsAPIView.as_view(), name='freelancer_recent_applications'),
    path('my-gigs/<str:clerk_id>/', FreelancerGigsAPIView.as_view(), name='freelancer_gigs'),

    # The new API endpoint for the admin dashboard data
    path('dashboard-data/', DashboardDataAPIView.as_view(), name='dashboard_data'),
    path('clerk-users/', ClerkUserListAPIView.as_view(), name='clerk-user-list'),
    path('', include(router.urls)),
]

# api/urls.py

# from rest_framework.routers import DefaultRouter
# from django.urls import path, include
# from .views import *


# # Create a router instance
# router = DefaultRouter()

# # Register the Gig ViewSet
# # This will handle:
# # - GET /gigs/ (list)
# # - POST /gigs/ (create)
# # - GET, PUT, PATCH, DELETE /gigs/{id}/
# router.register(r'gigs', GigViewSet, basename='gig')

# # Register the Application ViewSet
# # This will handle:
# # - GET /applications/ (list - filtered by user)
# # - POST /applications/ (create - apply to a gig)
# # - GET, PATCH /applications/{id}/ (retrieve/update status)
# router.register(r'applications', ApplicationViewSet, basename='application')



# urlpatterns = [
#     # M-Pesa API Endpoints
#     path('stk-push/', MpesaSTKPushAPIView.as_view(), name='stk_push_request'),
#     path('callback/', MpesaCallbackAPIView.as_view(), name='mpesa_callback'),
#     path('check-status/<str:checkout_request_id>/', MpesaTransactionStatusAPIView.as_view(), name='transaction_status'),
#     path('transactions/', MpesaTransactionListAPIView.as_view(), name='transaction_list'),

#     # Consolidated API Endpoints for CRUD operations
#     path('gigs/', GigListCreateAPIView.as_view(), name='gig_list_create'),
#     path('freelancers/', FreelancerListCreateAPIView.as_view(), name='freelancer_list_create'),
#     path('testimonials/', TestimonialListCreateAPIView.as_view(), name='testimonial_list_create'),
    
#     # Clerk Webhook Endpoint
#     path('clerk/', clerk_webhook_handler, name='clerk-webhook'),

#      # The new API endpoint for the admin dashboard data
#     path('dashboard-data/', DashboardDataAPIView.as_view(), name='dashboard_data'),
#     path('clerk-users/', ClerkUserListAPIView.as_view(), name='clerk-user-list'),
#     path('', include(router.urls)),
# ]
