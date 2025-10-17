from rest_framework import serializers
from .models import MpesaTransaction, Gig, ClerkUser, Freelancer, Testimonial, Application

class ClerkUserSerializer(serializers.ModelSerializer):
    """Serializer for the ClerkUser model."""
    class Meta:
        model = ClerkUser
        fields = '__all__'
        
class MpesaTransactionSerializer(serializers.ModelSerializer):
    """Serializer for the MpesaTransaction model."""
    class Meta:
        model = MpesaTransaction
        fields = '__all__'

class FreelancerSerializer(serializers.ModelSerializer):
    """
    Serializer for the Freelancer model, including nested user profile data.
    We use a nested serializer to correctly represent the ClerkUser details.
    """
    user_profile = ClerkUserSerializer(read_only=True)
    
    class Meta:
        model = Freelancer
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    """
    Serializer for the Testimonial model, including the full reviewer profile.
    """
    reviewer = ClerkUserSerializer(read_only=True)

    class Meta:
        model = Testimonial
        fields = '__all__'
        
class GigSerializer(serializers.ModelSerializer):
    """
    Serializer for the Gig model, which correctly handles the creator field
    to display their name.
    """
    creator_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Gig
        fields = '__all__'
        
    def get_creator_name(self, obj):
        """Returns the full name of the gig creator."""
        if obj.creator:
            return f"{obj.creator.profession} {obj.creator.name}"
        return "Unknown"


class ClerkUserNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClerkUser
        fields = ['clerk_id', 'first_name', 'last_name', 'email']
        read_only_fields = fields # Ensure these fields are only for display

class ApplicationSerializer(serializers.ModelSerializer):
    gig_title = serializers.CharField(source='gig.title', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'gig', 'gig_title', 'applicant_clerk_id', 'cover_letter', 'applied_at']
        read_only_fields = ['id', 'applicant_clerk_id', 'applied_at', 'gig_title']
