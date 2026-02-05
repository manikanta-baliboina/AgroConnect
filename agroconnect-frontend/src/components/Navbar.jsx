import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { totalItems } = useCart();

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (user?.role !== "CUSTOMER") {
      navigate("/login");
      return;
    }
    navigate(`/customer?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-lime-800 text-white shadow-lg sticky top-0 z-50">
      <div className="page-shell py-3 flex flex-wrap items-center gap-4">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 bg-white/15 rounded-full">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
              aria-hidden="true"
            >
              <path d="M4 19c5-7 11-9 16-10" />
              <path d="M6 19c3-4 6-6 10-7" />
              <path d="M8 19c2-2 4-3 6-3" />
            </svg>
          </span>
          AgroConnect
        </Link>

        <div className="flex-1 min-w-[220px]">
          <form
            onSubmit={handleSearch}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 flex items-center gap-2"
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search crops, farms"
              className="bg-transparent text-sm placeholder:text-white/60 text-white outline-none flex-1"
            />
            <button
              type="submit"
              className="text-xs bg-white/15 px-2 py-0.5 rounded-full"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className="nav-pill">
            Home
          </Link>
          {user?.role === "CUSTOMER" && (
            <>
              <Link to="/customer" className="nav-pill">
                Marketplace
              </Link>
              <Link to="/customer/cart" className="nav-pill relative">
                Cart
                {totalItems > 0 ? (
                  <span className="ml-2 text-xs bg-white text-emerald-900 px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                ) : null}
              </Link>
              <Link to="/customer/orders" className="nav-pill">
                Orders
              </Link>
            </>
          )}
          {user?.role === "FARMER" && (
            <>
              <Link to="/farmer" className="nav-pill">
                Dashboard
              </Link>
              <Link to="/farmer/orders" className="nav-pill">
                Orders
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {!user ? (
            <>
              <Link to="/login" className="btn-outline border-white/30 text-white">
                Login
              </Link>
              <Link to="/register" className="btn-primary bg-white text-emerald-900 hover:bg-white/90">
                Register
              </Link>
            </>
          ) : (
            <button onClick={logout} className="btn-outline border-white/30 text-white">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
