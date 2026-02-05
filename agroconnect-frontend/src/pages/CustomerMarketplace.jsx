import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import CropCard from "../components/CropCard";
import BuyCropModal from "../components/BuyCropModal";

export default function CustomerMarketplace() {
  const [searchParams] = useSearchParams();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    min_price: "",
    max_price: "",
    min_rating: "",
    sort: "newest",
  });

  const queryParams = useMemo(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        params[key] = value;
      }
    });
    return params;
  }, [filters]);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    if (search) {
      setFilters((prev) => ({ ...prev, search }));
    }
  }, [searchParams]);

  useEffect(() => {
    api
      .get("/crops/", { params: queryParams })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCrops(res.data);
        } else if (res.data.results) {
          setCrops(res.data.results);
        }
      })
      .catch((err) => {
        console.error("Crop fetch failed", err);
      })
      .finally(() => setLoading(false));
  }, [queryParams]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      min_price: "",
      max_price: "",
      min_rating: "",
      sort: "newest",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="page-shell py-8">
        <div className="card-soft p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-emerald-900">
                Fresh Crop Marketplace
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Discover seasonal harvests from trusted local farmers.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge">Verified Farmers</span>
              <span className="badge">Same-day Dispatch</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="card p-4 h-fit lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">
                Filters
              </h3>
              <button onClick={resetFilters} className="btn-ghost text-xs">
                Reset
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                name="search"
                placeholder="Search crop"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="min_price"
                placeholder="Min price"
                value={filters.min_price}
                onChange={handleFilterChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="max_price"
                placeholder="Max price"
                value={filters.max_price}
                onChange={handleFilterChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <select
                name="min_rating"
                value={filters.min_rating}
                onChange={handleFilterChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Min rating</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5</option>
              </select>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="section-title">All Crops</h2>
                <p className="section-sub">
                  {loading ? "Loading crops..." : `${crops.length} results`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge">Cold Chain</span>
                <span className="badge">Quality Checked</span>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="card p-4">
                    <div className="h-40 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="mt-3 h-4 bg-slate-100 rounded animate-pulse" />
                    <div className="mt-2 h-3 bg-slate-100 rounded animate-pulse" />
                    <div className="mt-4 h-9 bg-slate-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : crops.length === 0 ? (
              <div className="card p-6 text-center text-slate-600">
                No crops available right now.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {crops.map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    onBuy={() => setSelectedCrop(crop)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {selectedCrop && (
        <BuyCropModal
          crop={selectedCrop}
          onClose={() => setSelectedCrop(null)}
          onSuccess={() => alert("Order placed successfully!")}
        />
      )}
    </div>
  );
}
