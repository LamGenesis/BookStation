import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Cart } from '@/types';

interface LocalCartItem {
  productId: number;
  quantity: number;
}

interface CartState {
  // Server cart (when logged in)
  serverCart: Cart | null;
  
  // Local cart (when not logged in)
  localItems: LocalCartItem[];
  
  // UI state
  isLoading: boolean;
  
  // Computed
  totalQuantity: number;
  
  // Actions
  setServerCart: (cart: Cart) => void;
  clearServerCart: () => void;
  
  // Local cart actions
  addLocalItem: (productId: number, quantity: number) => void;
  updateLocalItem: (productId: number, quantity: number) => void;
  removeLocalItem: (productId: number) => void;
  clearLocalCart: () => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  
  // Get items for merge after login
  getLocalItemsForMerge: () => LocalCartItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      serverCart: null,
      localItems: [],
      isLoading: false,
      totalQuantity: 0,

      setServerCart: (cart: Cart) => {
        set({
          serverCart: cart,
          totalQuantity: cart.totalQuantity,
        });
      },

      clearServerCart: () => {
        set({
          serverCart: null,
          totalQuantity: get().localItems.reduce((sum, item) => sum + item.quantity, 0),
        });
      },

      addLocalItem: (productId: number, quantity: number) => {
        const { localItems } = get();
        const existingIndex = localItems.findIndex((item) => item.productId === productId);
        
        let newItems: LocalCartItem[];
        if (existingIndex >= 0) {
          newItems = localItems.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...localItems, { productId, quantity }];
        }
        
        set({
          localItems: newItems,
          totalQuantity: newItems.reduce((sum, item) => sum + item.quantity, 0),
        });
      },

      updateLocalItem: (productId: number, quantity: number) => {
        const { localItems } = get();
        const newItems = localItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        set({
          localItems: newItems,
          totalQuantity: newItems.reduce((sum, item) => sum + item.quantity, 0),
        });
      },

      removeLocalItem: (productId: number) => {
        const { localItems } = get();
        const newItems = localItems.filter((item) => item.productId !== productId);
        set({
          localItems: newItems,
          totalQuantity: newItems.reduce((sum, item) => sum + item.quantity, 0),
        });
      },

      clearLocalCart: () => {
        set({
          localItems: [],
          totalQuantity: get().serverCart?.totalQuantity || 0,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      getLocalItemsForMerge: () => {
        return get().localItems;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        localItems: state.localItems,
      }),
    }
  )
);

