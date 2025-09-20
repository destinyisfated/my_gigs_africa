from django.urls import path
from .views import *

urlpatterns = [
    path('stk-push/', MpesaSTKPushAPIView.as_view(), name='stk_push_request'),
    path('callback/', MpesaCallbackAPIView.as_view(), name='mpesa_callback'),
    path('transactions-api/', MpesaTransactionListAPIView.as_view(), name='transaction_list_api'),
     # NEW: API endpoint for the frontend to check transaction status
    path('check-status/<str:checkout_request_id>/', MpesaTransactionStatusAPIView.as_view(), name='transaction_status'),
   path('gigs/', GigListAPIView.as_view(), name='gig_list'),
   path('clerk/', clerk_webhook_handler, name='clerk-webhook'),
]

