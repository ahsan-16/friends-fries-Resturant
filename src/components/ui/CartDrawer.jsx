import { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, MapPin, User, Phone, CreditCard, Banknote, CheckCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const STEPS = {
  CART: "cart",
  ORDER_TYPE: "order_type",
  DETAILS: "details",
  PAYMENT: "payment",
  SUCCESS: "success",
};

export default function CartDrawer({ open, onClose }) {
  const { items, total, dispatch, placeOrder } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(STEPS.CART);
  const [orderType, setOrderType] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderNo, setOrderNo] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
  });

  const resetFlow = () => {
    setStep(STEPS.CART);
    setOrderType(null);
    setPaymentMethod(null);
    setOrderNo(null);
    setForm({ name: user?.name || "", phone: "", address: "" });
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  const handlePlaceOrder = async () => {
    if (!form.phone) {
      toast.error("Phone number required");
      return;
    }
    if (orderType === "DELIVERY" && !form.address) {
      toast.error("Delivery address required");
      return;
    }
    if (!form.name) {
      toast.error("Name required");
      return;
    }

    setLoading(true);
    try {
      const order = await placeOrder({
        type: orderType,
        address: orderType === "DELIVERY" ? form.address : null,
        guestName: !user ? form.name : undefined,
        guestPhone: form.phone,
        note: `Payment: ${paymentMethod} | Name: ${form.name}`,
      });

      const generatedOrderNo = `FF-${Date.now().toString().slice(-6)}`;
      setOrderNo(generatedOrderNo);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      toast.error(err.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[95] w-full max-w-sm bg-brand-gray border-l border-brand-muted flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-muted">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-red" />
            <h2 className="font-heading font-bold text-white text-lg uppercase tracking-wide">
              {step === STEPS.CART && "Your Cart"}
              {step === STEPS.ORDER_TYPE && "Order Type"}
              {step === STEPS.DETAILS && "Your Details"}
              {step === STEPS.PAYMENT && "Payment"}
              {step === STEPS.SUCCESS && "Order Placed!"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {step !== STEPS.CART && step !== STEPS.SUCCESS && (
              <button
                onClick={() => setStep(
                  step === STEPS.PAYMENT ? STEPS.DETAILS :
                  step === STEPS.DETAILS ? STEPS.ORDER_TYPE :
                  STEPS.CART
                )}
                className="text-xs text-gray-500 hover:text-white transition-colors font-body"
              >
                ← Back
              </button>
            )}
            {items.length > 0 && step === STEPS.CART && (
              <button
                onClick={() => dispatch({ type: "CLEAR_CART" })}
                className="text-xs text-gray-500 hover:text-brand-red transition-colors font-body"
              >
                Clear
              </button>
            )}
            <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-brand-muted text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {step !== STEPS.SUCCESS && (
          <div className="flex gap-1 px-5 pt-3">
            {[STEPS.CART, STEPS.ORDER_TYPE, STEPS.DETAILS, STEPS.PAYMENT].map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  [STEPS.CART, STEPS.ORDER_TYPE, STEPS.DETAILS, STEPS.PAYMENT].indexOf(step) >= i
                    ? "bg-brand-red"
                    : "bg-brand-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── STEP 1: CART ── */}
        {step === STEPS.CART && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="font-heading font-bold text-white text-lg">Cart is empty</p>
                  <p className="text-gray-500 text-sm font-body mt-1">Add some delicious items!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.selectedVariant}`} className="flex items-center gap-3 bg-brand-muted rounded-xl p-3">
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-heading font-semibold truncate">{item.name}</p>
                      <p className="price-tag text-sm font-heading font-bold">PKR {(item.price * item.qty).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, selectedVariant: item.selectedVariant, qty: item.qty - 1 })}
                        className="w-6 h-6 rounded-full bg-brand-gray flex items-center justify-center text-gray-400 hover:text-white">
                        <Minus size={12} />
                      </button>
                      <span className="text-white font-heading font-bold text-sm w-4 text-center">{item.qty}</span>
                      <button onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, selectedVariant: item.selectedVariant, qty: item.qty + 1 })}
                        className="w-6 h-6 rounded-full bg-brand-gray flex items-center justify-center text-gray-400 hover:text-white">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id, selectedVariant: item.selectedVariant })}
                        className="ml-1 text-gray-500 hover:text-brand-red transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="p-5 border-t border-brand-muted space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-body">Total</span>
                  <span className="price-tag font-display text-2xl">PKR {total.toLocaleString()}</span>
                </div>
                <button onClick={() => setStep(STEPS.ORDER_TYPE)} className="w-full btn-primary py-3.5">
                  Proceed to Order →
                </button>
              </div>
            )}
          </>
        )}

        {/* ── STEP 2: ORDER TYPE ── */}
        {step === STEPS.ORDER_TYPE && (
          <div className="flex-1 p-5 space-y-4">
            <p className="text-gray-400 font-body text-sm">How would you like to receive your order?</p>

            <button
              onClick={() => { setOrderType("DELIVERY"); setStep(STEPS.DETAILS); }}
              className="w-full p-5 card-dark hover:border-brand-red/50 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🚴</div>
                <div>
                  <p className="font-heading font-bold text-white text-lg">Delivery</p>
                  <p className="text-gray-500 text-sm font-body">We deliver to your doorstep</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => { setOrderType("TAKEOUT"); setStep(STEPS.DETAILS); }}
              className="w-full p-5 card-dark hover:border-brand-yellow/50 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏪</div>
                <div>
                  <p className="font-heading font-bold text-white text-lg">Pickup</p>
                  <p className="text-gray-500 text-sm font-body">Pick up from our restaurant</p>
                  <p className="text-brand-yellow text-xs font-body mt-1">Dubai Kitchen, Qabristan Rd, Wah Cantt</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ── STEP 3: DETAILS ── */}
        {step === STEPS.DETAILS && (
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <p className="text-gray-400 font-body text-sm">
              {orderType === "DELIVERY" ? "Enter delivery details" : "Enter your details for pickup"}
            </p>

            {/* Name */}
            <div>
              <label className="text-gray-400 text-xs font-heading uppercase tracking-wider block mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-brand-muted border border-brand-muted rounded-xl pl-9 pr-4 py-3 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-400 text-xs font-heading uppercase tracking-wider block mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="03XX-XXXXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-brand-muted border border-brand-muted rounded-xl pl-9 pr-4 py-3 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            {/* Address — only for delivery */}
            {orderType === "DELIVERY" && (
              <div>
                <label className="text-gray-400 text-xs font-heading uppercase tracking-wider block mb-1.5">
                  Delivery Address *
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3 text-gray-500" />
                  <textarea
                    placeholder="House no, Street, Area..."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    className="w-full bg-brand-muted border border-brand-muted rounded-xl pl-9 pr-4 py-3 text-white font-body text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-red resize-none"
                  />
                </div>
              </div>
            )}

            {/* Pickup info */}
            {orderType === "TAKEOUT" && (
              <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-4">
                <p className="text-brand-yellow font-heading font-bold text-sm mb-1">📍 Pickup Location</p>
                <p className="text-gray-400 text-xs font-body">Dubai Kitchen, Line, 10 Qabristan Rd, Wah Cantt</p>
                <p className="text-gray-500 text-xs font-body mt-1">You will receive an order number after payment</p>
              </div>
            )}

            <button
              onClick={() => {
                if (!form.name || !form.phone) { toast.error("Name and phone required"); return; }
                if (orderType === "DELIVERY" && !form.address) { toast.error("Address required"); return; }
                setStep(STEPS.PAYMENT);
              }}
              className="w-full btn-primary py-3.5"
            >
              Continue to Payment →
            </button>
          </div>
        )}

        {/* ── STEP 4: PAYMENT ── */}
        {step === STEPS.PAYMENT && (
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <p className="text-gray-400 font-body text-sm">Select payment method</p>

            {/* COD — only for delivery */}
            {orderType === "DELIVERY" && (
              <button
                onClick={() => setPaymentMethod("COD")}
                className={`w-full p-4 card-dark transition-all text-left ${paymentMethod === "COD" ? "border-brand-red/60 bg-brand-red/10" : "hover:border-gray-600"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💵</div>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-white">Cash on Delivery</p>
                    <p className="text-gray-500 text-xs font-body">Pay when you receive your order</p>
                  </div>
                  {paymentMethod === "COD" && <CheckCircle size={20} className="text-brand-red" />}
                </div>
              </button>
            )}

            {/* Online Payment */}
            <div>
              <p className="text-gray-500 text-xs font-heading uppercase tracking-wider mb-2">Online Payment</p>
              <div className="space-y-2">
                {[
                  { id: "EASYPAISA", label: "EasyPaisa", emoji: "📱", detail: "0315-5305988" },
                  { id: "JAZZCASH", label: "JazzCash", emoji: "📲", detail: "0315-5305988" },
                  { id: "BANK", label: "Bank Transfer", emoji: "🏦", detail: "HBL — Friends Fries — 1234567890" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 card-dark transition-all text-left ${paymentMethod === method.id ? "border-brand-yellow/60 bg-brand-yellow/5" : "hover:border-gray-600"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{method.emoji}</div>
                      <div className="flex-1">
                        <p className="font-heading font-bold text-white text-sm">{method.label}</p>
                        <p className="text-gray-500 text-xs font-body">{method.detail}</p>
                      </div>
                      {paymentMethod === method.id && <CheckCircle size={18} className="text-brand-yellow" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-brand-muted rounded-xl p-4">
              <p className="text-gray-400 text-xs font-heading uppercase tracking-wider mb-2">Order Summary</p>
              <div className="flex justify-between">
                <span className="text-gray-400 font-body text-sm">{items.reduce((s, i) => s + i.qty, 0)} items</span>
                <span className="price-tag font-display text-xl">PKR {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500 font-body text-xs">{orderType === "DELIVERY" ? "🚴 Delivery" : "🏪 Pickup"}</span>
                <span className="text-gray-500 font-body text-xs">{form.name} · {form.phone}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!paymentMethod || loading}
              className="w-full btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Placing Order..." : `Confirm Order — PKR ${total.toLocaleString()}`}
            </button>
          </div>
        )}

        {/* ── STEP 5: SUCCESS ── */}
        {step === STEPS.SUCCESS && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="font-display text-4xl text-white mb-2">Order Placed!</h2>

            {orderType === "TAKEOUT" && (
              <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl p-5 mb-5 w-full">
                <p className="text-gray-400 text-sm font-body mb-2">Your Order Number</p>
                <p className="font-display text-5xl text-brand-yellow">{orderNo}</p>
                <p className="text-gray-400 text-xs font-body mt-2">Show this number when you pickup</p>
              </div>
            )}

            {orderType === "DELIVERY" && (
              <div className="bg-brand-red/10 border border-brand-red/30 rounded-2xl p-5 mb-5 w-full">
                <p className="text-white font-heading font-bold mb-1">Estimated Delivery</p>
                <p className="font-display text-4xl text-brand-red">30-45 min</p>
                <p className="text-gray-400 text-xs font-body mt-2">To: {form.address}</p>
              </div>
            )}

            <p className="text-gray-500 text-sm font-body mb-6">
              {paymentMethod === "COD"
                ? "Pay PKR " + total.toLocaleString() + " cash when you receive your order"
                : `Please send PKR ${total.toLocaleString()} via ${paymentMethod} to confirm your order`}
            </p>

            <button onClick={handleClose} className="w-full btn-primary py-3">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}