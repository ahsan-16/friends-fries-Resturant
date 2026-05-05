import { Star, Quote } from "lucide-react";
import { reviews } from "../../data/menu";

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} className={i <= rating ? "text-brand-yellow fill-brand-yellow" : "text-gray-600"} />
      ))}
    </div>
  );
}

export function ReviewCard({ review }) {
  return (
    <div className="card-dark p-5 hover:border-brand-red/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center font-display text-white text-lg">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm">{review.name}</p>
            <p className="text-gray-500 text-xs font-body">{review.role}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} />
          <span className="text-gray-600 text-xs font-body">{review.date}</span>
        </div>
      </div>

      <Quote size={16} className="text-brand-red/40 mb-2" />
      <p className="text-gray-400 text-sm font-body leading-relaxed line-clamp-4">{review.text}</p>

      {/* Sub-ratings */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-brand-muted">
        {[
          { label: "Food", val: review.food },
          { label: "Service", val: review.service },
          { label: "Vibe", val: review.atmosphere },
        ].map((r) => (
          <div key={r.label} className="flex-1 text-center">
            <div className="text-white font-heading font-bold text-lg">{r.val}/5</div>
            <div className="text-gray-500 text-xs font-body uppercase tracking-wide">{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="py-20 px-4 bg-brand-gray/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-red font-heading font-bold uppercase tracking-widest text-sm mb-2">What People Say</p>
          <h2 className="section-title">
            CUSTOMER <span className="gradient-text">REVIEWS</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <StarRating rating={5} size={20} />
            <span className="font-display text-4xl text-white">{avg}</span>
            <span className="text-gray-500 font-body text-sm">/ 5 · {reviews.length} reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
