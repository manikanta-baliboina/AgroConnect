import { useEffect, useState } from "react";
import api from "../api/axios";
import FarmerCropCard from "../components/FarmerCropCard";
import CropFormModal from "../components/CropFormModal";
import { useLanguage } from "../context/LanguageContext";

export default function FarmerDashboard() {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCrop, setEditCrop] = useState(null);
  const [profile, setProfile] = useState({ farm_name: "", location: "" });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  const fetchCrops = () => {
    setLoading(true);
    api
      .get("farmer/crops/")
      .then((res) => setCrops(res.data))
      .finally(() => setLoading(false));
  };

  const fetchMetrics = () => {
    setMetricsLoading(true);
    api
      .get("auth/farmer/dashboard/")
      .then((res) => setMetrics(res.data.metrics))
      .finally(() => setMetricsLoading(false));
  };

  const fetchProfile = () => {
    setProfileLoading(true);
    api
      .get("auth/farmer/profile/")
      .then((res) => {
        setProfile({
          farm_name: res.data.farm_name || "",
          location: res.data.location || "",
        });
      })
      .finally(() => setProfileLoading(false));
  };

  useEffect(() => {
    fetchCrops();
    fetchMetrics();
    fetchProfile();
  }, []);

  const handleAdd = (data) => {
    api
      .post("farmer/crops/", data)
      .then(() => {
      setModalOpen(false);
      fetchCrops();
      fetchMetrics();
    });
  };

  const handleEdit = (data) => {
    api
      .patch(`farmer/crops/${editCrop.id}/`, data)
      .then(() => {
      setEditCrop(null);
      fetchCrops();
      fetchMetrics();
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm(t("deleteCropConfirm"))) return;
    api.delete(`farmer/crops/${id}/`).then(() => {
      fetchCrops();
      fetchMetrics();
    });
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      setProfileSaving(true);
      await api.put("auth/farmer/profile/", profile);
      fetchProfile();
    } catch (err) {
      console.error("Profile update failed", err);
      alert(t("profileUpdateFailed"));
    } finally {
      setProfileSaving(false);
    }
  };

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN").format(Number(value || 0));
  const formatMoney = (value) =>
    `\u20B9${Number(value || 0).toFixed(2)}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-farmGreen">
          {t("farmerDashboard")} {"\u{1F331}"}
        </h2>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
        >
          + {t("addCrop")}
        </button>
      </div>

      {/* Inventory KPIs */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-farmGreen">
          {t("inventoryOverview")}
        </h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metricsLoading ? (
          <>
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-24" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-24" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-24" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-24" />
          </>
        ) : (
          <>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">{t("totalCrops")}</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.total_crops)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">{t("totalStockKg")}</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.total_stock_kg)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">{t("confirmedRevenue")}</p>
              <p className="text-2xl font-semibold">
                {formatMoney(metrics?.confirmed_revenue)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">{t("ordersLast7Days")}</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.recent_orders)}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white border rounded-xl p-5 mb-8">
        <h3 className="text-lg font-semibold text-farmGreen mb-3">
          {t("farmProfile")}
        </h3>
        {profileLoading ? (
          <div className="h-16 bg-gray-100 rounded animate-pulse" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">{t("farmName")}</label>
              <input
                name="farm_name"
                value={profile.farm_name}
                onChange={handleProfileChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("location")}</label>
              <input
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                className="input"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={saveProfile}
                disabled={profileSaving}
                className="btn-primary"
              >
                {profileSaving ? "Saving..." : t("saveProfile")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-farmGreen">{t("orderSummaryTitle")}</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metricsLoading ? (
          <>
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-20" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-20" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-20" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-20" />
          </>
        ) : (
          <>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">{t("totalOrders")}</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.total_orders)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">{t("pendingOrders")}</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.pending_orders)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">{t("confirmedOrders")}</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.confirmed_orders)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">{t("cancelledOrders")}</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.cancelled_orders)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card p-5">
              <div className="h-48 animate-pulse rounded-[1.25rem] bg-slate-100" />
              <div className="mt-4 h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-6 h-10 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {!loading && crops.length === 0 && (
        <p>{t("noCropsAddedYet")} {"\u{1F33E}"}</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {crops.map((crop) => (
          <FarmerCropCard
            key={crop.id}
            crop={crop}
            onEdit={() => setEditCrop(crop)}
            onDelete={() => handleDelete(crop.id)}
          />
        ))}
      </div>

      {/* Add */}
      <CropFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
      />

      {/* Edit */}
      <CropFormModal
        isOpen={!!editCrop}
        initialData={editCrop}
        onClose={() => setEditCrop(null)}
        onSubmit={handleEdit}
      />
    </div>
  );
}
