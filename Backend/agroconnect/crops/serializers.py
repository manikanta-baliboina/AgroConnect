from rest_framework import serializers
from .models import Crop, CropReview
from users.models import FarmerProfile
from datetime import date


class CropSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.username', read_only=True)
    farm_name = serializers.SerializerMethodField()
    farmer_location = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Crop
        fields = [
            'id',
            'farmer',
            'farmer_name',
            'farm_name',
            'farmer_location',
            'name',
            'category',
            'description',
            'image',
            'image_url',
            'price_per_kg',
            'quantity_kg',
            'harvest_date',
            'created_at',
            'avg_rating',
            'review_count'
        ]
        read_only_fields = ['farmer']

    def get_farm_name(self, obj):
        profile = FarmerProfile.objects.filter(user=obj.farmer).first()
        return profile.farm_name if profile else None

    def get_farmer_location(self, obj):
        profile = FarmerProfile.objects.filter(user=obj.farmer).first()
        return profile.location if profile else None

    def get_image_url(self, obj):
        if not obj.image:
            return None
        return obj.image.url

    def get_avg_rating(self, obj):
        ratings = obj.reviews.values_list('rating', flat=True)
        if not ratings:
            return None
        return round(sum(ratings) / len(ratings), 2)

    def get_review_count(self, obj):
        return obj.reviews.count()

    def validate_harvest_date(self, value):
        if value and value > date.today():
            raise serializers.ValidationError("Harvest date cannot be in the future.")
        return value


class CropReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = CropReview
        fields = ['id', 'crop', 'customer', 'customer_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['crop', 'customer', 'created_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
