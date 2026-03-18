import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import PageTransition from "../components/PageTransition";
import { useLanguage } from "../context/LanguageContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { t } = useLanguage();
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
      await api.post("orders/place/", {
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
    <PageTransition className="page-shell py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("checkout")}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {t("checkoutText")}
          </p>
        </div>
        <button onClick={() => navigate(-1)} className="btn-ghost">
          {t("backToCart")}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {t("deliveryAddress")}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {t("fullName")}
                </label>
                <input
                  value={address.name}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {t("phone")}
                </label>
                <input
                  value={address.phone}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {t("pincode")}
                </label>
                <input
                  value={address.postal_code}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      postal_code: e.target.value,
                    }))
                  }
                  className="input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {t("addressLine1")}
                </label>
                <input
                  value={address.address_line1}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      address_line1: e.target.value,
                    }))
                  }
                  className="input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {t("addressLine2")}
                </label>
                <input
                  value={address.address_line2}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      address_line2: e.target.value,
                    }))
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {t("city")}
                </label>
                <input
                  value={address.city}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {t("state")}
                </label>
                <input
                  value={address.state}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {t("paymentMethod")}
            </h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input mt-4"
            >
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>
        </div>

        <div className="card-soft h-fit p-6">
          <h3 className="text-lg font-semibold text-slate-900">{t("orderSummary")}</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>{t("subtotal")}</span>
              <span>{formatMoney(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-900">
              <span>{t("delivery")}</span>
              <span>{t("free")}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-slate-800">
              <span className="font-semibold">{t("total")}</span>
              <span className="font-semibold">{formatMoney(totalAmount)}</span>
            </div>
          </div>
          {error ? (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <motion.button
            onClick={handlePlaceOrder}
            disabled={submitting}
            whileTap={{ scale: 0.985 }}
            className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing..." : t("placeOrder")}
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
}
