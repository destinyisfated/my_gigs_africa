
from rest_framework.serializers import ModelSerializer
from .models import Gig, MpesaTransaction


class MpesaTransactionSerializer(ModelSerializer):
    """
    Serializer to convert the MpesaTransaction model to JSON.
    """
    class Meta:
        model = MpesaTransaction
        fields = '__all__'

class GigSerializer(ModelSerializer):
    """
    Serializer to convert Gig model instances into a JSON representation.
    """
    class Meta:
        model = Gig
        fields = ['id', 'title', 'description', 'price', 'image', 'location']
