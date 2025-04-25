from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import QuotationRequestSerializer
from datetime import datetime, timedelta

def send_quotation_email(to_email, context):
    subject = "Your Quotation from GeoPro Global Solutions"
    from_email = "your@email.com"

    html_content = render_to_string('emails/quotation.html', context)

    email = EmailMultiAlternatives(subject, "", from_email, [to_email])
    email.attach_alternative(html_content, "text/html")
    email.send()


class QuotationRequestView(APIView):
    def post(self, request):
        serializer = QuotationRequestSerializer(data=request.data)
        print(request.data)

        if serializer.is_valid():
            data = serializer.validated_data
            product_name = data['name']
            email = data['email']
            message = data.get('message', '')
            products = data['products']

            # Prepare item data for the HTML table
            items = []
            subtotal = 0
            print(products)

            for p in products:
                quantity = p.get('quantity', 1)
                product_name = p.get('product_name', 'N/A')
                unit_price = float(p.get('price', 0))
                amount = quantity * unit_price
                subtotal += amount

                items.append({
                    'quantity': quantity,
                    'name': product_name,
                    'unit_price': f"₱{unit_price:,.2f}",
                    'amount': f"₱{amount:,.2f}",
                    'description': p.get('description', ''),
                    'image': p.get('image', '')
                })

            total = subtotal

            # Build context for the HTML email
            context = {
                'customer_name': data['name'],
                'customer_address': data.get('address', 'N/A'),
                'quote_number': f"Q{datetime.now().strftime('%Y%m%d%H%M%S')}",
                'quote_date': datetime.now().strftime('%B %d, %Y'),
                'due_date': (datetime.now() + timedelta(days=7)).strftime('%B %d, %Y'),
                'items': items,
                'total': f"₱{total:,.2f}",
            }

            send_quotation_email(email, context)

            return Response({'message': 'Quotation sent successfully!'}, status=status.HTTP_200_OK)
        
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

