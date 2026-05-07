import { useState, useEffect } from "react";
import { CheckCircle, Trash2, Star } from "lucide-react";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchReviews = () => {
    setLoading(true);
    const url =
      filter === "ALL"
        ? "/reviews/all"
        : filter === "APPROVED"
        ? "/reviews/all?approved=true"
        : "/reviews/all?approved=false";
    api(url)
      .then((data) => {
        if (data.success) setReviews(data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const handleApprove = async (id) => {
    const data = await api(`/reviews/${id}/approve`, { method: "PUT" });
    if (data.success) {
      setReviews(reviews.map((r) => r.id === id ? { ...r, isApproved: true } : r));
      toast.success("Review approved!", {
        style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    const data = await api(`/reviews/${id}`, { method: "DELETE" });
    if (data.success) {
      setReviews(reviews.filter((r) => r.id !== id));
      toast.success("Review deleted");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-5xl text-white">REVIEWS</h1>
        <p className="text-gray-500 font-body mt-1">{reviews.length} reviews</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["ALL", "PENDING", "APPROVED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wide transition-all border ${
              filter === f
                ? "bg-brand-red border-brand-red text-white"
                : "border-brand-muted text-gray-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-4xl animate-bounce">⏳</div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 card-dark">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-gray-500 font-body">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card-dark p-5">
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center font-display text-white text-lg shrink-0">
                    {review.user?.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-heading font-bold text-sm">
                        {review.user?.name || "Unknown"}
                      </p>
                      <p className="text-gray-500 text-xs font-body">
                        {review.user?.email}
                      </p>
                      {review.isApproved ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-heading font-bold">
                          Approved
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-heading font-bold">
                          Pending
                        </span>
                      )}
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i <= review.rating
                              ? "text-brand-yellow fill-brand-yellow"
                              : "text-gray-600"
                          }
                        />
                      ))}
                      <span className="text-gray-500 text-xs font-body ml-1">
                        Food: {review.food}/5 · Service: {review.service}/5 · Vibe: {review.atmosphere}/5
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm font-body">{review.text}</p>

                    <p className="text-gray-600 text-xs font-body mt-2">
                      {new Date(review.createdAt).toLocaleString("en-PK")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-xs font-heading font-bold hover:bg-green-500/30 transition-all"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-heading font-bold hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}