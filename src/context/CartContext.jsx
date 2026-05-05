import { createContext, useContext, useReducer, useEffect } from "react";

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
      return { ...state, items: state.items.filter((i) => !(i.id === action.id && i.selectedVariant === action.selectedVariant)) };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.selectedVariant === action.selectedVariant
            ? { ...i, qty: Math.max(0, action.qty) }
            : i
        ).filter((i) => i.qty > 0),
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

  return (
    <CartContext.Provider value={{ ...state, total, count, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
