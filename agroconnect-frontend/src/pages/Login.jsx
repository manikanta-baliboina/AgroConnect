import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../utils/auth";
import PageTransition from "../components/PageTransition";
import { useLanguage } from "../context/LanguageContext";

const photoUrl =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    username: "",
    password: "",
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

    try {
      const res = await api.post("auth/login/", form);
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

      setError("Login succeeded, but role could not be determined.");
    } catch {
      setError("Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition className="page-shell py-8 md:py-10">
      <div className="grid overflow-hidden rounded-[2rem] border border-white/55 bg-white/70 shadow-2xl backdrop-blur-xl lg:grid-cols-[0.92fr_1.08fr]">
        <div className="hero-photo hidden min-h-[640px] rounded-none lg:block" style={{ backgroundImage: `url(${photoUrl})` }}>
          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
            <div className="badge w-fit bg-white/15 text-white">
              Grower to Buyer
            </div>
            <div className="space-y-3">
              <p className="text-4xl font-bold leading-tight">
                Sign in to manage harvests, orders, and trusted customer demand.
              </p>
              <p className="max-w-md text-sm leading-6 text-white/82">
                AgroConnect keeps crop discovery, order flow, and communication
                in one place so agricultural trade feels organized and reliable.
              </p>
            </div>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="flex min-h-[640px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-14"
        >
          <div className="eyebrow w-fit">{t("accountAccess")}</div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            {t("loginTitle")}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            {t("loginText")}
          </p>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-8 space-y-5">
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
                placeholder={t("enterUsername")}
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
                placeholder={t("enterPassword")}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.985 }}
            className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Logging in..." : t("login")}
          </motion.button>

          <p className="mt-6 text-sm text-slate-600">
            {t("newHere")}{" "}
            <Link to="/register" className="font-semibold text-emerald-800">
              {t("createAccount")}
            </Link>
          </p>
        </motion.form>
      </div>
    </PageTransition>
  );
}
