import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import { restaurantInfo, menuCategories } from "../../data/menu";

export default function Footer() {
  return (
    <footer className="bg-brand-gray border-t border-brand-muted mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍟</span>
              <div>
                <div className="font-display text-2xl text-white">Friends Fries</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-heading">& Fast Food</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-body leading-relaxed mb-4">
              Wah Cantt's favorite fast food destination. Fresh, flavorful, and always satisfying.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-brand-muted rounded-lg text-gray-400 hover:text-white hover:bg-brand-red transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-brand-muted rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Menu Links */}
          <div>
            <h3 className="font-heading font-bold text-white uppercase tracking-wider mb-4">Menu</h3>
            <ul className="space-y-2">
              {menuCategories.map((cat) => (
                <li key={cat.id}>
                  <Link to={cat.slug} className="text-gray-400 hover:text-brand-yellow transition-colors text-sm font-body flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/deals", label: "Today's Deals" },
                { to: "/reviews", label: "Reviews" },
                { to: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-brand-yellow transition-colors text-sm font-body">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-white uppercase tracking-wider mb-4">Find Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-red mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm font-body">{restaurantInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-red shrink-0" />
                <a href={`tel:${restaurantInfo.orderPhone}`} className="text-gray-400 hover:text-white text-sm font-body transition-colors">
                  {restaurantInfo.orderPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-brand-red mt-0.5 shrink-0" />
                <div className="text-gray-400 text-sm font-body">
                  {restaurantInfo.hours.map((h) => (
                    <div key={h.day}>{h.day}: <span className="text-white">{h.time}</span></div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-muted mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-body text-center">
            © 2024 Friends Fries And Fast Food. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs font-body">
            Made with ❤️ by Muhammad Ahsan
          </p>
        </div>
      </div>
    </footer>
  );
}
