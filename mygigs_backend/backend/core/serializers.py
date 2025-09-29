
from rest_framework.serializers import ModelSerializer
from .models import Gig, MpesaTransaction, Freelancer, Testimonial, ClerkUser
from rest_framework import serializers

class MpesaTransactionSerializer(ModelSerializer):
    """
    Serializer to convert the MpesaTransaction model to JSON.
    """
    class Meta:
        model = MpesaTransaction
        fields = '__all__'

class ClerkUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClerkUser
        fields = ['clerk_id', 'contact_email']

# Serializer for the Gig model
class GigSerializer(serializers.ModelSerializer):
    # This field is read-only and will be populated by a custom method
    # It links to the ClerkClient's contact_email
    contact_email = serializers.ReadOnlyField(source='creator.contact_email')

    class Meta:
        model = Gig
        # The fields now include 'contact_email' which is derived from the creator
        fields = ['id', 'creator', 'title', 'description', 'price', 'location', 'contact_phone', 'image', 'contact_email']
        read_only_fields = ['creator', 'contact_email']


class FreelancerSerializer(ModelSerializer):
    """
    Serializes Freelancer model data for the API.
    """
    class Meta:
        model = Freelancer
        fields = '__all__'

class TestimonialSerializer(ModelSerializer):
    """
    Serializes Testimonial model data for the API.
    """
    class Meta:
        model = Testimonial
        fields = '__all__'