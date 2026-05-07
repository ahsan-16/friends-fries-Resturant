import { useState, useEffect } from "react";
import { UserX, UserCheck, Search } from "lucide-react";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    const url = search ? `/admin/users?search=${search}` : "/admin/users";
    api(url)
      .then((data) => {
        if (data.success) setUsers(data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id) => {
    const data = await api(`/admin/users/${id}/toggle`, { method: "PATCH" });
    if (data.success) {
      setUsers(users.map((u) =>
        u.id === id ? { ...u, isActive: data.data.isActive } : u
      ));
      toast.success(data.message, {
        style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-5xl text-white">CUSTOMERS</h1>
        <p className="text-gray-500 font-body mt-1">{users.length} customers</p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            className="w-full bg-brand-gray border border-brand-muted rounded-xl pl-9 pr-4 py-3 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <button onClick={fetchUsers} className="btn-primary px-5 py-2.5 text-sm">
          Search
        </button>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-4xl animate-bounce">⏳</div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 card-dark">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-500 font-body">No customers found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="card-dark p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center font-display text-white shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-heading font-bold text-sm">
                        {user.name}
                      </p>
                      {user.role === "ADMIN" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-red/20 text-brand-red border border-brand-red/30 font-heading font-bold">
                          Admin
                        </span>
                      )}
                      {!user.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-heading font-bold">
                          Banned
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs font-body">{user.email}</p>
                    {user.phone && (
                      <p className="text-gray-600 text-xs font-body">{user.phone}</p>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-white font-heading font-bold text-sm">
                      {user._count?.orders || 0} orders
                    </p>
                    <p className="text-gray-500 text-xs font-body">
                      {new Date(user.createdAt).toLocaleDateString("en-PK")}
                    </p>
                  </div>

                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => handleToggle(user.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-bold border transition-all ${
                        user.isActive
                          ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                          : "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <UserX size={14} /> Ban
                        </>
                      ) : (
                        <>
                          <UserCheck size={14} /> Unban
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}