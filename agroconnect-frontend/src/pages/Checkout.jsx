import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formatMoney = (value) => `Rs ${Number(value || 0).toFixed(2)}`;

  const handlePlaceOrder = async () => {
    setError("");
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    const requiredFields = [
      "name",
      "phone",
      "address_line1",
      "city",
      "state",
      "postal_code",
    ];
    const missing = requiredFields.filter((field) => !address[field]);
    if (missing.length > 0) {
      setError("Please complete the delivery address.");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/orders/place/", {
        items: items.map((item) => ({
          crop_id: item.id,
          quantity_kg: item.qty,
        })),
        payment_method: paymentMethod,
        delivery_address: address,
      });
      clearCart();
      navigate("/customer/orders");
    } catch (err) {
      console.error("Checkout failed", err);
      setError("Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
          <p className="text-sm text-slate-500">
            Confirm delivery address and payment.
          </p>
        </div>
        <button onClick={() => navigate(-1)} className="btn-ghost">
          Back to cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Delivery Address
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1">
                  Full Name
                </label>
                <input
                  value={address.name}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Phone</label>
                <input
                  value={address.phone}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Pincode
                </label>
                <input
                  value={address.postal_code}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      postal_code: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1">
                  Address Line 1
                </label>
                <input
                  value={address.address_line1}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      address_line1: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1">
                  Address Line 2 (optional)
                </label>
                <input
                  value={address.address_line2}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      address_line2: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">City</label>
                <input
                  value={address.city}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">State</label>
                <input
                  value={address.state}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Payment Method
            </h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>
        </div>

        <div className="card p-5 h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Order Summary
          </h3>
          <div className="text-sm text-slate-600 space-y-2">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between text-slate-800">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{formatMoney(totalAmount)}</span>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}
          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="btn-primary w-full mt-4"
          >
            {submitting ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
