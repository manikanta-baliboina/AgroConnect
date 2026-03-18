import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { useLanguage } from "../context/LanguageContext";

export default function FarmerOrders() {
  const { t } = useLanguage();
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
      alert(t("statusUpdateFailed"));
    }
  };

  const skeletonRows = Array.from({ length: 4 }, (_, index) => index);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasFilters =
    statusFilter !== "ALL" || sortBy !== "newest" || debouncedSearch.length > 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farmGreen mb-6">
        {"\u{1F4E6}"} {t("orders")}
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("crop")}
          className="input w-56"
        />
        <select
          className="input w-auto min-w-[11rem]"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">{t("allStatuses")}</option>
          <option value="PENDING">{t("pending")}</option>
          <option value="CONFIRMED">{t("confirmed")}</option>
          <option value="CANCELLED">{t("cancelled")}</option>
        </select>
        <select
          className="input w-auto min-w-[14rem]"
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(1);
          }}
        >
          <option value="newest">{t("newest")}</option>
          <option value="oldest">{t("oldest")}</option>
          <option value="quantity_desc">{t("quantityHighToLow")}</option>
          <option value="quantity_asc">{t("quantityLowToHigh")}</option>
          <option value="price_desc">{t("priceHighToLow")}</option>
          <option value="price_asc">{t("priceLowToHigh")}</option>
        </select>
        <button
          className="btn-outline"
          onClick={() => {
            setSearch("");
            setStatusFilter("ALL");
            setSortBy("newest");
            setPage(1);
          }}
        >
          {t("reset")}
        </button>
      </div>

      {!loading && orderItems.length === 0 ? (
        <p>{hasFilters ? t("noMatchingOrders") : t("noOrdersYet")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">{t("orderId")}</th>
                <th className="p-2">{t("crop")}</th>
                <th className="p-2">{t("quantityKg")}</th>
                <th className="p-2">{t("totalRs")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2">{t("payment")}</th>
                <th className="p-2">{t("action")}</th>
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
                                className="rounded-full bg-green-700 px-4 py-2 text-white transition hover:bg-green-800"
                              >
                                {t("confirm")}
                              </button>

                              <button
                                onClick={() =>
                                  updateStatus(item.order_id, "CANCELLED")
                                }
                                className="rounded-full bg-red-700 px-4 py-2 text-white transition hover:bg-red-800"
                              >
                                {t("reject")}
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
                className="btn-outline disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
              >
                {t("prev")}
              </button>
              <span className="text-sm text-gray-600">
                {t("pageOf")
                  .replace("{page}", page)
                  .replace("{totalPages}", totalPages)}
              </span>
              <button
                className="btn-outline disabled:opacity-50"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
              >
                {t("next")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
