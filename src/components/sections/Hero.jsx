import { Link } from "react-router-dom";
import { Phone, MapPin, Star, ChevronDown } from "lucide-react";
import { restaurantInfo } from "../../data/menu";

export default function Hero({ onOrderClick }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-brand-dark to-brand-gray" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,21,10,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,214,0,0.08),transparent_60%)]" />
      
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Floating food emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["🍔", "🍕", "🍟", "🌯", "🍗", "🥤"].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float${i} ${4 + i}s ease-in-out infinite alternate`,
              transform: `rotate(${-20 + i * 8}deg)`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float0 { from { transform: translateY(0px) rotate(-20deg); } to { transform: translateY(-15px) rotate(-20deg); } }
        @keyframes float1 { from { transform: translateY(0px) rotate(-12deg); } to { transform: translateY(-20px) rotate(-12deg); } }
        @keyframes float2 { from { transform: translateY(0px) rotate(-4deg); } to { transform: translateY(-10px) rotate(-4deg); } }
        @keyframes float3 { from { transform: translateY(0px) rotate(4deg); } to { transform: translateY(-18px) rotate(4deg); } }
        @keyframes float4 { from { transform: translateY(0px) rotate(12deg); } to { transform: translateY(-12px) rotate(12deg); } }
        @keyframes float5 { from { transform: translateY(0px) rotate(20deg); } to { transform: translateY(-16px) rotate(20deg); } }
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/30 rounded-full px-4 py-2 mb-6 animate-fade-up">
          <span className="text-brand-red text-sm font-heading font-bold uppercase tracking-widest">
            Wah Cantt's Favorite
          </span>
          <div className="flex">
            {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-brand-yellow fill-brand-yellow" />)}
          </div>
        </div>

        {/* Main heading */}
        <h1 className="font-display text-7xl sm:text-8xl md:text-[120px] lg:text-[150px] leading-none mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <span className="text-white">FRIENDS</span>
          <br />
          <span className="gradient-text">FRIES</span>
        </h1>

        <p className="font-heading font-semibold text-xl md:text-2xl text-gray-300 tracking-wider uppercase mb-2 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          & Fast Food
        </p>

        <p className="text-gray-500 font-body text-base md:text-lg max-w-xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          Burgers · Pizzas · Shawarmas · Loaded Fries · Late Night · Delivery & Dine-in
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <Link to="/deals" className="btn-primary text-base px-8 py-4 flex items-center gap-2 glow-red">
            🔥 View Today's Deals
          </Link>
          <a href={`tel:${restaurantInfo.orderPhone}`} className="btn-outline text-base px-8 py-4 flex items-center gap-2">
            <Phone size={18} /> Order Now
          </a>
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.5s" }}>
          {["Delivery 🚴", "Dine-in 🍽️", "Takeout 📦", "Late Night 🌙"].map((s) => (
            <span key={s} className="bg-brand-gray/80 border border-brand-muted rounded-full px-4 py-1.5 text-gray-300 text-sm font-body">
              {s}
            </span>
          ))}
        </div>

        {/* Address */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-sm font-body animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <MapPin size={14} className="text-brand-red" />
          <span>{restaurantInfo.address}</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600">
        <span className="text-xs font-body uppercase tracking-widest">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}
