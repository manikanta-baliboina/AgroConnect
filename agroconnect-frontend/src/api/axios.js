import axios from "axios";

const envBase =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const apiBase =
  envBase ||
  (import.meta.env.MODE === "production"
    ? "https://agroconnect-oezp.onrender.com/api"
    : "http://127.0.0.1:8000/api");

const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
