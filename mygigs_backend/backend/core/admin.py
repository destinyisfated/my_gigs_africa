from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import *

# Register the model with the Django admin
admin.site.register(MpesaTransaction)

class GigAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'image_tag', 'price')

    def image_tag(self, obj):
        # This checks if the gig object has an associated image.
        # It's assumed your Gig model has a FileField or ImageField named 'image'
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="50" height="50" />')
        return "No Image"

    image_tag.short_description = 'Image' # This sets the column header in the admin

admin.site.register(Gig, GigAdmin)




class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'text')
admin.site.register(Testimonial, TestimonialAdmin)

class FreelancerAdmin(admin.ModelAdmin):
    # This method is for displaying a thumbnail in the admin list view
    def image_tag(self, obj):
        if obj.profile_image:
            return mark_safe(f'<img src="{obj.profile_image.url}" style="width: 100px; height: auto;" />')
        return "No Image"

    list_display = ('name', 'profession', 'image_tag', 'years_of_experience', 'city', 'country', 'phone_number')
    search_fields = ('name', 'profession', 'location', 'skills')
    list_filter = ('profession', 'years_of_experience', 'availability')
    image_tag.short_description = 'Image' # Set the column header name

# Register the Freelancer model with its custom admin class
admin.site.register(Freelancer, FreelancerAdmin)


class ClerkUserAdmin(admin.ModelAdmin):
    """
    Customizes the display of the ClerkUser model in the Django admin dashboard.
    """
    # list_display controls which fields are shown on the change list page of the admin.
    list_display = ('clerk_id', 'email', 'first_name', 'last_name', 'role', 'created_at')
    
    # search_fields adds a search box to the admin page and specifies which fields
    # will be searched when the user types a query.
    search_fields = ('clerk_id', 'email', 'first_name', 'last_name')
    
    # list_filter adds a filter sidebar to the right of the change list page,
    # allowing you to filter results by the specified fields.
    list_filter = ('role', 'created_at')

# Register the ClerkUser model with the custom configuration.
# This makes the model visible and manageable in the Django admin interface.
admin.site.register(ClerkUser, ClerkUserAdmin)



@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Application model, crucial for review.
    """
    # Fields to display in the list view
    list_display = ('gig', 'applicant', 'status', 'applied_at', 'get_gig_creator')
    
    # Fields to filter the list view by
    list_filter = ('status', 'applied_at', 'gig__creator')
    
    # Fields to search across
    search_fields = (
        'gig__title', 
        'applicant__email', 
        'applicant__last_name', 
        'cover_letter'
    )
    
    # Use raw_id_fields for Foreign Keys (gig and applicant)
    raw_id_fields = ('gig', 'applicant')
    
    # Fields that should not be changed after creation
    readonly_fields = ('applied_at',)
    
    # Custom method to easily see who owns the gig in the list view
    @admin.display(description='Gig Creator')
    def get_gig_creator(self, obj):
        """Returns the full name and Clerk ID of the gig creator."""
        return f"{obj.gig.creator.first_name} {obj.gig.creator.last_name} ({obj.gig.creator.clerk_id})"
    
    ordering = ('-applied_at',)
