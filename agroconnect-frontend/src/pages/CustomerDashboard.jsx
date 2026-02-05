import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function CustomerDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    setMetricsLoading(true);
    api
      .get("/customer/dashboard/")
      .then((res) => setMetrics(res.data.metrics))
      .finally(() => setMetricsLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h2 className="text-3xl font-bold text-farmGreen">
        Crop Marketplace {"\u{1F6D2}"}
      </h2>

      <p className="mt-2 text-gray-600">
        Browse fresh crops directly from farmers.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        {metricsLoading ? (
          <>
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-24" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-24" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-24" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-24" />
          </>
        ) : (
          <>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">
                {metrics?.total_orders ?? 0}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold">
                {metrics?.pending_orders ?? 0}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Confirmed Orders</p>
              <p className="text-2xl font-semibold">
                {metrics?.confirmed_orders ?? 0}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold">
                {"\u20B9"}
                {Number(metrics?.total_spent ?? 0).toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
        {metricsLoading ? (
          <>
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-20" />
            <div className="p-4 border rounded-lg animate-pulse bg-gray-50 h-20" />
          </>
        ) : (
          <>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Recent Orders (7 Days)</p>
              <p className="text-2xl font-semibold">
                {metrics?.recent_orders ?? 0}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Cancelled Orders</p>
              <p className="text-2xl font-semibold">
                {metrics?.cancelled_orders ?? 0}
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
