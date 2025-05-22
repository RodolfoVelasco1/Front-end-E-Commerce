// src/store/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

// Create store with persistence
const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      
      // Add product to cart
      addToCart: (product: Product) => {
        const cart = get().cart;
        const itemIndex = cart.findIndex(item => item.id === product.id);
        
        if (itemIndex !== -1) {
          // Item exists, update quantity
          const updatedCart = [...cart];
          updatedCart[itemIndex].quantity += 1;
          set({ cart: updatedCart });
        } else {
          // Add new item
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },
      
      // Remove product from cart
      removeFromCart: (productId: number) => {
        set({ cart: get().cart.filter(item => item.id !== productId) });
      },
      
      // Update quantity of a specific product
      updateQuantity: (productId: number, quantity: number) => {
        const cart = get().cart;
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
          const updatedCart = [...cart];
          
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            updatedCart.splice(itemIndex, 1);
          } else {
            // Update quantity
            updatedCart[itemIndex].quantity = quantity;
          }
          
          set({ cart: updatedCart });
        }
      },
      
      // Clear the cart
      clearCart: () => {
        set({ cart: [] });
      },
      
      // Get cart total price
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      // Get total number of items in cart
      getCartItemsCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'ecommerce-cart-storage',
    }
  )
);

export default useStore;

