from django.contrib import admin
from .models import User, FarmerProfile, CustomerProfile

admin.site.register(User)
admin.site.register(FarmerProfile)
admin.site.register(CustomerProfile)

