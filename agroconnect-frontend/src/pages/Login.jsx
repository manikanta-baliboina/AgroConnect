import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../utils/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const detectRoleFromDashboards = async () => {
    try {
      await api.get("auth/customer/dashboard/");
      return "CUSTOMER";
    } catch {
      // Continue with farmer check.
    }

    try {
      await api.get("auth/farmer/dashboard/");
      return "FARMER";
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("auth/login/", form);

      // Store tokens first so role fallback checks can use authenticated requests.
      login(res.data);

      let role = normalizeRole(res.data?.role || localStorage.getItem("role"));
      if (!role) {
        role = await detectRoleFromDashboards();
        if (role) {
          login({ role });
        }
      }

      if (role === "FARMER") {
        navigate("/farmer");
        return;
      }

      if (role === "CUSTOMER") {
        navigate("/customer");
        return;
      }

      setError("Login succeeded, but role could not be determined.");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-farmLight px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-farmGreen text-center flex items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 bg-farmGreen/10 rounded-full">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-farmGreen"
              aria-hidden="true"
            >
              <path d="M4 19c5-7 11-9 16-10" />
              <path d="M6 19c3-4 6-6 10-7" />
              <path d="M8 19c2-2 4-3 6-3" />
            </svg>
          </span>
          Login to AgroConnect
        </h2>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            required
            onChange={handleChange}
            className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-farmGreen outline-none"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            onChange={handleChange}
            className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-farmGreen outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-farmGreen text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Login
        </button>

        <p className="text-sm text-center mt-5">
          New here?{" "}
          <Link to="/register" className="text-farmGreen font-semibold">
            Create account
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
