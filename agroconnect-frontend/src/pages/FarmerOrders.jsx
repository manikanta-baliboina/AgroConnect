import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import OrderStatusBadge from "../components/OrderStatusBadge";

export default function FarmerOrders() {
  const [orderItems, setOrderItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handle);
  }, [search]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("farmer/orders/", {
        params: {
          page,
          page_size: pageSize,
          status: statusFilter,
          sort: sortBy,
          search: debouncedSearch
        }
      });
      console.log("Farmer orders:", res.data);
      if (Array.isArray(res.data)) {
        setOrderItems(res.data);
        setTotalCount(res.data.length);
      } else {
        setOrderItems(res.data.results ?? []);
        setTotalCount(res.data.count ?? 0);
      }
    } catch (err) {
      console.error("Failed to load farmer orders", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, sortBy, debouncedSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return undefined;

    const baseUrl = api.defaults.baseURL ?? "";
    const streamUrl = `${baseUrl}/farmer/orders/stream/?token=${token}`;
    const source = new EventSource(streamUrl);

    const onOrdersUpdate = () => {
      fetchOrders();
    };

    source.addEventListener("orders", onOrdersUpdate);
    source.onerror = () => {
      source.close();
    };

    return () => source.close();
  }, [fetchOrders]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`farmer/orders/${orderId}/status/`, { status });
      fetchOrders();
    } catch {
      alert("Status update failed");
    }
  };

  const skeletonRows = Array.from({ length: 4 }, (_, index) => index);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasFilters =
    statusFilter !== "ALL" || sortBy !== "newest" || debouncedSearch.length > 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farmGreen mb-6">
        {"\u{1F4E6}"} Farmer Orders
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search crop..."
          className="border rounded px-3 py-2 w-56"
        />
        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(1);
          }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="quantity_desc">Quantity: High to Low</option>
          <option value="quantity_asc">Quantity: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="price_asc">Price: Low to High</option>
        </select>
        <button
          className="px-3 py-2 border rounded"
          onClick={() => {
            setSearch("");
            setStatusFilter("ALL");
            setSortBy("newest");
            setPage(1);
          }}
        >
          Reset
        </button>
      </div>

      {!loading && orderItems.length === 0 ? (
        <p>{hasFilters ? "No matching orders" : "No orders yet"}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Order ID</th>
                <th className="p-2">Crop</th>
                <th className="p-2">Quantity (kg)</th>
                <th className="p-2">Total (Rs)</th>
                <th className="p-2">Status</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading
                ? skeletonRows.map((row) => (
                    <tr
                      key={`skeleton-${row}`}
                      className="border-t text-center animate-pulse"
                    >
                      <td className="p-2">
                        <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
                      </td>
                      <td className="p-2">
                        <div className="h-4 bg-gray-200 rounded w-28 mx-auto" />
                      </td>
                      <td className="p-2">
                        <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                      </td>
                      <td className="p-2">
                        <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                      </td>
                      <td className="p-2">
                        <div className="h-5 bg-gray-200 rounded w-20 mx-auto" />
                      </td>
                      <td className="p-2">
                        <div className="h-5 bg-gray-200 rounded w-20 mx-auto" />
                      </td>
                      <td className="p-2">
                        <div className="h-8 bg-gray-200 rounded w-24 mx-auto" />
                      </td>
                    </tr>
                  ))
                : orderItems.map((item) => {
                    const quantity = Number(item.quantity_kg ?? 0);
                    const pricePerKg = Number(item.price_per_kg ?? 0);
                    const total = quantity * pricePerKg;

                    return (
                      <tr
                        key={`${item.order_id}-${item.crop}`}
                        className="border-t text-center"
                      >
                        <td className="p-2">{item.order_id}</td>

                        <td className="p-2">
                          {item.crop_name ?? item.crop ?? "Unknown"}
                        </td>

                        <td className="p-2">
                          {Number.isFinite(quantity) ? quantity : "\u2014"}
                        </td>

                        <td className="p-2">
                          Rs {Number.isFinite(total) ? total.toFixed(2) : "0.00"}
                        </td>

                        <td className="p-2">
                          <OrderStatusBadge status={item.order_status} />
                        </td>

                        <td className="p-2 text-sm text-gray-700">
                          <div>{item.payment_method || "COD"}</div>
                          <div className="text-xs text-gray-500">
                            {item.payment_status || "PENDING"}
                          </div>
                        </td>

                        <td className="p-2 space-x-2">
                          {item.order_status === "PENDING" && (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus(item.order_id, "CONFIRMED")
                                }
                                className="px-3 py-1 bg-green-600 text-white rounded"
                              >
                                Confirm
                              </button>

                              <button
                                onClick={() =>
                                  updateStatus(item.order_id, "CANCELLED")
                                }
                                className="px-3 py-1 bg-red-600 text-white rounded"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {!loading && totalCount > pageSize && (
            <div className="flex items-center justify-between mt-4">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
