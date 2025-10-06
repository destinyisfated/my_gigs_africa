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

    clerk_id = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f"Transaction {self.mpesa_receipt_number or self.merchant_request_id}"

class ClerkUser(models.Model):
    # Store Clerk's user ID. It's a string, so use CharField.
    clerk_id = models.CharField(max_length=255, unique=True, primary_key=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    role = models.CharField(max_length=50, default='user')

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class Freelancer(models.Model):

    """
    A Django model to represent a freelance professional.
    """
    # Personal information
    name = models.CharField(max_length=255, help_text="The full name of the freelancer.", default="No username")
    profession = models.CharField(max_length=255, help_text="The freelancer's primary profession or job title.")
    bio = models.TextField(blank=True, help_text="A short biography or summary of the freelancer.")
    clerk_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    # Profile details
    profile_image = models.ImageField(upload_to='freelancer_profiles/', blank=True, null=True, help_text="Profile picture for the freelancer.")
    years_of_experience = models.CharField(max_length=255, help_text="Number of years of experience in their profession.")
    
    # Skills and contact
    skills = models.CharField(max_length=500, help_text="A comma-separated list of skills (e.g., 'React, Django, Python').")
    availability = models.CharField(max_length=100, help_text="The freelancer's current availability (e.g., 'Full-time', 'Part-time').")
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    # Location
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

    def image_tag(self):
        if self.profile_image:
            return mark_safe('<img src="%s" style="width: 45px; height:45px; border-radius: 50%;" />' % self.profile_image.url)
        return "No Image"

    image_tag.short_description = 'Profile Image'


class Gig(models.Model):
    """
    A Django model to represent a single gig listing.
    """

    # The creator is a ForeignKey to the ClerkUser model. to establish a relationship between gigs and the  freelancer.
    creator = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name='gigs', null=True, blank=True)
    
    # Basic gig information
    title = models.CharField(max_length=200, help_text="The title of the gig.")
    description = models.TextField(help_text="A detailed description of the gig.")
    
    # Financial and location details
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="The price for the gig.")
    location = models.CharField(max_length=100, help_text="The city or area where the gig is located.")

    # Image and date fields
    image = models.ImageField(upload_to='gig_images/', help_text="An image representing the gig.", blank=True, null=True)

    # Automatic fields for tracking
    created_at = models.DateTimeField(auto_now_add=True, help_text="The date and time the gig was created.")
    updated_at = models.DateTimeField(auto_now=True, help_text="The date and time the gig was last updated.")

    def __str__(self):
        """String representation of the Gig object."""
        return self.title
    def image_tag(self):
        return mark_safe('<img src="%s" width="80" />'% (self.image.url))


class Testimonial(models.Model):
    author_name = models.CharField(max_length=100)
    text = models.TextField(help_text="The full testimonial text.")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Testimonial by {self.author_name}"


class Application(models.Model):
    """
    Tracks applications submitted by clients for gigs posted by freelancers.
    """
    STATUS_CHOICES = (
        ('PENDING', 'Pending Review'),
        ('HIRED', 'Hired'),
        ('REJECTED', 'Rejected'),
    )

    # Foreign Key to the Gig that the user is applying for
    gig = models.ForeignKey(Gig, on_delete=models.CASCADE, related_name='applications')
    
    # Foreign Key to the ClerkUser who submitted the application
    # This fulfills the requirement: applicant attribute should be a foreign key to ClerkUser
    applicant = models.ForeignKey(ClerkUser, on_delete=models.CASCADE, related_name='applications_submitted')
    
    cover_letter = models.TextField(verbose_name="Cover Letter/Pitch")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application for '{self.gig.title}' by {self.applicant.last_name}"

   