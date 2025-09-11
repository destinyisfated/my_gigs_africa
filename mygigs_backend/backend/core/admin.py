from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Gig, MpesaTransaction

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
