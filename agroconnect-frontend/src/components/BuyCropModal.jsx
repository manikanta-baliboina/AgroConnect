import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import SmartImage from "./SmartImage";

function Stars({ value = 0 }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={`modal-star-${index}`}
          className={index < rounded ? "text-yellow-500" : "text-gray-300"}
        >
          {"\u2605"}
        </span>
      ))}
    </div>
  );
}

export default function BuyCropModal({ crop, onClose, onSuccess }) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
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
  const [addressError, setAddressError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const total = useMemo(
    () => quantity * Number(crop.price_per_kg || 0),
    [quantity, crop.price_per_kg]
  );

  useEffect(() => {
    setQuantity(1);
    setPaymentMethod("UPI");
    setAddress({
      name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
    });
    setAddressError("");
  }, [crop?.id]);

  useEffect(() => {
    if (!crop?.id) return;
    let active = true;

    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await api.get(`crops/${crop.id}/reviews/`);
        if (active) {
          setReviews(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Review fetch failed", err);
      } finally {
        if (active) {
          setReviewsLoading(false);
        }
      }
    };

    loadReviews();
    return () => {
      active = false;
    };
  }, [crop?.id]);

  const placeOrder = async () => {
    try {
      setLoading(true);
      setAddressError("");

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
        setAddressError(t("completeDeliveryAddress"));
        setLoading(false);
        return;
      }

      await api.post("orders/place/", {
        items: [
          {
            crop_id: crop.id,
            quantity_kg: quantity,
          },
        ],
        payment_method: paymentMethod,
        delivery_address: address,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("ORDER ERROR", err.response?.data || err);
      alert(t("orderFailed"));
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    setReviewError("");
    try {
      setReviewSubmitting(true);
      await api.post(`crops/${crop.id}/reviews/`, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviewForm({ rating: 5, comment: "" });
      const res = await api.get(`crops/${crop.id}/reviews/`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setReviewError(err.response?.data?.error || "Review submission failed");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${t("buyNow")} ${crop.name}`}
        className="bg-white p-6 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            {crop.image_url || crop.image ? (
              <SmartImage
                src={crop.image_url || crop.image}
                alt={`${crop.name} crop from ${crop.farm_name || crop.farmer_name || "a verified"} farm`}
                className="w-full h-52 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-52 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}

            <h3 className="text-2xl font-bold text-farmGreen mb-2">
              {t("buyNow")} {crop.name} - Fresh Harvest
            </h3>

            <p className="text-sm text-gray-600">
              {t("farmer")}: {crop.farm_name || crop.farmer_name || "Unknown"}
            </p>
            {crop.farmer_location && (
              <p className="text-xs text-gray-500">
                Location: {crop.farmer_location}
              </p>
            )}

            {crop.description && (
              <p className="text-sm text-gray-600 mt-3">{crop.description}</p>
            )}

            <div className="mt-4 text-sm space-y-1">
              <p>Price: Rs {crop.price_per_kg} / kg</p>
              <p>Available: {crop.quantity_kg} kg</p>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <Stars value={Number(crop.avg_rating || 0)} />
              <span className="text-gray-600">
                {crop.review_count
                  ? `${Number(crop.avg_rating || 0).toFixed(1)} (${crop.review_count})`
                  : "No reviews yet"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                {t("orderSummary")}
              </h4>
              <div className="text-sm text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span>{t("pricePerKg")}</span>
                  <span className="font-medium">Rs {crop.price_per_kg}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("quantity")}</span>
                  <span className="font-medium">{quantity} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("subtotal")}</span>
                  <span className="font-medium">
                    Rs {Number.isFinite(total) ? total.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-emerald-900">
                  <span>{t("delivery")}</span>
                  <span className="font-medium">{t("free")}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between text-slate-800">
                  <span className="font-semibold">{t("total")}</span>
                  <span className="font-semibold">
                    Rs {Number.isFinite(total) ? total.toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-farmLight/30">
              <h4 className="text-sm font-semibold mb-3">{t("deliveryAddress")}</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1">{t("fullName")}</label>
                  <input
                    value={address.name}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Recipient name"
                    aria-label={t("recipientName")}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">{t("phone")}</label>
                  <input
                    value={address.phone}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="10-digit mobile"
                    aria-label={t("mobile10Digit")}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">{t("pincode")}</label>
                  <input
                    value={address.postal_code}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        postal_code: e.target.value,
                      }))
                    }
                    placeholder="Postal code"
                    aria-label={t("postalCode")}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1">
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
                    placeholder="House no, Street, Area"
                    aria-label={t("houseStreetArea")}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1">
                    {t("addressLine2")} (optional)
                  </label>
                  <input
                    value={address.address_line2}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        address_line2: e.target.value,
                      }))
                    }
                    placeholder="Landmark, Apartment"
                    aria-label={t("landmarkApartment")}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">{t("city")}</label>
                  <input
                    value={address.city}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    placeholder="City"
                    aria-label={t("city")}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">{t("state")}</label>
                  <input
                    value={address.state}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    placeholder="State"
                    aria-label={t("state")}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              {addressError ? (
                <p className="text-xs text-red-600 mt-2">{addressError}</p>
              ) : null}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">{t("quantityKg")}</label>
              <input
                type="number"
                min="1"
                max={crop.quantity_kg}
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">{t("paymentMethod")}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="btn-outline">
                {t("cancel")}
              </button>
              <button
                onClick={placeOrder}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Placing..." : t("placeOrder")}
              </button>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold mb-2">Customer Reviews</h4>
              {reviewsLoading ? (
                <p className="text-sm text-gray-500">{t("loadingReviews")}</p>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-500">
                  {t("beFirstReview")}
                </p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-3 border rounded-lg text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {review.customer_name || "Customer"}
                        </span>
                        <Stars value={Number(review.rating || 0)} />
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-2">
                <h5 className="text-sm font-semibold">
                  {t("addReviewVerified")}
                </h5>
                {reviewError && (
                  <p className="text-sm text-red-500">{reviewError}</p>
                )}
                <div className="flex items-center gap-2">
                  <label className="text-sm">{t("rating")}</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        rating: e.target.value,
                      }))
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={`rating-${value}`} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows="2"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  placeholder={t("shareExperience")}
                  className="w-full border rounded p-2 text-sm"
                />
                <button
                  onClick={submitReview}
                  disabled={reviewSubmitting}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  {reviewSubmitting ? t("submitting") : t("submitReview")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
