from django.contrib import admin
from .models import MpesaTransaction

# Register the model with the Django admin
admin.site.register(MpesaTransaction)

# class GigsAdmin(admin.ModelAdmin):
#     list_display=('title', 'image_tag')
# admin.site.register(Gigs, GigsAdmin)
