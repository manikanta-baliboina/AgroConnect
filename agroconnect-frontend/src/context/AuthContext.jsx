import { createContext, useContext, useEffect, useState } from "react";
import { normalizeRole } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = normalizeRole(localStorage.getItem("role"));

    if (storedRole) {
      setUser({ role: storedRole });
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    if (data?.access) {
      localStorage.setItem("access", data.access);
    }

    if (data?.refresh) {
      localStorage.setItem("refresh", data.refresh);
    }

    const role = normalizeRole(data?.role || localStorage.getItem("role"));

    if (role) {
      localStorage.setItem("role", role);
      setUser({ role });
      return;
    }

    localStorage.removeItem("role");
    setUser(null);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
