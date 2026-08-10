import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Coupon } from '@/types';
import { useAdminStore } from './useAdminStore';

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon | null) => void;
  getCartCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            return { items: [...state.items, { product, quantity }] };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      getCartCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon || subtotal < coupon.minOrderValue) return 0;

        if (coupon.discountType === 'percentage') {
          const calculated = (subtotal * coupon.discountValue) / 100;
          return coupon.maxDiscountAmount
            ? Math.min(calculated, coupon.maxDiscountAmount)
            : calculated;
        } else {
          return Math.min(coupon.discountValue, subtotal);
        }
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        const adminStore = useAdminStore.getState();
        const threshold = adminStore.storeSettings?.freeShippingThreshold ?? 3000000;
        const baseFee = adminStore.storeSettings?.shippingFee ?? 50000;

        if (subtotal === 0 || subtotal >= threshold) {
          return 0;
        }
        return baseFee;
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: 'winecellar-pro-cart',
    }
  )
);
