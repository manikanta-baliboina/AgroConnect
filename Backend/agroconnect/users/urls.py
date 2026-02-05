from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    FarmerDashboardView,
    CustomerDashboardView,
    FarmerProfileView
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('farmer/dashboard/', FarmerDashboardView.as_view()),
    path('customer/dashboard/', CustomerDashboardView.as_view()),
    path('farmer/profile/', FarmerProfileView.as_view()),
]
