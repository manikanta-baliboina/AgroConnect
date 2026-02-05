import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerMarketplace from "./pages/CustomerMarketplace";
import CustomerOrders from "./pages/CustomerOrders";
import CropDetails from "./pages/CropDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FarmerDashboard from "./pages/FarmerDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import FarmerOrders from "./pages/FarmerOrders";
import Footer from "./components/Footer";


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        {/* CUSTOMER */}
        <Route element={<ProtectedRoute role="CUSTOMER" />}>
          <Route path="/customer" element={<CustomerMarketplace />} />
          <Route path="/customer/crops/:id" element={<CropDetails />} />
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/checkout" element={<Checkout />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />
        </Route>

          {/* FARMER */}
          <Route element={<ProtectedRoute role="FARMER" />}>
            <Route path="/farmer" element={<FarmerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute role="FARMER" />}>
            <Route path="/farmer/orders" element={<FarmerOrders />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
