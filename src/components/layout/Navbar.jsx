import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { menuCategories } from "../../data/menu";

export default function Navbar({ onCartOpen, onAuthOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignout = () => {
    signout();
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-dark/95 backdrop-blur-md border-b border-brand-muted shadow-2xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-brand-red text-2xl">🍟</span>
            <div>
              <div className="font-display text-xl md:text-2xl tracking-wide text-white group-hover:text-brand-yellow transition-colors">
                Friends Fries
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-heading -mt-1">
                & Fast Food
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={({ isActive }) => `font-heading font-semibold uppercase tracking-wide text-sm transition-colors ${isActive ? "text-brand-yellow" : "text-gray-300 hover:text-white"}`}>
              Home
            </NavLink>

            {/* Menu Dropdown */}
            <div className="relative" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
              <button className="flex items-center gap-1 font-heading font-semibold uppercase tracking-wide text-sm text-gray-300 hover:text-white transition-colors">
                Menu <ChevronDown size={14} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-brand-gray border border-brand-muted rounded-xl overflow-hidden shadow-2xl">
                  {menuCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={cat.slug}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-brand-muted hover:text-white transition-colors font-body"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/deals" className={({ isActive }) => `font-heading font-semibold uppercase tracking-wide text-sm transition-colors ${isActive ? "text-brand-yellow" : "text-gray-300 hover:text-white"}`}>
              🔥 Deals
            </NavLink>
            <NavLink to="/reviews" className={({ isActive }) => `font-heading font-semibold uppercase tracking-wide text-sm transition-colors ${isActive ? "text-brand-yellow" : "text-gray-300 hover:text-white"}`}>
              Reviews
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `font-heading font-semibold uppercase tracking-wide text-sm transition-colors ${isActive ? "text-brand-yellow" : "text-gray-300 hover:text-white"}`}>
              Contact
            </NavLink>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={onCartOpen}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-heading font-bold w-5 h-5 rounded-full flex items-center justify-center cart-pulse">
                  {count}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-gray-300 text-sm font-body">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={handleSignout}
                  className="p-2 text-gray-400 hover:text-brand-red transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthOpen}
                className="hidden md:flex items-center gap-2 btn-outline text-sm px-4 py-2"
              >
                <User size={16} /> Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-gray border-t border-brand-muted">
          <div className="px-4 py-4 space-y-1">
            {[
              { to: "/", label: "Home" },
              { to: "/burgers", label: "🍔 Burgers" },
              { to: "/pizza", label: "🍕 Pizza" },
              { to: "/shawarma", label: "🌯 Shawarma & Wraps" },
              { to: "/fries", label: "🍟 Fries" },
              { to: "/drinks", label: "🥤 Drinks & Juices" },
              { to: "/deals", label: "🔥 Deals" },
              { to: "/reviews", label: "⭐ Reviews" },
              { to: "/contact", label: "📍 Contact" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg font-heading font-semibold uppercase tracking-wide text-sm transition-colors ${
                    isActive ? "text-brand-yellow bg-brand-muted" : "text-gray-300 hover:text-white hover:bg-brand-muted"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <hr className="border-brand-muted my-2" />
            {user ? (
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-gray-300 text-sm">{user.name}</span>
                <button onClick={handleSignout} className="text-brand-red text-sm font-heading font-bold uppercase">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onAuthOpen(); setMobileOpen(false); }}
                className="w-full btn-primary text-sm py-2"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
