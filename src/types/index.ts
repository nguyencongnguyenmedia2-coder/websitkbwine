export type WineCategory = 'vang-do' | 'vang-trang' | 'vang-hong' | 'sparkling' | 'champagne' | 'vang-cao-cap';

export interface Country {
  id: string;
  name: string;
  code: string;
  flagUrl?: string;
}

export interface Region {
  id: string;
  name: string;
  countryId: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  countryId?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  brand: string;
  brandId?: string;
  category: WineCategory;
  categoryName: string;
  country: string;
  countryId?: string;
  region: string;
  regionId?: string;
  grape: string;
  vintage: number;
  volumeMl: number;
  alcoholPct: number;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  description: string;
  shortDescription?: string;
  wineNotes: string;
  foodPairing: string;
  servingTemp: string;
  agingPotential?: string;
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  ratingAvg: number;
  ratingCount: number;
  status: 'draft' | 'published' | 'out_of_stock';
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  note?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'vnpay' | 'momo' | 'zalopay';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  note?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorTitle?: string;
  readTimeMinutes?: number;
  tags: string[];
  focusKeyword?: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedProductIds?: string[];
  viewsCount?: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'sales' | 'warehouse' | 'content_editor' | 'customer';
  tier: 'New' | 'Regular' | 'VIP';
  totalSpent: number;
  totalOrders: number;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'import' | 'sale' | 'return' | 'adjustment';
  quantityChange: number;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'promo' | 'review';
  isRead: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageDesktop: string;
  imageMobile: string;
  displayOrder: number;
  isActive: boolean;
}
