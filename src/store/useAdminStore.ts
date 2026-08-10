import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Order, Coupon, Review, BlogPost, InventoryMovement, NotificationItem } from '@/types';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_COUPONS, MOCK_REVIEWS, MOCK_BLOGS, MOCK_INVENTORY_MOVEMENTS } from '@/lib/data/mockData';

interface SectionVisibility {
  hero: boolean;
  featuredProducts: boolean;
  bestSellers: boolean;
  newArrivals: boolean;
  collections: boolean;
  blog: boolean;
  reviews: boolean;
  newsletter: boolean;
}

interface AdminState {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  blogs: BlogPost[];
  inventoryMovements: InventoryMovement[];
  notifications: NotificationItem[];
  homepageSections: SectionVisibility;
  storeSettings: {
    storeName: string;
    phone: string;
    email: string;
    address: string;
    shippingFee: number;
    freeShippingThreshold: number;
    taxPct: number;
    currency: string;
  };

  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;

  // Order Actions
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addOrder: (order: Order) => void;

  // Coupon Actions
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, data: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Review Actions
  updateReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;

  // Blog Actions
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  deleteBlogPost: (id: string) => void;

  // Inventory Actions
  adjustStock: (productId: string, change: number, note: string, user: string) => void;

  // Homepage customization
  toggleHomepageSection: (section: keyof SectionVisibility) => void;

  // Store Settings
  updateStoreSettings: (data: Partial<AdminState['storeSettings']>) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      orders: MOCK_ORDERS,
      coupons: MOCK_COUPONS,
      reviews: MOCK_REVIEWS,
      blogs: MOCK_BLOGS,
      inventoryMovements: MOCK_INVENTORY_MOVEMENTS,
      notifications: [
        {
          id: 'n-1',
          title: 'Đơn hàng mới WCP-2026-1004',
          message: 'Khách hàng Phạm Đăng Khoa vừa đặt đơn hàng trị giá 16.800.000₫',
          type: 'order',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'n-2',
          title: 'Cảnh báo Low Stock',
          message: 'Sản phẩm Penfolds Grange Shiraz 2017 chỉ còn 6 chai trong kho!',
          type: 'stock',
          isRead: false,
          createdAt: new Date().toISOString(),
        }
      ],
      homepageSections: {
        hero: true,
        featuredProducts: true,
        bestSellers: true,
        newArrivals: true,
        collections: true,
        blog: true,
        reviews: true,
        newsletter: true,
      },
      storeSettings: {
        storeName: 'KBWINE',
        phone: '0222.6882.000',
        email: 'contact@kbwine.vn',
        address: 'Nguyễn Công Hoan – Ba Đình – Hà Nội',
        shippingFee: 50000,
        freeShippingThreshold: 3000000,
        taxPct: 10,
        currency: 'VND',
      },

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `p-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      duplicateProduct: (id) => {
        const p = get().products.find((item) => item.id === id);
        if (!p) return;
        const duplicated: Product = {
          ...p,
          id: `p-${Date.now()}`,
          name: `${p.name} (Bản sao)`,
          sku: `${p.sku}-COPY`,
          slug: `${p.slug}-copy`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [duplicated, ...state.products] }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        }));
      },

      addOrder: (newOrder) => {
        set((state) => ({ orders: [newOrder, ...state.orders] }));
      },

      addCoupon: (couponData) => {
        const newCoupon: Coupon = {
          ...couponData,
          id: `cp-${Date.now()}`,
          usedCount: 0,
        };
        set((state) => ({ coupons: [newCoupon, ...state.coupons] }));
      },

      updateCoupon: (id, data) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        }));
      },

      updateReviewStatus: (id, status) => {
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, status } : r)),
        }));
      },

      deleteReview: (id) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        }));
      },

      addReview: (reviewData) => {
        const newRev: Review = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ reviews: [newRev, ...state.reviews] }));
      },

      addBlogPost: (postData) => {
        const newPost: BlogPost = {
          ...postData,
          id: `b-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ blogs: [newPost, ...state.blogs] }));
      },

      deleteBlogPost: (id) => {
        set((state) => ({
          blogs: state.blogs.filter((b) => b.id !== id),
        }));
      },

      adjustStock: (productId, change, note, user) => {
        const p = get().products.find((item) => item.id === productId);
        if (!p) return;
        const newStock = Math.max(0, p.stock + change);
        get().updateProduct(productId, {
          stock: newStock,
          status: newStock === 0 ? 'out_of_stock' : p.status,
        });

        const movement: InventoryMovement = {
          id: `im-${Date.now()}`,
          productId,
          productName: p.name,
          type: change >= 0 ? 'import' : 'adjustment',
          quantityChange: change,
          note,
          createdBy: user,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          inventoryMovements: [movement, ...state.inventoryMovements],
        }));
      },

      toggleHomepageSection: (section) => {
        set((state) => ({
          homepageSections: {
            ...state.homepageSections,
            [section]: !state.homepageSections[section],
          },
        }));
      },

      updateStoreSettings: (data) => {
        set((state) => ({
          storeSettings: {
            ...state.storeSettings,
            ...data,
          },
        }));
      },
    }),
    {
      name: 'winecellar-pro-admin',
    }
  )
);
