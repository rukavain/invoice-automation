from rest_framework import serializers

class ProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    product_name = serializers.CharField()
    price = serializers.FloatField()
    description = serializers.CharField(required=False, allow_blank=True)
    image = serializers.CharField(required=False, allow_blank=True)
    quantity = serializers.IntegerField()

class QuotationRequestSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    message = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    products = ProductSerializer(many=True)