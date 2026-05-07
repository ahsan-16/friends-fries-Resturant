import { useState, useEffect } from "react";
import { ShoppingBag, Users, UtensilsCrossed, TrendingUp, Clock, CheckCircle, XCircle, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../config/api";

const statusColors = {
  PENDING:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PREPARING: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  READY:     "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/admin/dashboard").then((data) => {
      if (data.success) setStats(data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-bounce">⏳</div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Today's Orders",
      value: stats?.stats.todayOrders || 0,
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending Orders",
      value: stats?.stats.pendingOrders || 0,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Today's Revenue",
      value: `PKR ${Number(stats?.stats.todayRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Customers",
      value: stats?.stats.totalCustomers || 0,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Orders",
      value: stats?.stats.totalOrders || 0,
      icon: CheckCircle,
      color: "text-brand-red",
      bg: "bg-brand-red/10",
    },
    {
      label: "Menu Items",
      value: stats?.stats.totalMenuItems || 0,
      icon: UtensilsCrossed,
      color: "text-brand-yellow",
      bg: "bg-brand-yellow/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-5xl text-white">DASHBOARD</h1>
        <p className="text-gray-500 font-body mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card-dark p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
            <div className={`font-display text-3xl ${card.color} mb-1`}>
              {card.value}
            </div>
            <div className="text-gray-500 text-sm font-body">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Orders by Status */}
      {stats?.ordersByStatus && (
        <div className="card-dark p-6">
          <h2 className="font-heading font-bold text-white text-lg uppercase tracking-wide mb-4">
            Orders by Status
          </h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div
                key={status}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-heading font-bold ${statusColors[status] || "bg-gray-500/20 text-gray-400"}`}
              >
                <span>{status}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-white text-lg uppercase tracking-wide">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-brand-yellow text-sm font-heading font-bold hover:text-yellow-400 transition-colors"
          >
            View All →
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <p className="text-gray-500 font-body text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {stats?.recentOrders?.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-brand-muted rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center">
                    <ShoppingBag size={16} className="text-brand-red" />
                  </div>
                  <div>
                    <p className="text-white font-heading font-semibold text-sm">
                      {order.user?.name || order.guestName || "Guest"}
                    </p>
                    <p className="text-gray-500 text-xs font-body">
                      {order.items?.length} items · PKR {Number(order.total).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full border font-heading font-bold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <Link
                    to="/admin/orders"
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <ChefHat size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}