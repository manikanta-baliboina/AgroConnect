import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import CropCard from "../components/CropCard";
import BuyCropModal from "../components/BuyCropModal";
import PageTransition from "../components/PageTransition";
import { useLanguage } from "../context/LanguageContext";

const marketHero =
  "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1400&q=80";

export default function CustomerMarketplace() {
  const { t } = useLanguage();
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
    setLoading(true);
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
    <PageTransition className="page-shell py-6 md:py-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/55 bg-white/65 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="eyebrow">
              Verified farmers, transparent rates, fresh dispatch
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-slate-950">
              Source crops from growers with a marketplace that feels premium.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Search by crop type, compare pricing, and buy from real farms
              with cleaner product presentation and a more confident checkout
              flow.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="badge">Quality Checked</span>
              <span className="badge">Cold Chain Ready</span>
              <span className="badge">Same-day Dispatch</span>
            </div>
          </div>

          <div
            className="hero-photo min-h-[280px] rounded-none lg:min-h-full"
            style={{ backgroundImage: `url(${marketHero})` }}
          >
            <div className="relative z-10 flex h-full items-end p-6 text-white">
              <div className="max-w-sm">
                <p className="text-2xl font-semibold">Fresh crop discovery</p>
                <p className="mt-2 text-sm leading-6 text-white/82">
                  Real farm imagery gives buyers more confidence than generic
                  marketplace styling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="card-soft h-fit p-5 lg:sticky lg:top-32">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t("filters")}</h2>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                {t("refineResults")}
              </p>
            </div>
            <button onClick={resetFilters} className="btn-ghost text-xs">
              {t("reset")}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <input
              type="text"
              name="search"
              placeholder="Search crop"
              value={filters.search}
              onChange={handleFilterChange}
              className="input"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input"
            />
            <input
              type="number"
              name="min_price"
              placeholder="Min price"
              value={filters.min_price}
              onChange={handleFilterChange}
              className="input"
            />
            <input
              type="number"
              name="max_price"
              placeholder="Max price"
              value={filters.max_price}
              onChange={handleFilterChange}
              className="input"
            />
            <select
              name="min_rating"
              value={filters.min_rating}
              onChange={handleFilterChange}
              className="input"
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
              className="input"
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
              <h2 className="section-title">{t("availableCrops")}</h2>
              <p className="section-sub">
                {loading ? "Loading crops..." : `${crops.length} ${t("resultsReady")}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge">Fast checkout</span>
              <span className="badge">Trusted reviews</span>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="card p-4">
                  <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="mt-4 h-4 animate-pulse rounded bg-slate-100" />
                  <div className="mt-2 h-3 animate-pulse rounded bg-slate-100" />
                  <div className="mt-6 h-10 animate-pulse rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          ) : crops.length === 0 ? (
            <div className="card p-8 text-center text-slate-600">
              No crops available right now.
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.06,
                  },
                },
              }}
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              {crops.map((crop) => (
                <motion.div
                  key={crop.id}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <CropCard
                    crop={crop}
                    onBuy={() => setSelectedCrop(crop)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      {selectedCrop && (
        <BuyCropModal
          crop={selectedCrop}
          onClose={() => setSelectedCrop(null)}
          onSuccess={() => alert("Order placed successfully!")}
        />
      )}
    </PageTransition>
  );
}
