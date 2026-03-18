import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import SmartImage from "./SmartImage";

function Stars({ value = 0 }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={`star-${index}`}
          className={index < rounded ? "text-amber-500" : "text-slate-300"}
        >
          {"\u2605"}
        </span>
      ))}
    </div>
  );
}

export default function CropCard({ crop, onBuy }) {
  const rating = Number(crop.avg_rating ?? 0);
  const reviews = Number(crop.review_count ?? 0);
  const { addItem } = useCart();
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card h-full p-4"
    >
      {crop.image_url || crop.image ? (
        <SmartImage
          src={crop.image_url || crop.image}
          alt={`${crop.name} crop from ${crop.farm_name || crop.farmer_name || "a verified"} farm`}
          className="mb-4 h-48 w-full rounded-[1.35rem] object-cover"
        />
      ) : (
        <div className="mb-4 flex h-48 w-full items-center justify-center rounded-[1.35rem] bg-slate-100 text-sm text-slate-400">
          No image
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{crop.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
            {crop.farm_name || crop.farmer_name || "Unknown"} Farm
          </p>
        </div>
        <span className="badge">Fresh</span>
      </div>

      {crop.farmer_location && (
        <p className="mt-3 text-sm text-slate-500">{crop.farmer_location}</p>
      )}

      {crop.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {crop.description}
        </p>
      )}

      <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-4 text-sm">
        <div className="flex items-center justify-between text-slate-700">
          <span>Price</span>
          <span className="font-semibold text-emerald-800">
            Rs {crop.price_per_kg} / kg
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-slate-500">
          <span>Stock</span>
          <span>{crop.quantity_kg} kg</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Stars value={rating} />
          <span className="text-slate-500">
            {reviews > 0 ? `${rating.toFixed(1)} (${reviews})` : "No reviews"}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        <motion.button whileTap={{ scale: 0.985 }} onClick={onBuy} className="btn-primary w-full">
          {t("buyNow")}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.985 }}
          onClick={() => addItem(crop, 1)}
          className="btn-outline w-full"
        >
          {t("addToCart")}
        </motion.button>
        <Link to={`/customer/crops/${crop.id}`} className="btn-ghost w-full text-center">
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
