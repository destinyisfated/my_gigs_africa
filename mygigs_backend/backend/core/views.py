# Create your views here.
from datetime import datetime
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from rest_framework import parsers, serializers
from requests.auth import HTTPBasicAuth
from .models import MpesaTransaction, Gig, ClerkUser, Freelancer, Testimonial
from rest_framework.generics import ListAPIView
from .serializers import MpesaTransactionSerializer, GigSerializer, FreelancerSerializer, TestimonialSerializer
import base64
import json
import os
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from svix.webhooks import Webhook, WebhookVerificationError
from django.http import HttpResponse, JsonResponse


from rest_framework.decorators import api_view


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
            creator_instance = ClerkClient.objects.get(clerk_id=self.request.user.clerk_id)
        except ClerkClient.DoesNotExist:
            raise serializers.ValidationError("Clerk user does not exist in our database.")
            
        # Pass the creator instance directly to the serializer's create method.
        # This will be used by the serializer to get the email automatically.
        serializer.save(creator=creator_instance)



