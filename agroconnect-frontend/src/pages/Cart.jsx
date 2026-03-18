import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PageTransition from "../components/PageTransition";
import { useLanguage } from "../context/LanguageContext";
import SmartImage from "../components/SmartImage";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart, totalAmount } = useCart();
  const { t } = useLanguage();

  const formatMoney = (value) => `Rs ${Number(value || 0).toFixed(2)}`;

  return (
    <PageTransition className="page-shell py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("yourCart")}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {t("cartText")}
          </p>
        </div>
        {items.length > 0 && (
          <button onClick={clearCart} className="btn-ghost">
            {t("clearCart")}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">
          <p>{t("emptyCart")}</p>
          <button className="btn-primary mt-4" onClick={() => navigate("/customer")}>
            {t("browseCrops")}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="card flex gap-4 p-4"
              >
                <div className="h-24 w-28 overflow-hidden rounded-[1.25rem] bg-slate-100">
                  {item.image ? (
                    <SmartImage
                      src={item.image}
                      alt={`${item.name} from ${item.farm_name} farm`}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
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
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="text-sm text-slate-600">
                      Price: Rs {item.price_per_kg} / kg
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.qty}
                        onChange={(e) => updateQty(item.id, Number(e.target.value))}
                        className="input w-24 px-3 py-2"
                      />
                    </div>
                    <div className="ml-auto font-semibold text-slate-800">
                      {formatMoney(Number(item.price_per_kg || 0) * item.qty)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="card-soft h-fit p-6">
            <h3 className="text-lg font-semibold text-slate-900">{t("orderSummary")}</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>{t("subtotal")}</span>
                <span>{formatMoney(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-900">
                <span>{t("delivery")}</span>
                <span>{t("free")}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-slate-800">
                <span className="font-semibold">{t("total")}</span>
                <span className="font-semibold">{formatMoney(totalAmount)}</span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.985 }}
              className="btn-primary mt-5 w-full"
              onClick={() => navigate("/customer/checkout")}
            >
              {t("proceedToCheckout")}
            </motion.button>
            <p className="mt-3 text-xs text-slate-500">
              Delivery address and payment details come next.
            </p>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
