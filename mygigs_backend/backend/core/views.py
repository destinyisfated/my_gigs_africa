# Create your views here.
from datetime import datetime
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, parsers, serializers, viewsets, mixins, authentication
import requests
from rest_framework import parsers, serializers
from requests.auth import HTTPBasicAuth
from .models import MpesaTransaction, Gig, ClerkUser, Freelancer, Testimonial, Application
from rest_framework.generics import ListAPIView, ListCreateAPIView
from .serializers import MpesaTransactionSerializer, GigSerializer, FreelancerSerializer, TestimonialSerializer, ClerkUserSerializer, ApplicationSerializer
import base64
import json
import os
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from svix.webhooks import Webhook, WebhookVerificationError
from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.db.models import Sum, Count
from rest_framework.decorators import api_view, permission_classes
from .clerck_auth import ClerkJWTAuthentication




def get_access_token():
    """
    Fetches a new M-Pesa API access token using the consumer key and secret.
    """
    try:
        consumer_key = settings.CONSUMER_KEY
        consumer_secret = settings.CONSUMER_SECRET

        if not consumer_key or not consumer_secret:
            raise ValueError("CONSUMER_KEY or CONSUMER_SECRET not found in settings.")

        # M-Pesa API endpoint for fetching the access token
        url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        
        # Use HTTP Basic Authentication to send the consumer key and secret
        response = requests.get(url, auth=HTTPBasicAuth(consumer_key, consumer_secret))
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)

        access_token = response.json().get('access_token')
        if not access_token:
            raise ValueError("Access token not found in API response.")

        return access_token

    except requests.exceptions.RequestException as e:
        print(f"Failed to get M-Pesa access token: {e}")
        return None
    except ValueError as e:
        print(f"Error getting M-Pesa access token: {e}")
        return None

class MpesaSTKPushAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # 1. First, get a new access token
        access_token = get_access_token()
        if not access_token:
            return Response(
                {"error": "Could not get an M-Pesa access token."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        clerk_id = request.data.get('clerk_id')

        # 2. Validate incoming data from the frontend
        try:
            phone_number = request.data.get('phone_number')
            amount = request.data.get('amount')
            if not phone_number or not amount:
                return Response(
                    {"error": "Missing phone_number or amount in request body."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            amount = int(amount)
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid amount provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Generate the required security credentials
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(
            f"{settings.BUSINESS_SHORTCODE}{settings.PASSKEY}{timestamp}".encode('utf-8')
        ).decode('utf-8')

        # 4. Prepare the M-Pesa API payload
        payload = {
            "BusinessShortCode": settings.BUSINESS_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": settings.BUSINESS_SHORTCODE,
            "PhoneNumber": phone_number,
            "CallBackURL": settings.MPESA_CALLBACK_URL,
            "AccountReference": "MyCompany",
            "TransactionDesc": "Payment for an item"
        }

        # 5. Make the STK Push API request with the fetched access token
        try:
            response = requests.post(
                "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                json=payload,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            response.raise_for_status()
            
            response_data = response.json()
            MpesaTransaction.objects.create(
                merchant_request_id=response_data.get('MerchantRequestID'),
                checkout_request_id=response_data.get('CheckoutRequestID'),
                phone_number=phone_number,
                amount=amount,
                clerk_id=clerk_id

            )
            return Response(response_data, status=response.status_code)

        except requests.exceptions.RequestException as e:
            print(f"M-Pesa STK Push request failed: {e}")
            return Response(
                {"error": "Failed to connect to M-Pesa API. Check your network or API keys."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return Response(
                {"error": "An internal server error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MpesaCallbackAPIView(APIView):
    def post(self, request, *args, **kwargs):
        callback_data = request.data.get('Body', {}).get('stkCallback', {})
        merchant_request_id = callback_data.get('MerchantRequestID')
        checkout_request_id = callback_data.get('CheckoutRequestID')
        result_code = callback_data.get('ResultCode')
        result_desc = callback_data.get('ResultDesc')
        
        if result_code == 0:
            callback_metadata = callback_data.get('CallbackMetadata', {}).get('Item', [])
            
            amount = None
            mpesa_receipt_number = None
            transaction_date = None
            phone_number = None

            for item in callback_metadata:
                if item['Name'] == 'Amount':
                    amount = item['Value']
                elif item['Name'] == 'MpesaReceiptNumber':
                    mpesa_receipt_number = item['Value']
                elif item['Name'] == 'TransactionDate':
                    transaction_date = datetime.strptime(str(item['Value']), '%Y%m%d%H%M%S')
                elif item['Name'] == 'PhoneNumber':
                    phone_number = item['Value']

            try:
                transaction = MpesaTransaction.objects.get(
                    merchant_request_id=merchant_request_id,
                    checkout_request_id=checkout_request_id
                )
                
                transaction.result_code = result_code
                transaction.result_desc = result_desc
                transaction.amount = amount
                transaction.mpesa_receipt_number = mpesa_receipt_number
                transaction.transaction_date = transaction_date
                transaction.phone_number = phone_number
                transaction.save()

                clerk_id = transaction.clerk_id
                print("clerk_id in callback:", clerk_id)
                print("ClerkUser exists:", ClerkUser.objects.filter(clerk_id=clerk_id).exists())

                if clerk_id:
                    try:
                        user = ClerkUser.objects.get(clerk_id=clerk_id)
                        user.role = 'freelancer'  # or user.is_freelancer = True
                        user.save()
                        print(user.role)
                        update_clerk_role_to_freelancer(clerk_id)
                    except ClerkUser.DoesNotExist:
                        print("User not found for clerk_id:", clerk_id)
                
                print(f"Successfully updated transaction: {mpesa_receipt_number}")

            except MpesaTransaction.DoesNotExist:
                print("Transaction record not found in database.")

        else:
            print(f"Transaction failed with ResultCode: {result_code}, Description: {result_desc}")
            try:
                transaction = MpesaTransaction.objects.get(
                    merchant_request_id=merchant_request_id,
                    checkout_request_id=checkout_request_id
                )
                transaction.result_code = result_code
                transaction.result_desc = result_desc
                transaction.save()
            except MpesaTransaction.DoesNotExist:
                print("Transaction record for failed request not found.")

        return Response({"ResultCode": 0, "ResultDesc": "Success"}, status=status.HTTP_200_OK)


class MpesaTransactionListAPIView(ListAPIView):
    """
    API view to list all M-Pesa transactions.
    """
    queryset = MpesaTransaction.objects.all().order_by('-created_at')
    serializer_class = MpesaTransactionSerializer

class MpesaTransactionStatusAPIView(APIView):
    def get(self, request, checkout_request_id, *args, **kwargs):
        try:
            # Find the transaction by its CheckoutRequestID
            mpesa_transaction = MpesaTransaction.objects.get(checkout_request_id=checkout_request_id)
            
            # Return the status based on the ResultCode
            if mpesa_transaction.result_code == "0":
                return Response({"status": "success"}, status=status.HTTP_200_OK)
            elif mpesa_transaction.result_code:
                # If there is a ResultCode, but it's not "0", it's a failure
                return Response({"status": "failed"}, status=status.HTTP_200_OK)
            else:
                # Still pending if no ResultCode is available
                return Response({"status": "pending"}, status=status.HTTP_200_OK)
        
        except MpesaTransaction.DoesNotExist:
            return Response({"status": "pending"}, status=status.HTTP_200_OK)
        except Exception as e:
            # Catch-all for any other unexpected error
            print(f"Error checking transaction status for ID {checkout_request_id}: {e}")
            return Response({"status": "error", "message": "An internal server error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GigListAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """
        Retrieves all Gig objects and returns them as a JSON list.
        """
        gigs = Gig.objects.all()
        serializer = GigSerializer(gigs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@csrf_exempt
def clerk_webhook_handler(request):
    print("Clerk webhook called")
    # Get the webhook signing secret from your environment variables
    # This secret is configured in your Clerk Dashboard
    webhook_secret = settings.CLERK_WEBHOOK_SECRET

    # Get webhook headers and payload from the request
    headers = request.headers
    payload = request.body.decode('utf-8')

    try:
        # Verify the webhook signature
        wh = Webhook(webhook_secret)
        evt = wh.verify(payload, headers)
    except WebhookVerificationError:
        print("Webhook verification failed.")
        return HttpResponse(status=400)
    
    event_type = evt.get("type")
    
    # Handle user creation or update robustly with error handling
    if event_type in ["user.created", "user.updated"]:
        user_data = evt.get("data", {})
        clerk_id = user_data.get("id")
        email = user_data.get("email_addresses", [{}])[0].get("email_address")
        first_name = user_data.get("first_name")
        last_name = user_data.get("last_name")

        try:
            user, created = ClerkUser.objects.get_or_create(
                clerk_id=clerk_id,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                }
            )
            if not created:
                # Update fields if user already exists
                user.first_name = first_name
                user.last_name = last_name
                user.email = email
                user.save()
                print(f"User updated: {clerk_id}")
            else:
                print(f"User created: {clerk_id}")
        except Exception as e:
            print("Error in Clerk webhook user creation:", e)

    # Handle user deletion
    elif event_type == "user.deleted":
        user_data = evt.get("data", {})
        clerk_id = user_data.get("id")
        ClerkUser.objects.filter(clerk_id=clerk_id).delete()
        print(f"User deleted: {clerk_id}")

    return HttpResponse(status=200)

def update_clerk_role_to_freelancer(clerk_id):
    CLERK_API_KEY = settings.CLERK_SECRET_KEY
    if not CLERK_API_KEY:
        print("CLERK_SECRET_KEY not set in environment.")
        return

    headers = {
        "Authorization": f"Bearer {CLERK_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "public_metadata": {
            "role": "freelancer"
        }
    }
    resp = requests.patch(
        f"https://api.clerk.com/v1/users/{clerk_id}",
        headers=headers,
        json=data
    )
    print(f"Clerk API response: {resp.status_code} {resp.text}")



# Create a list view for Freelancer model
class FreelancerListAPIView(APIView):
    def get(self, request, format=None):
        freelancers = Freelancer.objects.all()
        serializer = FreelancerSerializer(freelancers, many=True)
        return Response(serializer.data)

# Create a list view for Testimonial model
class TestimonialListAPIView(APIView):
    def get(self, request, format=None):
        testimonials = Testimonial.objects.all()
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response(serializer.data)


class FreelancerListCreateAPIView(generics.ListCreateAPIView):
    queryset = Freelancer.objects.all()
    serializer_class = FreelancerSerializer

class TestimonialListCreateAPIView(generics.ListCreateAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

# class GigsListCreateAPIView(generics.ListCreateAPIView):
#     queryset = Gig.objects.all()
#     serializer_class = GigSerializer
class GigCreateView(generics.CreateAPIView):
    queryset = Gig.objects.all()
    serializer_class = GigSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        # Get the ClerkClient instance for the current authenticated user.
        try:
            creator_instance = ClerkUser.objects.get(clerk_id=self.request.user.clerk_id)
        except ClerkUser.DoesNotExist:
            raise serializers.ValidationError("Clerk user does not exist in our database.")
            
        # Pass the creator instance directly to the serializer's create method.
        # This will be used by the serializer to get the email automatically.
        serializer.save(creator=creator_instance)




class GigListCreateAPIView(ListCreateAPIView):
    """
    API view to list all Gigs and create a new one.
    """
    queryset = Gig.objects.all()
    serializer_class = GigSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    permission_classes = [IsAuthenticated] 
    def perform_create(self, serializer) -> None:
        """
        Saves the gig with the authenticated user as the creator.
        """
        try:
            # Corrected from `ClerkClient` to `ClerkUser`
            creator_instance = ClerkUser.objects.get(clerk_id=self.request.user.clerk_id)
        except ClerkUser.DoesNotExist:
            raise serializers.ValidationError("Clerk user does not exist in our database.")
            
        serializer.save(creator=creator_instance)



# class FreelancerListCreateAPIView(ListCreateAPIView):
#     """
#     API view to list and create Freelancer profiles.
#     """
#     queryset = Freelancer.objects.all()
#     serializer_class = FreelancerSerializer


# class TestimonialListCreateAPIView(ListCreateAPIView):
#     """
#     API view to list and create Testimonials.
#     """
#     queryset = Testimonial.objects.all()
#     serializer_class = TestimonialSerializer


# @csrf_exempt
# def clerk_webhook_handler(request) -> HttpResponse:
#     """
#     Handles webhooks from Clerk for user creation, update, and deletion.
#     """
#     print("Clerk webhook called")
#     webhook_secret = settings.CLERK_WEBHOOK_SECRET
#     headers = request.headers
#     payload = request.body.decode('utf-8')

#     try:
#         wh = Webhook(webhook_secret)
#         evt = wh.verify(payload, headers)
#     except WebhookVerificationError:
#         print("Webhook verification failed.")
#         return HttpResponse(status=400)
    
#     event_type = evt.get("type")
#     user_data = evt.get("data", {})
#     clerk_id = user_data.get("id")

#     if event_type in ["user.created", "user.updated"]:
#         email = user_data.get("email_addresses", [{}])[0].get("email_address")
#         first_name = user_data.get("first_name")
#         last_name = user_data.get("last_name")

#         try:
#             user, created = ClerkUser.objects.get_or_create(
#                 clerk_id=clerk_id,
#                 defaults={
#                     "first_name": first_name,
#                     "last_name": last_name,
#                     "email": email,
#                 }
#             )
#             if not created:
#                 user.first_name = first_name
#                 user.last_name = last_name
#                 user.email = email
#                 user.save()
#                 print(f"User updated: {clerk_id}")
#             else:
#                 print(f"User created: {clerk_id}")
#         except Exception as e:
#             print(f"Error in Clerk webhook user creation/update: {e}")

#     elif event_type == "user.deleted":
#         ClerkUser.objects.filter(clerk_id=clerk_id).delete()
#         print(f"User deleted: {clerk_id}")

#     return HttpResponse(status=200)

def update_clerk_role_to_freelancer(clerk_id: str) -> None:
    """
    Calls the Clerk API to update a user's role to 'freelancer'.
    This is an expensive, blocking call and should ideally be a background task.
    """
    CLERK_API_KEY = settings.CLERK_SECRET_KEY
    if not CLERK_API_KEY:
        print("CLERK_SECRET_KEY not set in environment.")
        return

    headers = {
        "Authorization": f"Bearer {CLERK_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "public_metadata": {
            "role": "freelancer"
        }
    }
    resp = requests.patch(
        f"https://api.clerk.com/v1/users/{clerk_id}",
        headers=headers,
        json=data
    )
    print(f"Clerk API response: {resp.status_code} {resp.text}")

class DashboardDataAPIView(APIView):
    """
    API view to fetch all data required for the admin dashboard in a single call.
    """
    def get(self, request, *args, **kwargs) -> Response:
        try:
            # Fetch all data from the database
            gigs = Gig.objects.all()
            freelancers = Freelancer.objects.all()
            testimonials = Testimonial.objects.all()
            transactions = MpesaTransaction.objects.all().order_by('-created_at')
            users = ClerkUser.objects.all()
            
            # Serialize the data
            gigs_data = GigSerializer(gigs, many=True).data
            freelancers_data = FreelancerSerializer(freelancers, many=True).data
            testimonials_data = TestimonialSerializer(testimonials, many=True).data
            transactions_data = MpesaTransactionSerializer(transactions, many=True).data
            users_data = ClerkUserSerializer(users, many=True).data

            # Combine into a single JSON response
            dashboard_data = {
                'gigs': gigs_data,
                'freelancers': freelancers_data,
                'testimonials': testimonials_data,
                'transactions': transactions_data,
                'users': users_data,
            }

            return Response(dashboard_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"Error fetching dashboard data: {e}")
            return Response(
                {"error": "An internal server error occurred while fetching dashboard data."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# # --- The new API View ---
class ClerkUserListAPIView(ListAPIView):
    """
    API view to return a list of all ClerkUser instances.
    """
    # The queryset property defines the set of objects to be returned by the view.
    # We are selecting all objects from the ClerkUser model.
    queryset = ClerkUser.objects.all()
    
    serializer_class = ClerkUserSerializer


# --- 1. Custom Permission Class ---

# class IsGigCreatorOrApplicant(permissions.BasePermission):
#     """
#     Custom permission to only allow the Gig Creator to view/update applications
#     or the Applicant to view their own application.
#     """
#     def has_object_permission(self, request, view, obj):
#         # Read permissions are allowed to the applicant or the gig creator
#         if request.method in permissions.SAFE_METHODS:
#             is_applicant = obj.applicant.clerk_id == request.user.clerk_id
#             is_gig_creator = obj.gig.creator.clerk_id == request.user.clerk_id
#             return is_applicant or is_gig_creator

#         # Write permissions (UPDATE/PATCH) are ONLY allowed to the Gig Creator
#         if request.method in ['PUT', 'PATCH']:
#             return obj.gig.creator.clerk_id == request.user.clerk_id
        
#         # Deny all other methods (like DELETE) unless explicitly defined
#         return False


# --- 2. Application ViewSet ---

class IsApplicantOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow application creators to view/edit their applications,
    and allow gig creators/staff to view all.
    """
    def has_permission(self, request, view):
        # Allow read methods (GET, HEAD, OPTIONS) for any authenticated user
        if request.method in permissions.SAFE_METHODS and request.user.is_authenticated:
            return True
        # Allow POST (create application) for authenticated users
        if view.action == 'create':
            # This check requires request.user to be authenticated
            return request.user.is_authenticated
        # Fallback to general authenticated access for other methods
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.applicant == request.user
        # Allow the applicant to modify their own application (e.g., retract it)
        return obj.applicant == request.user


# # --- 1. Gig ViewSet (The main listing logic) ---
class GigViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to Gig data. 
    Handles listing gigs with filtering, searching, and price range.
    """
    serializer_class = GigSerializer
    
    # Allow anyone to view gigs, even unauthenticated users
    permission_classes = [permissions.AllowAny] 
    
    def get_queryset(self):
        # Start with all active gigs
        queryset = Gig.objects.filter(is_active=True).order_by('-id') 
        
        # --- Apply Filters (Matching the frontend parameters) ---
        search_query = self.request.query_params.get('search', None)
        profession = self.request.query_params.get('profession', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if search_query:
            queryset = queryset.filter(title__icontains=search_query) 
        
        if profession and profession != 'All':
            queryset = queryset.filter(profession=profession)

        if min_price is not None:
            try:
                min_price_val = float(min_price)
                queryset = queryset.filter(price__gte=min_price_val)
            except ValueError:
                pass
        
        if max_price is not None:
            try:
                max_price_val = float(max_price)
                queryset = queryset.filter(price__lte=max_price_val)
            except ValueError:
                pass

        return queryset


# --- 2. Application ViewSet (The application submission logic) ---
@method_decorator(csrf_exempt, name='dispatch') 
class ApplicationViewSet(viewsets.ModelViewSet):
    """
    Allows users to submit applications (POST) and view their own applications (GET).
    """
    serializer_class = ApplicationSerializer
    permission_classes = [IsApplicantOrReadOnly] 
    
    # CRITICAL: Ensures DRF checks for a Token in the Authorization header
    authentication_classes = [
        authentication.TokenAuthentication,
        authentication.SessionAuthentication,
    ] 

    def get_queryset(self):
        # Only show applications created by the current user
        if self.request.user.is_authenticated:
            return Application.objects.filter(applicant=self.request.user).order_by('-id')
        return Application.objects.none()

    def perform_create(self, serializer):
        # Automatically set the 'applicant' field to the currently logged-in user
        serializer.save(applicant=self.request.user)



class FreelancerDashboardStatsAPIView(APIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, clerk_id):
        freelancer = Freelancer.objects.filter(clerk_id=clerk_id).first()
        if not freelancer:
            return Response({"error": "Freelancer not found"}, status=404)

    def get(self, request, freelancer_id):
        total_earnings = Gig.objects.filter(freelancer_id=freelancer_id).aggregate(Sum('price'))['price__sum'] or 0
        active_gigs = Gig.objects.filter(freelancer_id=freelancer_id, status='active').count()
        total_clients = Application.objects.filter(gig__freelancer_id=freelancer_id).values('client_id').distinct().count()
        completed_gigs = Gig.objects.filter(freelancer_id=freelancer_id, status='completed').count()
        total_gigs = Gig.objects.filter(freelancer_id=freelancer_id).count()
        completion_rate = int((completed_gigs / total_gigs) * 100) if total_gigs else 0

        stats = {
            "totalEarnings": total_earnings,
            "activeGigs": active_gigs,
            "totalClients": total_clients,
            "completionRate": completion_rate,
        }
        return Response(stats)

class FreelancerRecentApplicationsAPIView(APIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, freelancer_id):
        applications = Application.objects.filter(gig__freelancer_id=freelancer_id).order_by('-created_at')[:5]
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class FreelancerGigsAPIView(APIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, freelancer_id):
        gigs = Gig.objects.filter(freelancer_id=freelancer_id)
        serializer = GigSerializer(gigs, many=True)
        return Response(serializer.data)
