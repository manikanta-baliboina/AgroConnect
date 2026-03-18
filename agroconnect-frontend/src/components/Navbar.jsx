import { motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { normalizeRole } from "../utils/auth";
import { useLanguage } from "../context/LanguageContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { totalItems } = useCart();
  const role = normalizeRole(user?.role || localStorage.getItem("role"));
  const { language, setLanguage, t } = useLanguage();

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (role !== "CUSTOMER") {
      navigate("/login");
      return;
    }
    navigate(`/customer?search=${encodeURIComponent(trimmed)}`);
  };

  const cta = (() => {
    if (role === "FARMER") {
      return { label: t("postCrop"), to: "/farmer" };
    }

    if (role === "CUSTOMER") {
      return { label: t("connectNow"), to: "/customer" };
    }

    return { label: t("connectNow"), to: "/register" };
  })();

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "nav-link-active" : ""}`;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <motion.nav
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="page-shell app-navbar-shell flex flex-wrap items-center gap-4 rounded-[1.9rem] border px-4 py-3 text-white shadow-xl"
        style={{
          borderColor: "rgba(255, 255, 255, 0.22)",
          background:
            "linear-gradient(135deg, rgba(21, 33, 26, 0.92), rgba(31, 95, 59, 0.9) 55%, rgba(120, 168, 95, 0.82))",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link
          to="/"
          className="app-navbar-brand flex items-center gap-3 text-xl font-semibold tracking-tight"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 19c5-7 11-9 16-10" />
              <path d="M6 19c3-4 6-6 10-7" />
              <path d="M8 19c2-2 4-3 6-3" />
            </svg>
          </span>
          <span>
            AgroConnect
            <span className="block text-xs font-normal uppercase tracking-[0.24em] text-white/62">
              {t("farmersOnly")}
            </span>
          </span>
        </Link>

        <div className="app-navbar-search flex-1 min-w-[220px]">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2"
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/55"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              aria-label={t("search")}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900"
            >
              {t("search")}
            </motion.button>
          </form>
        </div>

        <div className="app-navbar-links flex items-center gap-1">
          <NavLink to="/" className={linkClass}>
            {t("home")}
          </NavLink>
          {role === "CUSTOMER" && (
            <>
              <NavLink to="/customer" className={linkClass}>
                {t("marketplace")}
              </NavLink>
              <NavLink to="/customer/cart" className={linkClass}>
                {t("cart")} {totalItems > 0 ? `(${totalItems})` : ""}
              </NavLink>
              <NavLink to="/customer/orders" className={linkClass}>
                {t("orders")}
              </NavLink>
            </>
          )}
          {role === "FARMER" && (
            <>
              <NavLink to="/farmer" className={linkClass}>
                {t("dashboard")}
              </NavLink>
              <NavLink to="/farmer/orders" className={linkClass}>
                {t("orders")}
              </NavLink>
            </>
          )}
        </div>

        <div className="app-navbar-auth ml-auto flex items-center gap-2">
          <label className="sr-only" htmlFor="language-select">
            {t("language")}
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none"
            aria-label={t("language")}
          >
            <option value="en" className="text-slate-900">
              English
            </option>
            <option value="hi" className="text-slate-900">
              Hindi
            </option>
            <option value="te" className="text-slate-900">
              Telugu
            </option>
          </select>
          <Link
            to={cta.to}
            className="pressable inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-900 shadow-lg shadow-emerald-950/10"
          >
            {cta.label}
          </Link>
          {!role ? (
            <>
              <Link to="/login" className="btn-ghost text-white">
                {t("login")}
              </Link>
              <Link to="/register" className="btn-outline border-white/20 bg-white/10 text-white">
                {t("register")}
              </Link>
            </>
          ) : (
            <button onClick={logout} className="btn-ghost text-white">
              {t("logout")}
            </button>
          )}
        </div>
      </motion.nav>
    </header>
  );
}
