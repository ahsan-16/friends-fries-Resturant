import { useState } from "react";
import { X, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { signin, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!form.name.trim()) throw new Error("Name is required");
        if (form.password.length < 6) throw new Error("Password must be at least 6 characters");
        await signup(form.name, form.email, form.password);
        toast.success(`Welcome, ${form.name}! 🎉`, {
          style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
        });
      } else {
        await signin(form.email, form.password);
        toast.success("Welcome back! 👋", {
          style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
        });
      }
      onClose();
    } catch (err) {
      toast.error(err.message, {
        style: { background: "#1A1A1A", color: "#fff", border: "1px solid #E8150A" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
      <div
        className="bg-brand-gray border border-brand-muted rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-brand-muted flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl text-white">
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </h2>
            <p className="text-gray-500 text-sm font-body mt-0.5">
              {mode === "signin" ? "Welcome back!" : "Create your account"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-muted text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-sm font-heading font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full bg-brand-muted border border-brand-muted rounded-xl pl-9 pr-4 py-3 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-heading font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-brand-muted border border-brand-muted rounded-xl pl-9 pr-4 py-3 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-heading font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-brand-muted border border-brand-muted rounded-xl pl-9 pr-10 py-3 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-500 font-body">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setForm({ name: "", email: "", password: "" }); }}
              className="text-brand-yellow hover:text-yellow-400 font-semibold transition-colors"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
