import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  cartQuantity: number;
  inStock: boolean;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === String(product.id));

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === String(product.id)
                ? { ...item, cartQuantity: item.cartQuantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: String(product.id),
                name: product.name,
                price: product.price,
                image: product.image ?? product.image_url ?? '',
                cartQuantity: quantity,
                inStock: product.inStock ?? product.in_stock ?? true,
              },
            ],
          });
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, cartQuantity: quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.cartQuantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.cartQuantity, 0),
    }),
    { name: 'woolmatt-cart' }
  )
);