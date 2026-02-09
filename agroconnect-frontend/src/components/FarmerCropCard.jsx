import { motion } from "framer-motion";

export default function FarmerCropCard({ crop, onEdit, onDelete }) {
  const backendBaseUrl = (
    import.meta.env.VITE_API_BASE_URL || "https://agroconnect-oezp.onrender.com"
  ).replace(/\/+$/, "");

  const rawImage = crop.image_url || crop.image || "";
  const normalizedRawImage = rawImage.startsWith("http://agroconnect-oezp.onrender.com")
    ? rawImage.replace("http://", "https://")
    : rawImage;
  const imageSrc = normalizedRawImage
    ? normalizedRawImage.startsWith("http://") ||
      normalizedRawImage.startsWith("https://") ||
      normalizedRawImage.startsWith("data:") ||
      normalizedRawImage.startsWith("blob:")
      ? normalizedRawImage
      : `${backendBaseUrl}${normalizedRawImage.startsWith("/") ? "" : "/"}${normalizedRawImage}`
    : "";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-xl shadow-md border w-full max-w-md mx-auto"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={crop.name}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}

      <h3 className="text-xl font-semibold text-farmGreen">
        {crop.name}
      </h3>

      <p className="text-sm text-gray-600 mt-1">Category: {crop.category}</p>

      {crop.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {crop.description}
        </p>
      )}

      <div className="mt-3 flex justify-between items-center">
        <span className="font-bold text-gray-800">
          Rs {crop.price_per_kg}/kg
        </span>
        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
          {crop.quantity_kg} kg
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Harvest Date: {crop.harvest_date}
      </p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
