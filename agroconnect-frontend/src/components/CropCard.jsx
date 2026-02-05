import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Stars({ value = 0 }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={`star-${index}`}
          className={index < rounded ? "text-yellow-500" : "text-gray-300"}
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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card p-4 hover:shadow-lg transition"
    >
      {crop.image_url || crop.image ? (
        <img
          src={crop.image_url || crop.image}
          alt={crop.name}
          className="w-full h-44 object-cover rounded-lg mb-3"
        />
      ) : (
        <div className="w-full h-44 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-800">{crop.name}</h3>
        <span className="badge">Fresh</span>
      </div>

      <p className="text-xs text-slate-500 mt-1">
        {crop.farm_name || crop.farmer_name || "Unknown"} Farm
      </p>

      {crop.farmer_location && (
        <p className="text-xs text-slate-400 mt-1">{crop.farmer_location}</p>
      )}

      {crop.description && (
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">
          {crop.description}
        </p>
      )}

      <div className="mt-3 grid gap-1 text-sm">
        <p className="text-slate-700">
          Price: <span className="font-semibold">Rs {crop.price_per_kg}</span>{" "}
          <span className="text-slate-400">/ kg</span>
        </p>
        <p className="text-slate-500">Stock: {crop.quantity_kg} kg</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Stars value={rating} />
          <span className="text-slate-500">
            {reviews > 0 ? `${rating.toFixed(1)} (${reviews})` : "No reviews"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <button onClick={onBuy} className="w-full btn-primary">
          Buy Now
        </button>
        <button onClick={() => addItem(crop, 1)} className="w-full btn-outline">
          Add to Cart
        </button>
        <Link
          to={`/customer/crops/${crop.id}`}
          className="w-full btn-ghost text-center"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
