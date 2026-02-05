from rest_framework import serializers
from .models import Order, OrderItem
from crops.models import Crop


class OrderItemSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['crop', 'crop_name', 'quantity_kg', 'price_per_kg']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer',
            'total_amount',
            'status',
            'payment_method',
            'payment_status',
            'delivery_name',
            'delivery_phone',
            'delivery_address_line1',
            'delivery_address_line2',
            'delivery_city',
            'delivery_state',
            'delivery_postal_code',
            'created_at',
            'items'
        ]
        read_only_fields = ['customer', 'total_amount', 'status', 'payment_status']
class FarmerOrderItemSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source='order.customer.username', read_only=True)
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    order_status = serializers.CharField(source='order.status', read_only=True)
    payment_method = serializers.CharField(source='order.payment_method', read_only=True)
    payment_status = serializers.CharField(source='order.payment_status', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'order_id',
            'customer',
            'crop',
            'crop_name',
            'quantity_kg',
            'price_per_kg',
            'order_status',
            'payment_method',
            'payment_status'
        ]
class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['CONFIRMED', 'CANCELLED'])
