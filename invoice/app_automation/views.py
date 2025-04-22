from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import QuotationRequestSerializer

class QuotationRequestView(APIView):
    def post(self, request):
        serializer = QuotationRequestSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            name = data['name']
            email = data['email']
            message = data.get('message', '')
            products = data['products']

            # Build the product summary
            product_summary = "\n".join([
                f"- Product ID: {p['id']}, Quantity: {p['quantity']}"
                for p in products
            ])

            email_body = f"""
Hi {name},

Thank you for requesting a quotation. Here are the details you submitted:

Message: {message}

Products Requested:
{product_summary}

We'll get back to you shortly with a formal quotation.

Best regards,
Your Company Name
"""

            send_mail(
                subject='Your Quotation Request Confirmation',
                message=email_body,
                from_email=None,  # use DEFAULT_FROM_EMAIL
                recipient_list=[email],
                fail_silently=False,
            )

            return Response({'message': 'Quotation request received and email sent!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
