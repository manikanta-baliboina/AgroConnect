import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://agroconnect-oezp.onrender.com"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`, // ✅ trailing slash FIX
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
