from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Order, OrderItem, OrderStatusHistory
from .serializers import OrderSerializer, FarmerOrderItemSerializer, OrderStatusUpdateSerializer
from crops.models import Crop
from users.permissions import IsCustomer, IsFarmer
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.paginator import Paginator, EmptyPage
from django.core.cache import cache
from django.http import StreamingHttpResponse, HttpResponseForbidden
from rest_framework_simplejwt.authentication import JWTAuthentication
import time
import hashlib


def _bump_farmer_orders_cache_version(farmer_id):
    cache_key = f"farmer_orders_v_{farmer_id}"
    try:
        cache.incr(cache_key)
    except ValueError:
        cache.set(cache_key, 1, timeout=3600)


def _paginate_queryset(queryset, request):
    if 'page' not in request.query_params and 'page_size' not in request.query_params:
        return None, None, None, None

    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 10))

    if page < 1:
        page = 1
    if page_size < 1:
        page_size = 10

    paginator = Paginator(queryset, page_size)
    try:
        page_obj = paginator.page(page)
    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

    return page_obj, paginator.count, page, page_size





class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def post(self, request):
        items = request.data.get('items', [])
        payment_method = request.data.get('payment_method', 'COD')
        delivery = request.data.get('delivery_address', {}) or {}

        allowed_methods = {'UPI', 'CARD', 'COD'}
        if payment_method not in allowed_methods:
            return Response(
                {"error": "Invalid payment method"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not items:
            return Response(
                {"error": "No items provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        required_fields = [
            'name',
            'phone',
            'address_line1',
            'city',
            'state',
            'postal_code'
        ]
        missing = [field for field in required_fields if not delivery.get(field)]
        if missing:
            return Response(
                {"error": f"Missing delivery address fields: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_status = 'PAID' if payment_method in {'UPI', 'CARD'} else 'PENDING'
        order = Order.objects.create(
            customer=request.user,
            payment_method=payment_method,
            payment_status=payment_status,
            delivery_name=delivery.get('name', ''),
            delivery_phone=delivery.get('phone', ''),
            delivery_address_line1=delivery.get('address_line1', ''),
            delivery_address_line2=delivery.get('address_line2', ''),
            delivery_city=delivery.get('city', ''),
            delivery_state=delivery.get('state', ''),
            delivery_postal_code=delivery.get('postal_code', '')
        )
        total = 0

        affected_farmers = set()
        for item in items:
            crop = get_object_or_404(Crop, id=item['crop_id'])

            if item['quantity_kg'] > crop.quantity_kg:
                return Response(
                    {"error": f"Insufficient stock for {crop.name}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            OrderItem.objects.create(
                order=order,
                crop=crop,
                quantity_kg=item['quantity_kg'],
                price_per_kg=crop.price_per_kg
            )

            total += crop.price_per_kg * item['quantity_kg']
            crop.quantity_kg -= item['quantity_kg']
            crop.save()
            affected_farmers.add(crop.farmer_id)

        order.total_amount = total
        order.save()

        for farmer_id in affected_farmers:
            _bump_farmer_orders_cache_version(farmer_id)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
class CustomerOrderListView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def get(self, request):
        orders = Order.objects.filter(customer=request.user).order_by('-created_at')
        page_obj, total_count, page, page_size = _paginate_queryset(orders, request)
        if page_obj is None:
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)

        serializer = OrderSerializer(page_obj.object_list, many=True)
        return Response({
            "count": total_count,
            "page": page,
            "page_size": page_size,
            "results": serializer.data
        })
class FarmerOrderListView(APIView):
    permission_classes = [IsAuthenticated, IsFarmer]

    def get(self, request):
        order_items = OrderItem.objects.filter(
            crop__farmer=request.user
        ).select_related('order', 'crop').order_by('-order__created_at')

        status_filter = request.query_params.get('status')
        if status_filter and status_filter != 'ALL':
            order_items = order_items.filter(order__status=status_filter)

        search_term = request.query_params.get('search')
        if search_term:
            order_items = order_items.filter(crop__name__icontains=search_term)

        sort_key = request.query_params.get('sort', 'newest')
        sort_map = {
            'newest': '-order__created_at',
            'oldest': 'order__created_at',
            'quantity_desc': '-quantity_kg',
            'quantity_asc': 'quantity_kg',
            'price_desc': '-price_per_kg',
            'price_asc': 'price_per_kg'
        }
        order_items = order_items.order_by(sort_map.get(sort_key, '-order__created_at'))

        page_obj, total_count, page, page_size = _paginate_queryset(order_items, request)
        if page_obj is None:
            serializer = FarmerOrderItemSerializer(order_items, many=True)
            return Response(serializer.data)

        cache_version = cache.get(f"farmer_orders_v_{request.user.id}", 1)
        search_hash = hashlib.md5((search_term or '').encode('utf-8')).hexdigest()[:8]
        cache_key = (
            f"farmer_orders_{request.user.id}_v{cache_version}"
            f"_p{page}_s{page_size}_st{status_filter or 'ALL'}"
            f"_sr{sort_key}_q{search_hash}"
        )
        cached = cache.get(cache_key)
        if cached is not None:
            return Response(cached)

        serializer = FarmerOrderItemSerializer(page_obj.object_list, many=True)
        payload = {
            "count": total_count,
            "page": page,
            "page_size": page_size,
            "results": serializer.data
        }
        cache.set(cache_key, payload, timeout=30)
        return Response(payload)
class FarmerUpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated, IsFarmer]

    @transaction.atomic
    def patch(self, request, order_id):
        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']

        order = Order.objects.select_for_update().get(id=order_id)

        # Check if farmer owns at least one crop in this order
        owns_order = order.items.filter(
            crop__farmer=request.user
        ).exists()

        if not owns_order:
            return Response(
                {"error": "You are not allowed to update this order"},
                status=status.HTTP_403_FORBIDDEN
            )

        allowed_transitions = {
            'PENDING': {'CONFIRMED', 'CANCELLED'}
        }

        if order.status not in allowed_transitions:
            return Response(
                {"error": "Order status cannot be changed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status not in allowed_transitions[order.status]:
            return Response(
                {"error": "Invalid status transition"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Restore stock if cancelled
        if new_status == 'CANCELLED' and order.status != 'CANCELLED':
            for item in order.items.all():
                crop = item.crop
                crop.quantity_kg += item.quantity_kg
                crop.save()

        previous_status = order.status
        order.status = new_status
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            from_status=previous_status,
            to_status=new_status,
            changed_by=request.user
        )

        _bump_farmer_orders_cache_version(request.user.id)

        return Response(
            {
                "message": f"Order {new_status.lower()} successfully",
                "order_id": order.id,
                "status": order.status
            }
        )


def farmer_orders_stream(request):
    auth = JWTAuthentication()
    token = request.GET.get("token")
    user = None

    if token:
        try:
            validated_token = auth.get_validated_token(token)
            user = auth.get_user(validated_token)
        except Exception:
            return HttpResponseForbidden("Invalid token")
    else:
        try:
            result = auth.authenticate(request)
        except Exception:
            result = None
        if result:
            user = result[0]
        else:
            return HttpResponseForbidden("Authentication required")

    if getattr(user, "role", None) != "FARMER":
        return HttpResponseForbidden("Forbidden")

    cache_key = f"farmer_orders_v_{user.id}"
    last_version = cache.get(cache_key, 1)

    def event_stream():
        nonlocal last_version
        yield "event: ready\ndata: ok\n\n"
        while True:
            current_version = cache.get(cache_key, 1)
            if current_version != last_version:
                last_version = current_version
                yield f"event: orders\ndata: {current_version}\n\n"
            time.sleep(2)

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response["Cache-Control"] = "no-cache"
    return response
