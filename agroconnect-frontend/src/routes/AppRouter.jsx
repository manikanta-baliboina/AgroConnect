import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CustomerMarketplace from "../pages/CustomerMarketplace";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute role="CUSTOMER" />}>
          <Route path="/customer" element={<CustomerMarketplace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function AppRouter() {
  return (
    <>
      <Navbar/>
      <AnimatedRoutes />
    </>
  );
}
