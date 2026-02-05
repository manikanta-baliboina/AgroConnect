from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .permissions import IsFarmer, IsCustomer
from django.contrib.auth import authenticate
from django.db.models import Sum, F, DecimalField
from django.db.models.functions import Coalesce
from django.utils import timezone
from datetime import timedelta



from .serializers import RegisterSerializer
# from .models import User
from crops.models import Crop
from orders.models import OrderItem, Order
from .models import FarmerProfile
from rest_framework import serializers



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "User registered successfully",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "role": user.role
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role  # ✅ THIS IS THE FIX
        }, status=status.HTTP_200_OK)

class FarmerDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsFarmer]

    def get(self, request):
        user = request.user
        crops_qs = Crop.objects.filter(farmer=user)
        order_items_qs = OrderItem.objects.filter(crop__farmer=user)

        total_crops = crops_qs.count()
        total_stock_kg = crops_qs.aggregate(
            total=Coalesce(Sum('quantity_kg'), 0)
        )['total']

        total_orders = order_items_qs.values('order_id').distinct().count()
        pending_orders = order_items_qs.filter(
            order__status='PENDING'
        ).values('order_id').distinct().count()
        confirmed_orders = order_items_qs.filter(
            order__status='CONFIRMED'
        ).values('order_id').distinct().count()
        cancelled_orders = order_items_qs.filter(
            order__status='CANCELLED'
        ).values('order_id').distinct().count()

        revenue_expr = F('quantity_kg') * F('price_per_kg')
        confirmed_revenue = order_items_qs.filter(
            order__status='CONFIRMED'
        ).aggregate(
            total=Coalesce(Sum(revenue_expr, output_field=DecimalField(max_digits=12, decimal_places=2)), 0)
        )['total']

        last_7_days = timezone.now() - timedelta(days=7)
        recent_orders = order_items_qs.filter(
            order__created_at__gte=last_7_days
        ).values('order_id').distinct().count()

        return Response({
            "message": "Welcome Farmer",
            "username": user.username,
            "metrics": {
                "total_crops": total_crops,
                "total_stock_kg": total_stock_kg,
                "total_orders": total_orders,
                "pending_orders": pending_orders,
                "confirmed_orders": confirmed_orders,
                "cancelled_orders": cancelled_orders,
                "confirmed_revenue": confirmed_revenue,
                "recent_orders": recent_orders
            }
        })
class CustomerDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def get(self, request):
        user = request.user
        orders_qs = Order.objects.filter(customer=user)

        total_orders = orders_qs.count()
        pending_orders = orders_qs.filter(status='PENDING').count()
        confirmed_orders = orders_qs.filter(status='CONFIRMED').count()
        cancelled_orders = orders_qs.filter(status='CANCELLED').count()
        total_spent = orders_qs.filter(status='CONFIRMED').aggregate(
            total=Coalesce(Sum('total_amount'), 0)
        )['total']

        last_7_days = timezone.now() - timedelta(days=7)
        recent_orders = orders_qs.filter(created_at__gte=last_7_days).count()

        return Response({
            "message": "Welcome Customer",
            "username": user.username,
            "metrics": {
                "total_orders": total_orders,
                "pending_orders": pending_orders,
                "confirmed_orders": confirmed_orders,
                "cancelled_orders": cancelled_orders,
                "total_spent": total_spent,
                "recent_orders": recent_orders
            }
        })


class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = ["farm_name", "location"]


class FarmerProfileView(APIView):
    permission_classes = [IsAuthenticated, IsFarmer]

    def get(self, request):
        profile, _ = FarmerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                "farm_name": f"{request.user.username}'s Farm",
                "location": "Unknown"
            }
        )
        serializer = FarmerProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = FarmerProfile.objects.get_or_create(user=request.user)
        serializer = FarmerProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
