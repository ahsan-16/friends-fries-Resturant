import { useState, useEffect } from "react";
import MenuItemCard from "../components/ui/MenuItemCard";
import { Search } from "lucide-react";
import api from "../config/api";

export default function MenuPage({ title, subtitle, emoji, category, tags }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  useEffect(() => {
    setLoading(true);
    api(`/menu?category=${category}`).then((data) => {
      if (data.success) setItems(data.data);
    }).finally(() => setLoading(false));
  }, [category]);

  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchTag =
      activeTag === "all" ||
      (item.tags && item.tags.includes(activeTag));
    return matchSearch && matchTag;
  });

  return (
    <main className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 bg-gradient-to-b from-brand-gray to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,21,10,0.1),transparent_60%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-4">{emoji}</div>
          <p className="text-brand-red font-heading font-bold uppercase tracking-widest text-sm mb-2">
            {subtitle}
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-white">{title}</h1>
          <p className="text-gray-500 font-body mt-2">
            {filtered.length} items available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full bg-brand-gray border border-brand-muted rounded-xl pl-9 pr-4 py-3 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag("all")}
                className={`px-4 py-2 rounded-full text-sm font-heading font-bold uppercase tracking-wide transition-all ${
                  activeTag === "all"
                    ? "bg-brand-red text-white"
                    : "bg-brand-gray border border-brand-muted text-gray-400 hover:text-white"
                }`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-heading font-bold uppercase tracking-wide transition-all capitalize ${
                    activeTag === tag
                      ? "bg-brand-red text-white"
                      : "bg-brand-gray border border-brand-muted text-gray-400 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⏳</div>
            <p className="font-heading font-bold text-white text-xl">Loading...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-heading font-bold text-white text-xl">No items found</p>
            <p className="text-gray-500 text-sm font-body mt-1">
              Try a different search
            </p>
          </div>
        )}
      </div>
    </main>
  );
}