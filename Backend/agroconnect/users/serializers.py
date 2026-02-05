from rest_framework import serializers
from .models import User, FarmerProfile, CustomerProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    farm_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    location = serializers.CharField(write_only=True, required=False, allow_blank=True)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role", "farm_name", "location", "address"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        farm_name = validated_data.pop("farm_name", "")
        location = validated_data.pop("location", "")
        address = validated_data.pop("address", "")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if user.role == "FARMER":
            FarmerProfile.objects.create(
                user=user,
                farm_name=farm_name or f"{user.username}'s Farm",
                location=location or "Unknown"
            )
        elif user.role == "CUSTOMER":
            CustomerProfile.objects.create(
                user=user,
                address=address or ""
            )

        return user
