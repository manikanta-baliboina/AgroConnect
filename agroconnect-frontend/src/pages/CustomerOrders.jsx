import { useEffect, useState } from "react";
import api from "../api/axios";
import OrderStatusBadge from "../components/OrderStatusBadge";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("orders/");
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else if (res.data.results) {
          setOrders(res.data.results);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to load customer orders", err);
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setError("Please log in as a customer to view your orders.");
        } else {
          setError("Could not load orders. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farmGreen mb-6">
        {"\u{1F6D2}"} My Orders
      </h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-gray-600">
                  Order #{order.id}
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="mt-2 text-sm text-gray-700">
                Payment: {order.payment_method} ({order.payment_status})
              </div>

              <div className="mt-3 divide-y">
                {(order.items || []).map((item, index) => (
                  <div
                    key={`${order.id}-${item.crop}-${index}`}
                    className="py-2 flex justify-between text-sm"
                  >
                    <span>{item.crop_name}</span>
                    <span>
                      {item.quantity_kg} kg x Rs {item.price_per_kg}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 font-semibold text-right">
                Total: Rs {Number(order.total_amount || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
