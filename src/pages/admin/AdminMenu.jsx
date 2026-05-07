import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import api from "../../config/api";
import toast from "react-hot-toast";

const categories = ["BURGERS","PIZZA","SHAWARMA","FRIES","DRINKS","DEALS"];

const emptyForm = {
  name: "", description: "", category: "BURGERS",
  price: "", emoji: "🍔", badge: "", tags: "",
  isAvailable: true, isFeatured: false,
  offerPercent: "", offerLabel: "",
};

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const fetchItems = () => {
    setLoading(true);
    const url = activeCategory === "ALL" ? "/menu?limit=100" : `/menu?category=${activeCategory}&limit=100`;
    api(url).then((data) => {
      if (data.success) setItems(data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, [activeCategory]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      emoji: item.emoji || "🍔",
      badge: item.badge || "",
      tags: item.tags?.join(", ") || "",
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      offerPercent: item.offerPercent || "",
      offerLabel: item.offerLabel || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        price: parseFloat(form.price),
        offerPercent: form.offerPercent ? parseInt(form.offerPercent) : null,
      };

      const data = editing
        ? await api(`/menu/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) })
        : await api("/menu", { method: "POST", body: JSON.stringify(payload) });

      if (!data.success) throw new Error(data.message);

      toast.success(editing ? "Item updated!" : "Item created!", {
        style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
      });
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    const data = await api(`/menu/${id}`, { method: "DELETE" });
    if (data.success) {
      setItems(items.filter((i) => i.id !== id));
      toast.success("Item deleted");
    }
  };

  const handleToggle = async (id) => {
    const data = await api(`/menu/${id}/toggle`, { method: "PATCH" });
    if (data.success) {
      setItems(items.map((i) => i.id === id ? { ...i, isAvailable: data.data.isAvailable } : i));
      toast.success(data.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl text-white">MENU</h1>
          <p className="text-gray-500 font-body mt-1">{items.length} items</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {["ALL", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wide transition-all border ${
              activeCategory === c
                ? "bg-brand-red border-brand-red text-white"
                : "border-brand-muted text-gray-400 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-4xl animate-bounce">⏳</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className={`card-dark p-4 ${!item.isAvailable ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <p className="text-white font-heading font-bold text-sm">{item.name}</p>
                    <p className="text-gray-500 text-xs font-body">{item.category}</p>
                  </div>
                </div>
                {item.badge && <span className="badge text-xs">{item.badge}</span>}
              </div>

              <p className="text-gray-500 text-xs font-body line-clamp-2 mb-3">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="price-tag font-display text-xl">
                    PKR {Number(item.price).toLocaleString()}
                  </span>
                  {item.offerPercent && (
                    <span className="ml-2 text-xs text-green-400 font-heading font-bold">
                      -{item.offerPercent}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                    title={item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                  >
                    {item.isAvailable
                      ? <ToggleRight size={20} className="text-green-400" />
                      : <ToggleLeft size={20} />
                    }
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 bg-brand-muted rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-brand-muted rounded-lg text-gray-400 hover:text-brand-red transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-brand-gray border border-brand-muted rounded-2xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-brand-muted flex items-center justify-between">
              <h2 className="font-heading font-bold text-white text-lg">
                {editing ? "Edit Item" : "Add New Item"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Name + Emoji */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Emoji"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="w-16 bg-brand-muted border border-brand-muted rounded-xl px-3 py-2.5 text-white text-center font-body focus:outline-none focus:border-brand-red"
                />
                <input
                  type="text"
                  placeholder="Item Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="flex-1 bg-brand-muted border border-brand-muted rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* Description */}
              <textarea
                placeholder="Description *"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full bg-brand-muted border border-brand-muted rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red resize-none"
              />

              {/* Category + Price */}
              <div className="flex gap-3">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex-1 bg-brand-muted border border-brand-muted rounded-xl px-3 py-2.5 text-white font-body text-sm focus:outline-none focus:border-brand-red"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Price (PKR) *"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="flex-1 bg-brand-muted border border-brand-muted rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* Badge + Tags */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Badge (e.g. New)"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="flex-1 bg-brand-muted border border-brand-muted rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                />
                <input
                  type="text"
                  placeholder="Tags (spicy, crispy)"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="flex-1 bg-brand-muted border border-brand-muted rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* Offer */}
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Offer % (e.g. 10)"
                  value={form.offerPercent}
                  onChange={(e) => setForm({ ...form, offerPercent: e.target.value })}
                  className="flex-1 bg-brand-muted border border-brand-muted rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                />
                <input
                  type="text"
                  placeholder="Offer Label (e.g. Eid Special)"
                  value={form.offerLabel}
                  onChange={(e) => setForm({ ...form, offerLabel: e.target.value })}
                  className="flex-1 bg-brand-muted border border-brand-muted rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-brand-red"
                  />
                  <span className="text-gray-300 text-sm font-body">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-brand-red"
                  />
                  <span className="text-gray-300 text-sm font-body">Featured</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-brand-muted flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 bg-brand-muted text-gray-300 rounded-xl font-heading font-bold uppercase tracking-wide hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 btn-primary py-2.5 disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}