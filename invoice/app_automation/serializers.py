from rest_framework import serializers

class QuotationRequestSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    message = serializers.CharField(required=False)
    products = serializers.JSONField()
