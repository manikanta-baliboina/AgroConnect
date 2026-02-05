from django.db import models
from users.models import User
from crops.models import Crop


class Order(models.Model):
    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'CUSTOMER'}
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(
        max_length=20,
        default='PENDING',
        choices=[
            ('PENDING', 'Pending'),
            ('CONFIRMED', 'Confirmed'),
            ('CANCELLED', 'Cancelled'),
        ]
    )
    payment_method = models.CharField(
        max_length=20,
        default='COD',
        choices=[
            ('UPI', 'UPI'),
            ('CARD', 'Card'),
            ('COD', 'Cash on Delivery'),
        ]
    )
    payment_status = models.CharField(
        max_length=20,
        default='PENDING',
        choices=[
            ('PENDING', 'Pending'),
            ('PAID', 'Paid'),
            ('FAILED', 'Failed'),
        ]
    )
    delivery_name = models.CharField(max_length=120, blank=True, default="")
    delivery_phone = models.CharField(max_length=20, blank=True, default="")
    delivery_address_line1 = models.CharField(max_length=200, blank=True, default="")
    delivery_address_line2 = models.CharField(max_length=200, blank=True, default="")
    delivery_city = models.CharField(max_length=100, blank=True, default="")
    delivery_state = models.CharField(max_length=100, blank=True, default="")
    delivery_postal_code = models.CharField(max_length=20, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer.username}"


class OrderStatusHistory(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    from_status = models.CharField(max_length=20)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.order_id}: {self.from_status} -> {self.to_status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    quantity_kg = models.PositiveIntegerField()
    price_per_kg = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.crop.name} ({self.quantity_kg}kg)"
