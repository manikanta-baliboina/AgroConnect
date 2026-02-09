import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import BuyCropModal from "../components/BuyCropModal";
import { useCart } from "../context/CartContext";

function Stars({ value = 0 }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={`detail-star-${index}`}
          className={index < rounded ? "text-yellow-500" : "text-gray-300"}
        >
          {"\u2605"}
        </span>
      ))}
    </div>
  );
}

export default function CropDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showBuy, setShowBuy] = useState(false);

  const rating = useMemo(() => Number(crop?.avg_rating || 0), [crop]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`crops/${id}/`);
        if (active) {
          setCrop(res.data || null);
        }
      } catch (err) {
        console.error("Failed to load crop", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let active = true;
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await api.get(`crops/${id}/reviews/`);
        if (active) {
          setReviews(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Review fetch failed", err);
      } finally {
        if (active) setReviewsLoading(false);
      }
    };
    loadReviews();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell py-10">
        <div className="card p-6">Loading crop...</div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="page-shell py-10">
        <div className="card p-6">Crop not found.</div>
      </div>
    );
  }

  return (
    <div className="page-shell py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4">
        Back to marketplace
      </button>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="card p-5">
          {crop.image_url || crop.image ? (
            <img
              src={crop.image_url || crop.image}
              alt={crop.name}
              className="w-full h-80 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {crop.description && (
            <p className="text-sm text-slate-600 mt-4">
              {crop.description}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {crop.name}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {crop.farm_name || crop.farmer_name || "Unknown"} Farm
                </p>
                {crop.farmer_location && (
                  <p className="text-xs text-slate-400 mt-1">
                    {crop.farmer_location}
                  </p>
                )}
              </div>
              <span className="badge">Harvest Fresh</span>
            </div>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <Stars value={rating} />
              <span className="text-slate-500">
                {crop.review_count
                  ? `${rating.toFixed(1)} (${crop.review_count})`
                  : "No reviews yet"}
              </span>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <p className="text-slate-700">
                Price: <span className="font-semibold">Rs {crop.price_per_kg}</span>{" "}
                <span className="text-slate-400">/ kg</span>
              </p>
              <p className="text-slate-500">Available stock: {crop.quantity_kg} kg</p>
            </div>

            <div className="mt-4 grid gap-3">
              <button onClick={() => setShowBuy(true)} className="btn-primary">
                Buy Now
              </button>
              <button
                onClick={() => addItem(crop, 1)}
                className="btn-outline"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Delivery & quality
            </h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>Direct from verified farmers</li>
              <li>Quality-checked before dispatch</li>
              <li>Secure packaging & cold chain</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 card p-5">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">
          Customer reviews
        </h3>
        {reviewsLoading ? (
          <p className="text-sm text-slate-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-500">No reviews yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {review.customer_name || "Customer"}
                  </span>
                  <Stars value={Number(review.rating || 0)} />
                </div>
                {review.comment && (
                  <p className="text-slate-600 mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showBuy && (
        <BuyCropModal
          crop={crop}
          onClose={() => setShowBuy(false)}
          onSuccess={() => alert("Order placed successfully!")}
        />
      )}
    </div>
  );
}
