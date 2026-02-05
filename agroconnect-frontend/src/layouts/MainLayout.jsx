import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FarmerDashboard from "../pages/FarmerDashboard";
import CustomerDashboard from "../pages/CustomerDashboard";
export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* Navbar ALWAYS visible */}
      <Navbar />

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
