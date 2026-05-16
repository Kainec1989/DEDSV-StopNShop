import { create } from "zustand";

/**
 * Zustand cart store.
 * Components subscribe only to the slices they need, avoiding broad Context rerenders.
 */
export const useCartStore = create((set, get) => ({
  cart: [],

  addToCart: (product) => {
    if (!product.selectedSize) {
      console.error("No size selected");
      return;
    }

    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (item) => item._id === product._id && item.selectedSize === product.selectedSize,
      );

      if (existingItemIndex > -1) {
        const nextCart = [...state.cart];
        nextCart[existingItemIndex] = {
          ...nextCart[existingItemIndex],
          quantity: nextCart[existingItemIndex].quantity + product.quantity,
        };
        return { cart: nextCart };
      }

      return { cart: [...state.cart, product] };
    });
  },

  removeFromCart: (productId, size) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => !(item._id === productId && item.selectedSize === size),
      ),
    }));
  },

  updateQuantity: (productId, size, newQuantity) => {
    if (newQuantity < 1) return;

    set((state) => ({
      cart: state.cart.map((item) =>
        item._id === productId && item.selectedSize === size
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  getCartTotal: () =>
    get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
}));

export const selectCart = (state) => state.cart;
export const selectCartTotal = (state) => state.getCartTotal();
export const selectCartItemCount = (state) =>
  state.cart.reduce((total, item) => total + item.quantity, 0);
