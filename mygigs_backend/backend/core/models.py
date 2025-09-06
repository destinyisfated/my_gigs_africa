from django.db import models

class MpesaTransaction(models.Model):
    # IDs for linking the initial request to the callback
    merchant_request_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    checkout_request_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    # Details from the initial request
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Status and details from the callback
    result_code = models.CharField(max_length=10, null=True, blank=True)
    result_desc = models.TextField(null=True, blank=True)
    
    # Details from the successful transaction
    mpesa_receipt_number = models.CharField(max_length=50, null=True, blank=True)
    transaction_date = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Transaction {self.mpesa_receipt_number or self.merchant_request_id}"



class Gig(models.Model):
    """
    A Django model to represent a single gig listing.
    """
    # Basic gig information
    title = models.CharField(max_length=200, help_text="The title of the gig.")
    description = models.TextField(help_text="A detailed description of the gig.")
    
    
    # Financial and location details
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="The price for the gig.")
    location = models.CharField(max_length=100, help_text="The city or area where the gig is located.")

    # Contact information
    contact_email = models.EmailField(help_text="Email address for gig inquiries.")
    contact_phone = models.CharField(max_length=20, blank=True, null=True, help_text="Optional phone number for contact.")

    # Image and date fields
    image = models.ImageField(upload_to='gig_images/', help_text="An image representing the gig.")
    date = models.DateField(help_text="The date the gig will take place.")

    # Automatic fields for tracking
    created_at = models.DateTimeField(auto_now_add=True, help_text="The date and time the gig was created.")
    updated_at = models.DateTimeField(auto_now=True, help_text="The date and time the gig was last updated.")

    def __str__(self):
        """String representation of the Gig object."""
        return self.title
    def image_tag(self):
        return mark_safe('<img src="%s" width="80" />'% (self.image.url))