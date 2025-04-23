from rest_framework import serializers

class ProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    product_name = serializers.CharField()
    Sales_Price = serializers.FloatField(source='Sales Price')  # maps to incoming "Sales Price"
    Sales_Description = serializers.CharField(source='Sales Description', required=False, allow_blank=True)
    Image = serializers.URLField(required=False, allow_blank=True)
    quantity = serializers.IntegerField()


class QuotationRequestSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    message = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    products = ProductSerializer(many=True)
