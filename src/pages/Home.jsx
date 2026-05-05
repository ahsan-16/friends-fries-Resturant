import { Link } from "react-router-dom";
import Hero from "../components/sections/Hero";
import FeaturedCategories from "../components/sections/FeaturedCategories";
import ReviewsSection from "../components/sections/ReviewsSection";
import MenuItemCard from "../components/ui/MenuItemCard";
import { menuItems, restaurantInfo } from "../data/menu";
import { Phone, MapPin, Clock, Truck, UtensilsCrossed, Package, Star } from "lucide-react";

// Top picks from each category
const featuredItems = [
  menuItems.burgers[0],
  menuItems.pizza[1],
  menuItems.shawarma[0],
  menuItems.fries[2],
  menuItems.deals[0],
  menuItems.drinks[10],
];

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Services Strip */}
      <div className="bg-brand-red py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(3).fill(["🚴 Free Delivery", "🍔 Zinger Burger", "🍕 Special Pizza", "🍟 Best Fries in Wah Cantt", "🌯 Shawarma", "⭐ 5 Star Rated", "🔥 Hot Deals Daily"]).flat().map((item, i) => (
            <span key={i} className="mx-6 font-heading font-bold text-white uppercase tracking-widest text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>

      <FeaturedCategories />

      {/* Popular Items */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-red font-heading font-bold uppercase tracking-widest text-sm mb-1">Top Picks</p>
              <h2 className="section-title">MOST <span className="gradient-text">POPULAR</span></h2>
            </div>
            <Link to="/deals" className="btn-outline text-sm px-4 py-2 hidden sm:flex">
              View All Deals →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-red via-red-700 to-brand-dark p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(255,214,0,0.1),transparent_60%)]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="font-heading font-bold text-white/60 uppercase tracking-widest text-sm mb-2">🔥 Limited Time</div>
                <h2 className="font-display text-5xl md:text-7xl text-white leading-none">TODAY'S DEALS</h2>
                <p className="text-white/70 font-body mt-2">Up to 9 amazing combo deals starting from PKR 685</p>
              </div>
              <div className="text-center">
                <div className="font-display text-7xl md:text-9xl text-brand-yellow text-glow leading-none">9</div>
                <div className="text-white font-heading font-bold uppercase tracking-wider">Combo Deals</div>
                <Link to="/deals" className="mt-4 inline-block bg-brand-yellow text-black font-heading font-bold uppercase tracking-wider px-8 py-3 rounded-full hover:bg-yellow-400 transition-all hover:scale-105">
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 px-4 bg-brand-gray/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-brand-red font-heading font-bold uppercase tracking-widest text-sm mb-2">Why Choose Us</p>
          <h2 className="section-title mb-12">THE FRIENDS <span className="gradient-text">DIFFERENCE</span></h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🌶️", title: "Unique Spices", desc: "Secret spice blend you won't find anywhere else in Wah Cantt" },
              { icon: "⚡", title: "Fast Service", desc: "Quick preparation so your food is hot and fresh every time" },
              { icon: "💰", title: "Best Value", desc: "Premium taste at prices that won't burn a hole in your pocket" },
              { icon: "🌙", title: "Late Night", desc: "Open till 2 AM on weekdays, 3 AM on weekends for late-night cravings" },
            ].map((item) => (
              <div key={item.title} className="card-dark p-6 hover:border-brand-red/30 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection />

      {/* Contact Banner */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title mb-4">READY TO <span className="gradient-text">ORDER?</span></h2>
          <p className="text-gray-500 font-body mb-8">{restaurantInfo.address}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${restaurantInfo.orderPhone}`} className="btn-primary flex items-center gap-2 px-8 py-4">
              <Phone size={20} /> {restaurantInfo.orderPhone}
            </a>
            <Link to="/contact" className="btn-outline flex items-center gap-2 px-8 py-4">
              <MapPin size={20} /> Find Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
