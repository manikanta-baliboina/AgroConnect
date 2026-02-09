import { useEffect, useState } from "react";
import api from "../api/axios";
import FarmerCropCard from "../components/FarmerCropCard";
import CropFormModal from "../components/CropFormModal";

export default function FarmerDashboard() {
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
    if (!window.confirm("Delete this crop?")) return;
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
      alert("Profile update failed");
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
          Farmer Dashboard {"\u{1F331}"}
        </h2>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2 bg-farmGreen text-white rounded-lg"
        >
          + Add Crop
        </button>
      </div>

      {/* Inventory KPIs */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-farmGreen">
          Inventory Overview
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
              <p className="text-sm text-gray-500">Total Crops</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.total_crops)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">Total Stock (kg)</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.total_stock_kg)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">Confirmed Revenue</p>
              <p className="text-2xl font-semibold">
                {formatMoney(metrics?.confirmed_revenue)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">Orders (Last 7 Days)</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.recent_orders)}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white border rounded-xl p-5 mb-8">
        <h3 className="text-lg font-semibold text-farmGreen mb-3">
          Farm Profile
        </h3>
        {profileLoading ? (
          <div className="h-16 bg-gray-100 rounded animate-pulse" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Farm Name</label>
              <input
                name="farm_name"
                value={profile.farm_name}
                onChange={handleProfileChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={saveProfile}
                disabled={profileSaving}
                className="px-4 py-2 bg-farmGreen text-white rounded"
              >
                {profileSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-farmGreen">Order Summary</h3>
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
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.total_orders)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.pending_orders)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">Confirmed Orders</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.confirmed_orders)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">Cancelled Orders</p>
              <p className="text-2xl font-semibold">
                {formatNumber(metrics?.cancelled_orders)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      {loading && <p>Loading...</p>}

      {!loading && crops.length === 0 && (
        <p>No crops added yet {"\u{1F33E}"}</p>
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
