import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RouteSkeleton } from "./components/LoadingSkeletons";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CustomerMarketplace = lazy(() => import("./pages/CustomerMarketplace"));
const CustomerOrders = lazy(() => import("./pages/CustomerOrders"));
const CropDetails = lazy(() => import("./pages/CropDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const FarmerDashboard = lazy(() => import("./pages/FarmerDashboard"));
const FarmerOrders = lazy(() => import("./pages/FarmerOrders"));

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-3">
        <Suspense fallback={<RouteSkeleton />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute role="CUSTOMER" />}>
                <Route path="/customer" element={<CustomerMarketplace />} />
                <Route path="/customer/crops/:id" element={<CropDetails />} />
                <Route path="/customer/cart" element={<Cart />} />
                <Route path="/customer/checkout" element={<Checkout />} />
                <Route path="/customer/orders" element={<CustomerOrders />} />
              </Route>

              <Route element={<ProtectedRoute role="FARMER" />}>
                <Route path="/farmer" element={<FarmerDashboard />} />
                <Route path="/farmer/orders" element={<FarmerOrders />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
