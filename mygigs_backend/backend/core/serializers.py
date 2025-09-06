
from rest_framework.serializers import ModelSerializer
from .models import MpesaTransaction


class MpesaTransactionSerializer(ModelSerializer):
    """
    Serializer to convert the MpesaTransaction model to JSON.
    """
    class Meta:
        model = MpesaTransaction
        fields = '__all__'