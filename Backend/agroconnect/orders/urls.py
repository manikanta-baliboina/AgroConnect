from django.urls import path
from .views import (PlaceOrderView, 
                    CustomerOrderListView ,
                    FarmerOrderListView,
                    FarmerUpdateOrderStatusView,
                    farmer_orders_stream)


urlpatterns = [
    path('orders/place/', PlaceOrderView.as_view()),
    path('orders/', CustomerOrderListView.as_view()),
    path('farmer/orders/', FarmerOrderListView.as_view()),
    path('farmer/orders/<int:order_id>/status/', FarmerUpdateOrderStatusView.as_view()),
    path('farmer/orders/stream/', farmer_orders_stream),

]
