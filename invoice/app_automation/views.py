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
        if serializer.is_valid():
            data = serializer.validated_data
            name = data['name']
            email = data['email']
            message = data.get('message', '')
            products = data['products']

            # Prepare item data for the HTML table
            items = []
            subtotal = 0

            for p in products:
                quantity = p['quantity']
                description = p.get('description', f"Product {p['id']}")
                unit_price = float(p.get('unit_price', 0))
                amount = quantity * unit_price
                subtotal += amount

                items.append({
                    'quantity': quantity,
                    'description': description,
                    'unit_price': f"₱{unit_price:,.2f}",
                    'amount': f"₱{amount:,.2f}",
                })

            tax = subtotal * 0.12
            total = subtotal + tax

            # Build context for the HTML email
            context = {
                'customer_name': name,
                'customer_address': data.get('address', 'N/A'),
                'quote_number': f"Q{datetime.now().strftime('%Y%m%d%H%M%S')}",
                'quote_date': datetime.now().strftime('%B %d, %Y'),
                'due_date': (datetime.now() + timedelta(days=7)).strftime('%B %d, %Y'),
                'items': items,
                'subtotal': f"₱{subtotal:,.2f}",
                'tax': f"₱{tax:,.2f}",
                'total': f"₱{total:,.2f}",
            }

            send_quotation_email(email, context)

            return Response({'message': 'Quotation sent successfully!'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
