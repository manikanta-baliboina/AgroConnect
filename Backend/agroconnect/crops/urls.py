from django.urls import path
from .views import (
    FarmerCropListCreateView,
    FarmerCropDetailView,
    PublicCropListView,
    PublicCropDetailView,
    CropReviewListCreateView
)

urlpatterns = [
    path('farmer/crops/', FarmerCropListCreateView.as_view()),
    path('farmer/crops/<int:crop_id>/', FarmerCropDetailView.as_view()),
    path('crops/', PublicCropListView.as_view()),
    path('crops/<int:id>/', PublicCropDetailView.as_view()),
    path('crops/<int:crop_id>/reviews/', CropReviewListCreateView.as_view()),
]
