
# from rest_framework.serializers import ModelSerializer
# from .models import Gig, MpesaTransaction, Freelancer, Testimonial, ClerkUser
# from rest_framework import serializers

# class MpesaTransactionSerializer(ModelSerializer):
#     """
#     Serializer to convert the MpesaTransaction model to JSON.
#     """
#     class Meta:
#         model = MpesaTransaction
#         fields = '__all__'

# class ClerkUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ClerkUser
#         fields = ['clerk_id', 'contact_email']

# # Serializer for the Gig model
# class GigSerializer(serializers.ModelSerializer):
#     # This field is read-only and will be populated by a custom method
#     # It links to the ClerkClient's contact_email
    

#     class Meta:
#         model = Gig
#         # The fields now include 'contact_email' which is derived from the creator
#         fields = ['id', 'creator', 'title', 'description', 'price', 'location', 'image', ]
#         read_only_fields = ['creator', 'contact_email']


# class FreelancerSerializer(ModelSerializer):
#     """
#     Serializes Freelancer model data for the API.
#     """
#     class Meta:
#         model = Freelancer
#         fields = '__all__'

# class TestimonialSerializer(ModelSerializer):
#     """
#     Serializes Testimonial model data for the API.
#     """
#     class Meta:
#         model = Testimonial
#         fields = '__all__'

# api/serializers.py
# serializers.py
from rest_framework import serializers
from .models import MpesaTransaction, Gig, ClerkUser, Freelancer, Testimonial, Application

class ClerkUserSerializer(serializers.ModelSerializer):
    """Serializer for the ClerkUser model."""
    class Meta:
        model = ClerkUser
        fields = ['clerk_id', 'first_name', 'last_name', 'email', 'role', 'created_at']
        
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
    """Serializer for displaying relevant Applicant/Creator details within other models."""
    class Meta:
        model = ClerkUser
        fields = ['clerk_id', 'first_name', 'last_name', 'email']
        read_only_fields = fields # Ensure these fields are only for display

class GigNestedSerializer(serializers.ModelSerializer):
    """Serializer for displaying public Gig details within the Application."""
    # Nest the creator's details for a comprehensive view
    creator = ClerkUserNestedSerializer(read_only=True)
    
    class Meta:
        model = Gig
        fields = ['id', 'title', 'price', 'creator']
        read_only_fields = fields


# --- 2. Application Detail Serializer (For GET Requests) ---

class ApplicationDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying a detailed, read-only view of an Application.
    Uses nested serializers for full context.
    """
    applicant = ClerkUserNestedSerializer(read_only=True)
    gig = GigNestedSerializer(read_only=True)
    
    # Custom field to display the readable status (e.g., 'Pending Review' instead of 'PENDING')
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 
            'gig', 
            'applicant', 
            'cover_letter', 
            'status', 
            'status_display', 
            'applied_at'
        ]
        read_only_fields = fields # All fields are read-only for detail view


# --- 3. Application Creation Serializer (For POST Requests) ---

class ApplicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new Application.
    Only exposes the fields required for user input.
    The 'applicant' and initial 'status' will be set by the View.
    """
    class Meta:
        model = Application
        fields = ['gig', 'cover_letter']
        
    def validate(self, data):
        """
        Custom validation to ensure the user hasn't already applied to this gig.
        The user (applicant) is expected to be passed into the serializer context 
        from the view's request.
        """
        user = self.context.get('request').user # Get user from request context
        gig = data.get('gig')

        if not user or not user.is_authenticated:
            # Note: This check is mostly for robustness; the View's permission class should catch this first.
            raise serializers.ValidationError({"applicant": "Authentication required to apply."})

        # Check for existing application based on the unique_together constraint
        if Application.objects.filter(gig=gig, applicant__clerk_id=user.clerk_id).exists():
            raise serializers.ValidationError(
                {"detail": "You have already submitted an application for this gig."}
            )

        return data

class ApplicationSerializer(serializers.ModelSerializer):
    # Read-only field to show the gig's title for easier viewing
    gig_title = serializers.ReadOnlyField(source='gig.title')
    
    # Read-only field for the applicant's username
    applicant_username = serializers.ReadOnlyField(source='applicant.username')

    class Meta:
        model = Application
        fields = [
            'id', 'gig', 'gig_title', 'applicant', 'applicant_username', 
            'message', 'applied_at', 'status'
        ]
        # These fields are set automatically by the view/server
        read_only_fields = ['applicant', 'applicant_username', 'applied_at', 'status']

    # Custom validation to ensure the 'gig' field is provided when creating an application
    def validate_gig(self, value):
        if not value:
            raise serializers.ValidationError("A gig ID must be provided when applying.")
        if not value.is_active:
            raise serializers.ValidationError("Cannot apply to an inactive gig.")
        return value
