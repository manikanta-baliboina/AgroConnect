import { useLanguage } from "../context/LanguageContext";

export default function OrderStatusBadge({ status }) {
  const { t } = useLanguage();
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    CONFIRMED: "bg-green-100 text-green-800",
    DELIVERED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const labels = {
    PENDING: t("pending"),
    ACCEPTED: t("confirmed"),
    CONFIRMED: t("confirmed"),
    DELIVERED: "Delivered",
    CANCELLED: t("cancelled"),
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        colors[status] || "bg-slate-100 text-slate-800"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
