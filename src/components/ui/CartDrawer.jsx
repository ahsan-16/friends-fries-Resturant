import { X, Trash2, Plus, Minus, ShoppingBag, Phone } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { restaurantInfo } from "../../data/menu";
import toast from "react-hot-toast";

export default function CartDrawer({ open, onClose }) {
  const { items, total, dispatch } = useCart();

  const handleOrder = () => {
    if (!items.length) return;
    const msg = items
      .map((i) => `• ${i.name} x${i.qty} — PKR ${(i.price * i.qty).toLocaleString()}`)
      .join("\n");
    const fullMsg = `🍟 *Friends Fries Order*\n\n${msg}\n\n*Total: PKR ${total.toLocaleString()}*`;
    const url = `https://wa.me/92${restaurantInfo.orderPhone.replace(/^0/, "")}?text=${encodeURIComponent(fullMsg)}`;
    window.open(url, "_blank");
    toast.success("Order sent via WhatsApp!", {
      style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[95] w-full max-w-sm bg-brand-gray border-l border-brand-muted flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-muted">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-red" />
            <h2 className="font-heading font-bold text-white text-lg uppercase tracking-wide">Your Cart</h2>
            {items.length > 0 && (
              <span className="badge">{items.reduce((s, i) => s + i.qty, 0)} items</span>
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
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-brand-muted text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-heading font-bold text-white text-lg">Your cart is empty</p>
              <p className="text-gray-500 text-sm font-body mt-1">Add some delicious items from the menu!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.selectedVariant}`} className="flex items-center gap-3 bg-brand-muted rounded-xl p-3">
                <div className="text-3xl">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-heading font-semibold truncate">{item.name}</p>
                  <p className="price-tag text-sm font-heading font-bold">PKR {(item.price * item.qty).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, selectedVariant: item.selectedVariant, qty: item.qty - 1 })}
                    className="w-6 h-6 rounded-full bg-brand-gray flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-white font-heading font-bold text-sm w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, selectedVariant: item.selectedVariant, qty: item.qty + 1 })}
                    className="w-6 h-6 rounded-full bg-brand-gray flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id, selectedVariant: item.selectedVariant })}
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
              <span className="text-gray-400 font-body">Subtotal</span>
              <span className="price-tag font-display text-2xl">PKR {total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleOrder}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4"
            >
              <Phone size={18} />
              Order via WhatsApp
            </button>
            <a
              href={`tel:${restaurantInfo.orderPhone}`}
              className="w-full flex items-center justify-center gap-2 py-3 border border-brand-muted text-gray-300 rounded-full font-heading font-bold uppercase tracking-wide text-sm hover:border-gray-500 hover:text-white transition-all"
            >
              📞 Call to Order: {restaurantInfo.orderPhone}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
