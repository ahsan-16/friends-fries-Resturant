import { useState, useEffect } from "react";
import { Eye, RefreshCw } from "lucide-react";
import api from "../../config/api";
import toast from "react-hot-toast";

const statusColors = {
  PENDING:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PREPARING: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  READY:     "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

const allStatuses = ["PENDING","CONFIRMED","PREPARING","READY","DELIVERED","CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const url = filter === "ALL" ? "/orders" : `/orders?status=${filter}`;
    api(url).then((data) => {
      if (data.success) setOrders(data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const data = await api(`/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      if (data.success) {
        setOrders(orders.map((o) => o.id === orderId ? { ...o, status } : o));
        if (selected?.id === orderId) setSelected({ ...selected, status });
        toast.success(`Order marked as ${status}`, {
          style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
        });
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl text-white">ORDERS</h1>
          <p className="text-gray-500 font-body mt-1">{orders.length} orders found</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 btn-outline text-sm px-4 py-2"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["ALL", ...allStatuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wide transition-all border ${
              filter === s
                ? "bg-brand-red border-brand-red text-white"
                : "border-brand-muted text-gray-400 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-4xl animate-bounce">⏳</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 card-dark">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500 font-body">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="card-dark p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-red/20 flex items-center justify-center shrink-0">
                    <span className="font-display text-brand-red text-lg">
                      #{orders.indexOf(order) + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-heading font-bold">
                      {order.user?.name || order.guestName || "Guest"}
                    </p>
                    <p className="text-gray-500 text-xs font-body">
                      {order.user?.phone || order.guestPhone || "No phone"} ·{" "}
                      {order.type} · {order.items?.length} items
                    </p>
                    <p className="text-gray-600 text-xs font-body">
                      {new Date(order.createdAt).toLocaleString("en-PK")}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="price-tag font-display text-xl">
                    PKR {Number(order.total).toLocaleString()}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full border font-heading font-bold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => setSelected(order)}
                    className="p-2 bg-brand-muted rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-brand-gray border border-brand-muted rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-brand-muted flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-white text-lg">Order Details</h2>
                <p className="text-gray-500 text-xs font-body mt-0.5">
                  {new Date(selected.createdAt).toLocaleString("en-PK")}
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border font-heading font-bold ${statusColors[selected.status]}`}>
                {selected.status}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
              {/* Customer Info */}
              <div className="bg-brand-muted rounded-xl p-4">
                <p className="text-gray-400 text-xs font-heading uppercase tracking-wider mb-2">
                  Customer
                </p>
                <p className="text-white font-heading font-bold">
                  {selected.user?.name || selected.guestName || "Guest"}
                </p>
                <p className="text-gray-500 text-sm font-body">
                  {selected.user?.phone || selected.guestPhone || "No phone"}
                </p>
                {selected.address && (
                  <p className="text-gray-500 text-sm font-body">
                    📍 {selected.address}
                  </p>
                )}
                <p className="text-gray-500 text-sm font-body">
                  Type: {selected.type}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="text-gray-400 text-xs font-heading uppercase tracking-wider mb-2">
                  Items
                </p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-300 font-body">
                        {item.name}
                        {item.variant && (
                          <span className="text-gray-500"> ({item.variant})</span>
                        )}
                        <span className="text-gray-500"> x{item.qty}</span>
                      </span>
                      <span className="price-tag font-heading font-bold">
                        PKR {Number(item.subtotal).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-muted mt-3 pt-3 flex justify-between">
                  <span className="text-white font-heading font-bold">Total</span>
                  <span className="price-tag font-display text-xl">
                    PKR {Number(selected.total).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <p className="text-gray-400 text-xs font-heading uppercase tracking-wider mb-2">
                  Update Status
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {allStatuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={selected.status === s || updating === selected.id}
                      className={`py-2 px-3 rounded-xl text-xs font-heading font-bold uppercase transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
                        selected.status === s
                          ? statusColors[s]
                          : "border-brand-muted text-gray-400 hover:text-white hover:border-gray-500"
                      }`}
                    >
                      {s === "PENDING" && "⏳"}
                      {s === "CONFIRMED" && "✅"}
                      {s === "PREPARING" && "👨‍🍳"}
                      {s === "READY" && "🔔"}
                      {s === "DELIVERED" && "🎉"}
                      {s === "CANCELLED" && "❌"}
                      <span className="block text-[10px] mt-0.5">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-brand-muted">
              <button
                onClick={() => setSelected(null)}
                className="w-full py-2.5 bg-brand-muted text-gray-300 rounded-xl font-heading font-bold uppercase tracking-wide hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}