import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../utils/auth";

export default function ProtectedRoute({ children, role, allowedRole }) {
  const { user, loading } = useAuth();
  const requiredRole = normalizeRole(role || allowedRole);
  const userRole = normalizeRole(user?.role || localStorage.getItem("role"));

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}
