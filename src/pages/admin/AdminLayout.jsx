import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed,
  Star, Users, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/users", label: "Customers", icon: Users },
];

export default function AdminLayout() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignout = async () => {
    await signout();
    navigate("/");
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-display text-4xl text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 font-body mb-6">Admin access required</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-brand-dark">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-gray border-r border-brand-muted flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-brand-muted">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍟</span>
            <div>
              <div className="font-display text-xl text-white">Friends Fries</div>
              <div className="text-xs text-brand-red font-heading font-bold uppercase tracking-widest">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-semibold text-sm uppercase tracking-wide transition-all ${
                  isActive
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                    : "text-gray-400 hover:text-white hover:bg-brand-muted"
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
              <ChevronRight size={14} className="ml-auto opacity-50" />
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-brand-muted">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center font-display text-white">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-heading font-bold truncate">
                {user.name}
              </div>
              <div className="text-gray-500 text-xs font-body truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleSignout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-brand-muted transition-all font-heading font-semibold text-sm uppercase tracking-wide"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-brand-gray/95 backdrop-blur border-b border-brand-muted px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex-1" />
          <Link
            to="/"
            target="_blank"
            className="text-gray-400 hover:text-white text-sm font-body transition-colors"
          >
            View Website →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}