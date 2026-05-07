import { useState, useEffect } from "react";
import { ReviewCard } from "../components/sections/ReviewsSection";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import toast from "react-hot-toast";

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ text: "", rating: 5, food: 5, service: 5, atmosphere: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    api("/reviews").then((data) => {
      if (data.success) setReviews(data.data);
    }).finally(() => setLoading(false));
  }, []);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    setSubmitting(true);
    try {
      const data = await api("/reviews", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!data.success) throw new Error(data.message);
      toast.success("Review submitted! Pending approval 🙏", {
        style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
      });
      setForm({ text: "", rating: 5, food: 5, service: 5, atmosphere: 5 });
    } catch (err) {
      toast.error(err.message, {
        style: { background: "#1A1A1A", color: "#fff", border: "1px solid #E8150A" },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-20">
      <div className="relative py-16 px-4 bg-gradient-to-b from-brand-gray/50 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-brand-red font-heading font-bold uppercase tracking-widest text-sm mb-2">
            Customer Feedback
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-white">REVIEWS</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={20} className="text-brand-yellow fill-brand-yellow" />
              ))}
            </div>
            <span className="font-display text-4xl text-white">{avg}</span>
            <span className="text-gray-500 font-body">/ 5 · {reviews.length} reviews</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Write Review */}
        <div className="card-dark p-6 mb-12 max-w-2xl mx-auto">
          <h2 className="font-heading font-bold text-white text-xl uppercase tracking-wide mb-4">
            {user ? "Share Your Experience" : "Sign In to Write a Review"}
          </h2>
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Main Rating */}
              <div>
                <label className="text-gray-400 text-sm font-body block mb-2">
                  Overall Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({ ...form, rating: i })}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          i <= (hover || form.rating)
                            ? "text-brand-yellow fill-brand-yellow"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub Ratings */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "food", label: "Food" },
                  { key: "service", label: "Service" },
                  { key: "atmosphere", label: "Vibe" },
                ].map((r) => (
                  <div key={r.key}>
                    <label className="text-gray-400 text-xs font-body block mb-1">
                      {r.label}
                    </label>
                    <select
                      value={form[r.key]}
                      onChange={(e) =>
                        setForm({ ...form, [r.key]: parseInt(e.target.value) })
                      }
                      className="w-full bg-brand-muted border border-brand-muted rounded-lg px-2 py-1.5 text-white text-sm font-body focus:outline-none focus:border-brand-red"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}/5
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-gray-400 text-sm font-body block mb-2">
                  Your Review
                </label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Tell others about your experience..."
                  rows={4}
                  className="w-full bg-brand-muted border border-brand-muted rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className="text-gray-500 font-body">
              Please{" "}
              <span className="text-brand-yellow">sign in</span> to share your
              experience.
            </p>
          )}
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-gray-500 font-body">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-500 font-body">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={{
                ...r,
                name: r.user?.name || r.name,
                role: "Verified Customer",
                date: new Date(r.createdAt).toLocaleDateString("en-PK", {
                  year: "numeric", month: "short", day: "numeric"
                }),
              }} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}