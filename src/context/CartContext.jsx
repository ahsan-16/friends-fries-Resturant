// import { createContext, useContext, useReducer, useEffect } from "react";

// const CartContext = createContext();

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case "ADD_ITEM": {
//       const existing = state.items.find(
//         (i) => i.id === action.item.id && i.selectedVariant === action.item.selectedVariant
//       );
//       if (existing) {
//         return {
//           ...state,
//           items: state.items.map((i) =>
//             i.id === action.item.id && i.selectedVariant === action.item.selectedVariant
//               ? { ...i, qty: i.qty + 1 }
//               : i
//           ),
//         };
//       }
//       return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
//     }
//     case "REMOVE_ITEM":
//       return { ...state, items: state.items.filter((i) => !(i.id === action.id && i.selectedVariant === action.selectedVariant)) };
//     case "UPDATE_QTY":
//       return {
//         ...state,
//         items: state.items.map((i) =>
//           i.id === action.id && i.selectedVariant === action.selectedVariant
//             ? { ...i, qty: Math.max(0, action.qty) }
//             : i
//         ).filter((i) => i.qty > 0),
//       };
//     case "CLEAR_CART":
//       return { ...state, items: [] };
//     default:
//       return state;
//   }
// };

// export const CartProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, { items: [] }, (init) => {
//     try {
//       const saved = localStorage.getItem("ff_cart");
//       return saved ? JSON.parse(saved) : init;
//     } catch {
//       return init;
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem("ff_cart", JSON.stringify(state));
//   }, [state]);

//   const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
//   const count = state.items.reduce((sum, i) => sum + i.qty, 0);

//   return (
//     <CartContext.Provider value={{ ...state, total, count, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../config/api";
import toast from "react-hot-toast";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.id === action.item.id && i.selectedVariant === action.item.selectedVariant
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id && i.selectedVariant === action.item.selectedVariant
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === action.id && i.selectedVariant === action.selectedVariant)
        ),
      };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.id && i.selectedVariant === action.selectedVariant
              ? { ...i, qty: Math.max(0, action.qty) }
              : i
          )
          .filter((i) => i.qty > 0),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, (init) => {
    try {
      const saved = localStorage.getItem("ff_cart");
      return saved ? JSON.parse(saved) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem("ff_cart", JSON.stringify(state));
  }, [state]);

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = state.items.reduce((sum, i) => sum + i.qty, 0);

  // Place real order via backend
  const placeOrder = async (extraInfo = {}) => {
    const orderData = {
      items: state.items.map((i) => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
        variant: i.selectedVariant || null,
        menuItemId: i.menuItemId || null,
        dealId: i.dealId || null,
      })),
      type: extraInfo.type || "DELIVERY",
      address: extraInfo.address || null,
      note: extraInfo.note || null,
      guestName: extraInfo.guestName || null,
      guestPhone: extraInfo.guestPhone || null,
    };

    const data = await api("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    if (data.success) {
      dispatch({ type: "CLEAR_CART" });
      toast.success("Order placed successfully! 🎉", {
        style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
      });
      return data.data;
    } else {
      throw new Error(data.message);
    }
  };

  return (
    <CartContext.Provider value={{ ...state, total, count, dispatch, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);