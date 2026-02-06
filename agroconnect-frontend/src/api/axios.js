import axios from "axios";

const apiBase =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    console.log("AXIOS TOKEN:", token); // 🔥 MUST PRINT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
