import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-[calc(100vh-80px)] px-6 py-14 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-0 right-0 h-64 bg-gradient-to-b from-emerald-200/50 to-transparent" />
        <div className="absolute -bottom-24 left-[-10%] right-[-10%] h-64 rounded-[100%] bg-gradient-to-r from-emerald-700/35 via-lime-600/35 to-emerald-800/35 blur-sm" />
        <div className="absolute -bottom-10 left-[-15%] right-[-15%] h-40 rounded-[100%] bg-gradient-to-r from-lime-700/30 via-emerald-600/30 to-lime-500/30 blur-sm" />
        <div className="absolute bottom-10 left-[-20%] right-[-20%] h-24 rounded-[100%] bg-gradient-to-r from-emerald-500/25 via-lime-500/25 to-emerald-600/25 blur-sm" />
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-white/70 border border-emerald-100 text-emerald-800 shadow-sm">
              Fresh harvests. Fair prices. Direct from farmers.
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              A smarter marketplace for
              <span className="text-emerald-700"> farmers</span> and
              <span className="text-lime-700"> customers</span>.
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              AgroConnect helps farmers sell crops directly, with transparent
              pricing, verified reviews, and fast checkout. Customers get fresh
              produce with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {!user && (
                <>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-700/20 hover:translate-y-[-1px] transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 border border-emerald-600 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-700 hover:text-white transition"
                  >
                    Login
                  </Link>
                </>
              )}
              {user?.role === "FARMER" && (
                <Link
                  to="/farmer"
                  className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-700/20"
                >
                  Go to Dashboard
                </Link>
              )}
              {user?.role === "CUSTOMER" && (
                <Link
                  to="/customer"
                  className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-700/20"
                >
                  Browse Marketplace
                </Link>
              )}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-sm text-slate-500">Trusted Farmers</p>
                <p className="text-2xl font-bold text-slate-900">400+</p>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-sm text-slate-500">Avg. Freshness</p>
                <p className="text-2xl font-bold text-slate-900">98%</p>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-sm text-slate-500">Monthly Orders</p>
                <p className="text-2xl font-bold text-slate-900">12k</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <div className="grid gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-50">
                <p className="text-sm text-emerald-700 font-semibold">
                  Harvest Today
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Premium Rice
                </p>
                <p className="text-sm text-slate-500">
                  Verified farmer Ã¢ÂÂ¢ Same-day dispatch
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-700">
                    Rs 48/kg
                  </span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                    4.8 rating
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-lime-50">
                <p className="text-sm text-lime-700 font-semibold">
                  Best Seller
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Organic Tomatoes
                </p>
                <p className="text-sm text-slate-500">
                  120 kg available Ã¢ÂÂ¢ Direct from farm
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-lime-700">
                    Rs 32/kg
                  </span>
                  <span className="text-xs bg-lime-50 text-lime-700 px-2 py-1 rounded-full">
                    4.9 rating
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-50">
                <p className="text-sm text-emerald-700 font-semibold">
                  New Arrival
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Fresh Mangoes
                </p>
                <p className="text-sm text-slate-500">
                  Seasonal Ã¢ÂÂ¢ Limited stock
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-700">
                    Rs 95/kg
                  </span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                    4.7 rating
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Transparent Pricing
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Farmers set the price, customers see the value with zero hidden
              fees.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Verified Reviews
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Reviews from confirmed buyers build trust for every crop listing.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Fast Checkout
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              UPI, card, or cash-on-delivery. Place orders in seconds.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
