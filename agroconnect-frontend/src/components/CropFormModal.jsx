import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function CropFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price_per_kg: "",
    quantity_kg: "",
    harvest_date: "",
    imageFile: null,
  });
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        name: initialData.name || "",
        category: initialData.category || "",
        description: initialData.description || "",
        price_per_kg: initialData.price_per_kg || "",
        quantity_kg: initialData.quantity_kg || "",
        harvest_date: initialData.harvest_date || "",
        imageFile: null,
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setForm({ ...form, imageFile: files?.[0] || null });
      return;
    }
    setForm({ ...form, [name]: value });
    if (name === "harvest_date") {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (form.harvest_date && form.harvest_date > today) {
      setError(t("harvestDateFuture"));
      return;
    }
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("category", form.category);
    payload.append("description", form.description || "");
    payload.append("price_per_kg", form.price_per_kg);
    payload.append("quantity_kg", form.quantity_kg);
    payload.append("harvest_date", form.harvest_date);
    if (form.imageFile) {
      payload.append("image", form.imageFile);
    }
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        role="dialog"
        aria-modal="true"
        aria-label={initialData ? t("editCrop") : t("addCropTitle")}
        className="bg-white p-6 rounded-xl w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h3 className="text-xl font-bold text-farmGreen mb-4">
          {initialData ? t("editCrop") : t("addCropTitle")} {"\u{1F33E}"}
        </h3>

        <input
          name="name"
          placeholder={t("cropName")}
          required
          value={form.name}
          onChange={handleChange}
          className="input mb-3"
        />

        <input
          name="category"
          placeholder={t("category")}
          required
          value={form.category}
          onChange={handleChange}
          className="input mb-3"
        />

        <textarea
          name="description"
          placeholder={t("shortDescription")}
          value={form.description}
          onChange={handleChange}
          className="input mb-3"
          rows="3"
        />

        <input
          type="number"
          name="price_per_kg"
          placeholder={t("pricePerKg")}
          required
          value={form.price_per_kg}
          onChange={handleChange}
          className="input mb-3"
        />

        <input
          type="number"
          name="quantity_kg"
          placeholder={t("quantityKg")}
          required
          value={form.quantity_kg}
          onChange={handleChange}
          className="input mb-3"
        />

        <input
          type="date"
          name="harvest_date"
          required
          value={form.harvest_date}
          onChange={handleChange}
          max={today}
          className="input mb-4"
        />
        {error ? (
          <p className="text-sm text-red-600 -mt-2 mb-4">{error}</p>
        ) : null}

        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          className="input mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {t("save")}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
