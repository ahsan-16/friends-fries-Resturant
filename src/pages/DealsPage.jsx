import { useState, useEffect } from "react";
import { ShoppingCart, CheckCircle, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ItemModal } from "../components/ui/MenuItemCard";
import api from "../config/api";
import toast from "react-hot-toast";

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { dispatch } = useCart();

  useEffect(() => {
    api("/menu/deals").then((data) => {
      if (data.success) setDeals(data.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 bg-gradient-to-b from-brand-red/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-6xl mb-4">🔥</div>
          <p className="text-brand-red font-heading font-bold uppercase tracking-widest text-sm mb-2">
            Best Value
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-white">HOT DEALS</h1>
          <p className="text-gray-500 font-body mt-2">
            {deals.length} amazing combos at unbeatable prices
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⏳</div>
            <p className="font-heading font-bold text-white text-xl">Loading deals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, i) => (
              <div
                key={deal.id}
                className="card-dark overflow-hidden hover:border-brand-yellow/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-yellow/10 cursor-pointer group"
                onClick={() => setSelected(deal)}
              >
                {/* Top banner */}
                <div className="bg-gradient-to-r from-brand-red to-red-700 p-4 flex items-center justify-between">
                  <div>
                    <span className="text-white/60 font-heading text-xs uppercase tracking-widest">
                      Deal
                    </span>
                    <div className="font-display text-4xl text-white leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-xs font-body">From only</div>
                    <div className="font-display text-3xl text-brand-yellow">
                      PKR {Number(deal.price).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-brand-yellow" />
                    <h3 className="font-heading font-bold text-white text-lg">
                      {deal.name}
                    </h3>
                  </div>

                  {/* Items list */}
                  <ul className="space-y-1.5 mb-5">
                    {deal.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-sm text-gray-300 font-body"
                      >
                        <CheckCircle size={14} className="text-brand-red shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-brand-muted">
                    <div>
                      <div className="price-tag font-display text-2xl">
                        PKR {Number(deal.price).toLocaleString()}
                      </div>
                      {deal.badge && (
                        <span className="badge text-xs mt-1 inline-block">
                          {deal.badge}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({
                          type: "ADD_ITEM",
                          item: {
                            id: deal.id,
                            name: deal.name,
                            price: Number(deal.price),
                            emoji: deal.emoji || "🔥",
                            category: "deals",
                            selectedVariant: null,
                            qty: 1,
                          },
                        });
                        toast.success(`${deal.name} added to cart!`, {
                          style: {
                            background: "#1A1A1A",
                            color: "#fff",
                            border: "1px solid #2A2A2A",
                          },
                          iconTheme: { primary: "#FFD600", secondary: "#000" },
                        });
                      }}
                      className="flex items-center gap-2 bg-brand-yellow text-black font-heading font-bold uppercase tracking-wide px-4 py-2 rounded-full hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95"
                    >
                      <ShoppingCart size={16} />
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ItemModal
          item={{
            ...selected,
            price: Number(selected.price),
            emoji: selected.emoji || "🔥",
            category: "deals",
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}