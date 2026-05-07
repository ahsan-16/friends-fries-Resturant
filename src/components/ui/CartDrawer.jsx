import { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, Phone } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { restaurantInfo } from "../../data/menu";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function CartDrawer({ open, onClose }) {
  const { items, total, dispatch, placeOrder } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    type: "DELIVERY",
  });

  const handleOrder = async () => {
    if (!items.length) return;
    setLoading(true);
    try {
      await placeOrder({
        type: form.type,
        address: form.address,
        guestName: !user ? form.name : undefined,
        guestPhone: !user ? form.phone : undefined,
      });
      setShowForm(false);
      onClose();
    } catch (err) {
      toast.error(err.message || "Order failed", {
        style: { background: "#1A1A1A", color: "#fff", border: "1px solid #E8150A" },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[95] w-full max-w-sm bg-brand-gray border-l border-brand-muted flex flex-col shadow-2xl animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-muted">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-red" />
            <h2 className="font-heading font-bold text-white text-lg uppercase tracking-wide">
              Your Cart
            </h2>
            {items.length > 0 && (
              <span className="badge">
                {items.reduce((s, i) => s + i.qty, 0)} items
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => dispatch({ type: "CLEAR_CART" })}
                className="text-xs text-gray-500 hover:text-brand-red transition-colors font-body"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-brand-muted text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-heading font-bold text-white text-lg">
                Your cart is empty
              </p>
              <p className="text-gray-500 text-sm font-body mt-1">
                Add some delicious items!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.selectedVariant}`}
                className="flex items-center gap-3 bg-brand-muted rounded-xl p-3"
              >
                <div className="text-3xl">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-heading font-semibold truncate">
                    {item.name}
                  </p>
                  <p className="price-tag text-sm font-heading font-bold">
                    PKR {(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_QTY",
                        id: item.id,
                        selectedVariant: item.selectedVariant,
                        qty: item.qty - 1,
                      })
                    }
                    className="w-6 h-6 rounded-full bg-brand-gray flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-white font-heading font-bold text-sm w-4 text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_QTY",
                        id: item.id,
                        selectedVariant: item.selectedVariant,
                        qty: item.qty + 1,
                      })
                    }
                    className="w-6 h-6 rounded-full bg-brand-gray flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_ITEM",
                        id: item.id,
                        selectedVariant: item.selectedVariant,
                      })
                    }
                    className="ml-1 text-gray-500 hover:text-brand-red transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-brand-muted space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-body">Total</span>
              <span className="price-tag font-display text-2xl">
                PKR {total.toLocaleString()}
              </span>
            </div>

            {/* Order Form */}
            {showForm && (
              <div className="space-y-2">
                {/* Order Type Buttons */}
                <div className="flex gap-2">
                  {[
                    { value: "DELIVERY", label: "Delivery" },
                    { value: "DINE_IN", label: "Dine In" },
                    { value: "TAKEOUT", label: "Takeout" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-heading font-bold uppercase transition-all ${
                        form.type === t.value
                          ? "bg-brand-red text-white"
                          : "bg-brand-muted text-gray-400"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Guest fields if not logged in */}
                {!user && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-brand-muted border border-brand-muted rounded-lg px-3 py-2 text-white text-sm font-body placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-brand-muted border border-brand-muted rounded-lg px-3 py-2 text-white text-sm font-body placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                    />
                  </div>
                )}

                {form.type === "DELIVERY" && (
                  <input
                    type="text"
                    placeholder="Delivery Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-brand-muted border border-brand-muted rounded-lg px-3 py-2 text-white text-sm font-body placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                  />
                )}

                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-60"
                >
                  {loading ? "Placing Order..." : `Confirm — PKR ${total.toLocaleString()}`}
                </button>
              </div>
            )}

            {!showForm && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                >
                  Place Order
                </button>
                <a
                  href={`tel:${restaurantInfo.orderPhone}`}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-brand-muted text-gray-300 rounded-full font-heading font-bold uppercase tracking-wide text-sm hover:border-gray-500 hover:text-white transition-all"
                >
                  <Phone size={16} />
                  Call: {restaurantInfo.orderPhone}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}