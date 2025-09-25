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