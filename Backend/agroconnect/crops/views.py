from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Crop, CropReview
from .serializers import CropSerializer, CropReviewSerializer
from users.permissions import IsFarmer
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from orders.models import OrderItem



class FarmerCropListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsFarmer]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        crops = Crop.objects.filter(farmer=request.user)
        serializer = CropSerializer(crops, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = CropSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(farmer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class FarmerCropDetailView(APIView):
    permission_classes = [IsAuthenticated, IsFarmer]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self, crop_id, user):
        return Crop.objects.get(id=crop_id, farmer=user)

    def put(self, request, crop_id):
        crop = self.get_object(crop_id, request.user)
        serializer = CropSerializer(crop, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, crop_id):
        crop = self.get_object(crop_id, request.user)
        serializer = CropSerializer(
            crop,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, crop_id):
        crop = self.get_object(crop_id, request.user)
        crop.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class PublicCropListView(ListAPIView):
    queryset = Crop.objects.all().order_by('-created_at')
    serializer_class = CropSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()

        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        search = self.request.query_params.get('search')
        min_rating = self.request.query_params.get('min_rating')

        if category:
            queryset = queryset.filter(category__iexact=category)

        if min_price:
            queryset = queryset.filter(price_per_kg__gte=min_price)

        if max_price:
            queryset = queryset.filter(price_per_kg__lte=max_price)

        if search:
            queryset = queryset.filter(name__icontains=search)

        if min_rating:
            try:
                min_rating_val = float(min_rating)
                matching_ids = []
                for crop in queryset:
                    ratings = crop.reviews.values_list('rating', flat=True)
                    if ratings:
                        avg = sum(ratings) / len(ratings)
                        if avg >= min_rating_val:
                            matching_ids.append(crop.id)
                queryset = queryset.filter(id__in=matching_ids)
            except ValueError:
                pass

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
class PublicCropDetailView(RetrieveAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CropReviewListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, crop_id):
        reviews = CropReview.objects.filter(crop_id=crop_id).order_by('-created_at')
        serializer = CropReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, crop_id):
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        if request.user.role != "CUSTOMER":
            return Response({"error": "Only customers can review"}, status=status.HTTP_403_FORBIDDEN)

        has_purchase = OrderItem.objects.filter(
            crop_id=crop_id,
            order__customer=request.user,
            order__status="CONFIRMED"
        ).exists()
        if not has_purchase:
            return Response(
                {"error": "Only verified buyers can review"},
                status=status.HTTP_403_FORBIDDEN
            )

        if CropReview.objects.filter(crop_id=crop_id, customer=request.user).exists():
            return Response(
                {"error": "You have already reviewed this crop"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CropReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(crop_id=crop_id, customer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
