from django.db import models
from users.models import User


class Crop(models.Model):
    farmer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'FARMER'}
    )
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='crops/', null=True, blank=True)
    price_per_kg = models.DecimalField(max_digits=8, decimal_places=2)
    quantity_kg = models.PositiveIntegerField()
    harvest_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.farmer.username}"


class CropReview(models.Model):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'CUSTOMER'}
    )
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('crop', 'customer')

    def __str__(self):
        return f"{self.crop.name} review by {self.customer.username}"
