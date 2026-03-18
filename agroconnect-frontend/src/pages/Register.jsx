import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../utils/auth";
import PageTransition from "../components/PageTransition";
import { useLanguage } from "../context/LanguageContext";

const photoUrl =
  "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1400&q=80";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
    farm_name: "",
    location: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post("auth/register/", {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        farm_name: form.farm_name,
        location: form.location,
        address: form.address,
      });

      login(res.data);

      const role = normalizeRole(res.data?.role || localStorage.getItem("role"));

      if (role === "FARMER") {
        navigate("/farmer");
        return;
      }

      if (role === "CUSTOMER") {
        navigate("/customer");
        return;
      }

      setError("Registration succeeded, but role could not be determined.");
    } catch {
      setError("Registration failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition className="page-shell py-8 md:py-10">
      <div className="grid overflow-hidden rounded-[2rem] border border-white/55 bg-white/70 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.02fr_0.98fr]">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="flex min-h-[680px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-14"
        >
          <div className="eyebrow w-fit">{t("startTrading")}</div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            {t("registerTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {t("registerText")}
          </p>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("username")}
              </label>
              <input
                type="text"
                name="username"
                required
                onChange={handleChange}
                className="input"
                value={form.username}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("email")}
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="input"
                value={form.email}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("password")}
              </label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="input"
                value={form.password}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("confirmPassword")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                onChange={handleChange}
                className="input"
                value={form.confirmPassword}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t("registerAs")}
              </label>
              <select
                name="role"
                onChange={handleChange}
                value={form.role}
                className="input"
              >
                <option value="CUSTOMER">{t("customerRole")}</option>
                <option value="FARMER">{t("farmerRole")}</option>
              </select>
            </div>

            {form.role === "FARMER" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {t("farmName")}
                  </label>
                  <input
                    type="text"
                    name="farm_name"
                    onChange={handleChange}
                    value={form.farm_name}
                    className="input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {t("location")}
                  </label>
                  <input
                    type="text"
                    name="location"
                    onChange={handleChange}
                    value={form.location}
                    className="input"
                  />
                </div>
              </>
            )}

            {form.role === "CUSTOMER" && (
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("address")}
                </label>
                <textarea
                  name="address"
                  rows="3"
                  onChange={handleChange}
                  value={form.address}
                  className="input resize-none"
                />
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.985 }}
            className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account..." : t("createAccount")}
          </motion.button>

          <p className="mt-6 text-sm text-slate-600">
            {t("alreadyHaveAccount")}{" "}
            <Link to="/login" className="font-semibold text-emerald-800">
              {t("login")}
            </Link>
          </p>
        </motion.form>

        <div className="hero-photo hidden rounded-none lg:block" style={{ backgroundImage: `url(${photoUrl})` }}>
          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
            <div className="badge w-fit bg-white/15 text-white">
              Field-ready commerce
            </div>
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Verified listings", "Fresh produce with real farm context"],
                  ["Flexible roles", "Built for both sellers and buyers"],
                  ["Clear orders", "Simple path from listing to delivery"],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-white/76">{copy}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-4xl font-bold leading-tight">
                  A cleaner first impression for agricultural trade.
                </p>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/82">
                  Better branding, better structure, and quicker actions help
                  farmers and customers trust the platform faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
