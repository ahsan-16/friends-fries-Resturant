import { useState } from "react";
import { reviews as initialReviews } from "../data/menu";
import { ReviewCard } from "../components/sections/ReviewsSection";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ReviewsPage() {
  const { user } = useAuth();
  const [allReviews, setAllReviews] = useState(initialReviews);
  const [form, setForm] = useState({ text: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [hover, setHover] = useState(0);

  const avg = (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        name: user.name,
        role: "Verified Customer",
        rating: form.rating,
        date: "Just now",
        text: form.text,
        food: form.rating,
        service: form.rating,
        atmosphere: Math.max(3, form.rating - 1),
      };
      setAllReviews([newReview, ...allReviews]);
      setForm({ text: "", rating: 5 });
      setSubmitting(false);
      toast.success("Review posted! Thank you 🙏", {
        style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
      });
    }, 600);
  };

  return (
    <main className="min-h-screen pt-20">
      <div className="relative py-16 px-4 bg-gradient-to-b from-brand-gray/50 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-brand-red font-heading font-bold uppercase tracking-widest text-sm mb-2">Customer Feedback</p>
          <h1 className="font-display text-6xl md:text-8xl text-white">REVIEWS</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-brand-yellow fill-brand-yellow" />)}
            </div>
            <span className="font-display text-4xl text-white">{avg}</span>
            <span className="text-gray-500 font-body">/ 5 · {allReviews.length} reviews</span>
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
              {/* Star Picker */}
              <div>
                <label className="text-gray-400 text-sm font-body block mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => (
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
                        className={`transition-colors ${i <= (hover || form.rating) ? "text-brand-yellow fill-brand-yellow" : "text-gray-600"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-body block mb-2">Your Review</label>
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
                {submitting ? "Posting..." : "Post Review"}
              </button>
            </form>
          ) : (
            <p className="text-gray-500 font-body">
              Please <span className="text-brand-yellow">sign in</span> to share your experience with others.
            </p>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </main>
  );
}
