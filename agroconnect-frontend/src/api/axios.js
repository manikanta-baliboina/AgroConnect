import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://agroconnect-oezp.onrender.com"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData && config.headers) {
    delete config.headers["Content-Type"];
  }

  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
