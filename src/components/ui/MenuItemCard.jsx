import { useState } from "react";
import { X, ShoppingCart, Star, Plus, Minus, ChevronDown } from "lucide-react";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

// ─────────────────────────────────────────
// Item Detail Modal
// ─────────────────────────────────────────
export function ItemModal({ item, onClose }) {
  const { dispatch } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants ? item.variants[0].label : null
  );

  const currentPrice = item.variants
    ? item.variants.find((v) => v.label === selectedVariant)?.price ?? item.price
    : item.price;

  const handleAdd = () => {
    dispatch({
      type: "ADD_ITEM",
      item: {
        id: item.id,
        name: item.name + (selectedVariant ? ` (${selectedVariant})` : ""),
        price: currentPrice,
        emoji: item.emoji,
        category: item.category,
        selectedVariant,
        qty,
      },
    });
    // Add qty times
    for (let i = 1; i < qty; i++) {
      dispatch({
        type: "ADD_ITEM",
        item: {
          id: item.id,
          name: item.name + (selectedVariant ? ` (${selectedVariant})` : ""),
          price: currentPrice,
          emoji: item.emoji,
          category: item.category,
          selectedVariant,
          qty: 1,
        },
      });
    }
    toast.success(`${item.name} added to cart!`, {
      style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
      iconTheme: { primary: "#E8150A", secondary: "#fff" },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 modal-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-brand-gray rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-brand-muted animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-brand-muted p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-brand-gray text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="text-5xl mb-3">{item.emoji}</div>
          <div className="flex items-start justify-between gap-4">
            <div>
              {item.badge && (
                <span className="badge text-xs mb-2 inline-block">{item.badge}</span>
              )}
              <h2 className="font-heading font-bold text-xl text-white">{item.name}</h2>
            </div>
            <div className="text-right shrink-0">
              <div className="price-tag text-2xl font-display">PKR {currentPrice.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-gray-400 text-sm font-body leading-relaxed">{item.description}</p>

          {/* Variants */}
          {item.variants && (
            <div>
              <label className="text-white font-heading font-bold text-sm uppercase tracking-wider mb-2 block">
                Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => setSelectedVariant(v.label)}
                    className={`px-3 py-2 rounded-lg text-sm font-heading font-semibold transition-all border ${
                      selectedVariant === v.label
                        ? "bg-brand-red border-brand-red text-white"
                        : "border-brand-muted text-gray-400 hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    {v.label}
                    <span className="block text-xs font-body opacity-80">PKR {v.price.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deal items list */}
          {item.items && (
            <div>
              <label className="text-white font-heading font-bold text-sm uppercase tracking-wider mb-2 block">
                Includes
              </label>
              <ul className="space-y-1">
                {item.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300 font-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {item.tags && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-brand-muted text-gray-400 rounded-full font-body capitalize">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-brand-muted rounded-full px-3 py-2">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="font-heading font-bold text-white w-5 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add to Cart — PKR {(currentPrice * qty).toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Menu Item Card
// ─────────────────────────────────────────
export default function MenuItemCard({ item }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { dispatch } = useCart();

  const quickAdd = (e) => {
    e.stopPropagation();
    dispatch({
      type: "ADD_ITEM",
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
        emoji: item.emoji,
        category: item.category,
        selectedVariant: item.variants ? item.variants[0].label : null,
        qty: 1,
      },
    });
    toast.success(`${item.name} added!`, {
      style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
      iconTheme: { primary: "#E8150A", secondary: "#fff" },
    });
  };

  return (
    <>
      <div
        className="card-dark group cursor-pointer hover:border-brand-red/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/10 hover:-translate-y-1"
        onClick={() => setModalOpen(true)}
      >
        <div className="p-4">
          {/* Emoji + badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="text-4xl">{item.emoji}</div>
            {item.badge && <span className="badge text-xs">{item.badge}</span>}
          </div>

          {/* Info */}
          <h3 className="font-heading font-bold text-white text-base leading-tight mb-1">{item.name}</h3>
          <p className="text-gray-500 text-xs font-body line-clamp-2 mb-3">{item.description}</p>

          {/* Price + Add */}
          <div className="flex items-center justify-between">
            <div>
              <div className="price-tag font-heading font-bold text-lg">PKR {item.price.toLocaleString()}</div>
              {item.variants && (
                <div className="text-gray-500 text-xs font-body">From</div>
              )}
            </div>
            <button
              onClick={quickAdd}
              className="p-2 bg-brand-red rounded-full text-white hover:bg-red-600 transition-all hover:scale-110 active:scale-95 shadow-lg"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && <ItemModal item={item} onClose={() => setModalOpen(false)} />}
    </>
  );
}
