import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface User {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  username: string;
  email: string;
  rol: string;
  direccion?: {
    id: number;
    domicilio: string;
    casa: string;
    localidad: {
      id: number;
      nombre: string;
      codigoPostal: number;
      provincia: {
        id: number;
        nombre: string;
        pais: {
          id: number;
          nombre: string;
        };
      };
    };
  } | null;
}

interface StoreState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  user: User | null;
  isAuthInitialized: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  initializeAuth: () => void; 
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],

      addToCart: (product: Product) => {
        const cart = get().cart;
        const itemIndex = cart.findIndex(item => item.id === product.id);

        if (itemIndex !== -1) {
          const updatedCart = [...cart];
          updatedCart[itemIndex].quantity += 1;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId: number) => {
        set({ cart: get().cart.filter(item => item.id !== productId) });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const cart = get().cart;
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex !== -1) {
          const updatedCart = [...cart];

          if (quantity <= 0) {
            updatedCart.splice(itemIndex, 1);
          } else {
            updatedCart[itemIndex].quantity = quantity;
          }

          set({ cart: updatedCart });
        }
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getCartItemsCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Auth state
      user: null,
      isAuthInitialized: false,

      login: (userData: User) => {
        set({ user: userData });
        localStorage.setItem('currentUser', JSON.stringify(userData));
      },

      logout: () => {
        set({ user: null });
        localStorage.removeItem('currentUser');
      },

      isAuthenticated: () => {
        return get().user !== null;
      },

      initializeAuth: () => {
        if (get().isAuthInitialized) return;
        
        const currentUserData = localStorage.getItem('currentUser');
        if (currentUserData) {
          try {
            const userData = JSON.parse(currentUserData);
            set({ user: userData, isAuthInitialized: true });
          } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('currentUser');
            set({ isAuthInitialized: true });
          }
        } else {
          set({ isAuthInitialized: true });
        }
      },
    }),
    {
      name: 'ecommerce-store',
      // Excluir isAuthInitialized de la persistencia
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
      }),
    }
  )
);

export default useStore;