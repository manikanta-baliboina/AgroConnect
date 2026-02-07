import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const detectRoleFromDashboards = async () => {
    try {
      await api.get("/customer/dashboard/");
      return "CUSTOMER";
    } catch {
      // Continue with farmer check.
    }

    try {
      await api.get("/farmer/dashboard/");
      return "FARMER";
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
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

      setError("Registration succeeded, but role could not be determined.");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-farmLight px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 rounded-2xl w-full max-w-lg"
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
          Join AgroConnect
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Create your account to start trading crops
        </p>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
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
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
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

        <div className="mt-4">
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            onChange={handleChange}
            className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-farmGreen outline-none"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Register as</label>
          <select
            name="role"
            onChange={handleChange}
            value={form.role}
            className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-farmGreen outline-none"
          >
            <option value="CUSTOMER">Customer (Buy Crops)</option>
            <option value="FARMER">Farmer (Sell Crops)</option>
          </select>
        </div>

        {form.role === "FARMER" && (
          <>
            <div className="mt-4">
              <label className="block text-sm font-medium">Farm Name</label>
              <input
                type="text"
                name="farm_name"
                onChange={handleChange}
                value={form.farm_name}
                className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-farmGreen outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                onChange={handleChange}
                value={form.location}
                className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-farmGreen outline-none"
              />
            </div>
          </>
        )}

        {form.role === "CUSTOMER" && (
          <div className="mt-4">
            <label className="block text-sm font-medium">Address</label>
            <textarea
              name="address"
              rows="2"
              onChange={handleChange}
              value={form.address}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-farmGreen outline-none"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-6 bg-farmGreen text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Create Account
        </button>

        <p className="text-sm text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-farmGreen font-semibold">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
