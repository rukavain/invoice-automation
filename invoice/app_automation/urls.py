from django.urls import path
from .views import QuotationRequestView

urlpatterns = [
    path('send/', QuotationRequestView.as_view(), name='quotation-request')
]