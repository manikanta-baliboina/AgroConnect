import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart, totalAmount } = useCart();

  const formatMoney = (value) =>
    `Rs ${Number(value || 0).toFixed(2)}`;

  return (
    <div className="page-shell py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Your Cart</h1>
          <p className="text-sm text-slate-500">
            Review items before checkout.
          </p>
        </div>
        {items.length > 0 && (
          <button onClick={clearCart} className="btn-ghost">
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-6 text-center text-slate-600">
          Your cart is empty.{" "}
          <button
            className="btn-primary mt-4"
            onClick={() => navigate("/customer")}
          >
            Browse Crops
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 flex gap-4">
                <div className="w-28 h-24 rounded-lg bg-slate-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {item.farm_name} Farm
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="btn-ghost text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="text-sm text-slate-600">
                      Price: Rs {item.price_per_kg} / kg
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500">Qty</label>
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(item.id, Number(e.target.value))
                        }
                        className="w-20 border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="ml-auto font-semibold text-slate-700">
                      {formatMoney(
                        Number(item.price_per_kg || 0) * item.qty
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-5 h-fit">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Order Summary
            </h3>
            <div className="text-sm text-slate-600 space-y-2">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between text-slate-800">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  {formatMoney(totalAmount)}
                </span>
              </div>
            </div>
            <button
              className="btn-primary w-full mt-4"
              onClick={() => navigate("/customer/checkout")}
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-slate-500 mt-2">
              You will add delivery address at checkout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
