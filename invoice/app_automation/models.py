from django.db import models

class QuotationRequest(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    products = models.JSONField()