-- WINECELLAR PRO Production Database Schema (Supabase PostgreSQL)

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE order_status_enum AS ENUM (
  'pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'
);

CREATE TYPE payment_status_enum AS ENUM (
  'unpaid', 'paid', 'failed', 'refunded'
);

CREATE TYPE payment_method_enum AS ENUM (
  'cod', 'bank_transfer', 'vnpay', 'momo', 'zalopay'
);

CREATE TYPE user_role_enum AS ENUM (
  'super_admin', 'admin', 'manager', 'sales', 'warehouse', 'content_editor', 'customer'
);

-- 2. USERS & PROFILES & ROLES
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY, -- Maps to auth.users.id
  full_name VARCHAR(150),
  phone VARCHAR(20),
  avatar_url TEXT,
  role user_role_enum DEFAULT 'customer',
  tier VARCHAR(30) DEFAULT 'Regular', -- New, Regular, VIP
  total_spent NUMERIC(15, 2) DEFAULT 0.00,
  total_orders INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCT CATALOG METADATA
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(5) UNIQUE,
  flag_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.grapes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20), -- Red, White, Pink
  description TEXT
);

CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  logo_url TEXT,
  country_id UUID REFERENCES public.countries(id),
  description TEXT,
  website VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- 4. PRODUCTS & IMAGES
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  barcode VARCHAR(50),
  brand_id UUID REFERENCES public.brands(id),
  category_id UUID REFERENCES public.categories(id),
  country_id UUID REFERENCES public.countries(id),
  region_id UUID REFERENCES public.regions(id),
  grape_id UUID REFERENCES public.grapes(id),
  vintage INT,
  volume_ml INT DEFAULT 750,
  alcohol_pct NUMERIC(4, 1),
  price NUMERIC(15, 2) NOT NULL,
  compare_price NUMERIC(15, 2),
  cost_price NUMERIC(15, 2),
  stock INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  description TEXT,
  short_description TEXT,
  wine_notes TEXT,
  food_pairing TEXT,
  serving_temp VARCHAR(50),
  is_featured BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  rating_avg NUMERIC(3, 2) DEFAULT 5.00,
  rating_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published', -- draft, published, out_of_stock
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE
);

-- 5. INVENTORY LOGGING
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_on_hand INT NOT NULL DEFAULT 0,
  quantity_reserved INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type VARCHAR(30) NOT NULL, -- import, sale, return, adjustment
  quantity_change INT NOT NULL,
  note TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADDRESSES
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  ward VARCHAR(100) NOT NULL,
  street_address TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COUPONS
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed
  discount_value NUMERIC(15, 2) NOT NULL,
  min_order_value NUMERIC(15, 2) DEFAULT 0,
  max_discount_amount NUMERIC(15, 2),
  usage_limit INT,
  per_user_limit INT DEFAULT 1,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  order_id UUID,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS & ITEMS & SHIPMENTS & PAYMENTS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(15, 2) NOT NULL,
  discount_amount NUMERIC(15, 2) DEFAULT 0,
  shipping_fee NUMERIC(15, 2) DEFAULT 0,
  total_amount NUMERIC(15, 2) NOT NULL,
  coupon_code VARCHAR(50),
  status order_status_enum DEFAULT 'pending',
  payment_method payment_method_enum DEFAULT 'cod',
  payment_status payment_status_enum DEFAULT 'unpaid',
  note TEXT,
  tracking_number VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  unit_price NUMERIC(15, 2) NOT NULL,
  quantity INT NOT NULL,
  total_price NUMERIC(15, 2) NOT NULL
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method payment_method_enum NOT NULL,
  transaction_ref VARCHAR(100),
  amount NUMERIC(15, 2) NOT NULL,
  status payment_status_enum DEFAULT 'unpaid',
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  carrier VARCHAR(100),
  tracking_code VARCHAR(100),
  shipping_status VARCHAR(50) DEFAULT 'preparing',
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- 9. WISHLISTS
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wishlist_id, product_id)
);

-- 10. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name VARCHAR(100) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'approved', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);

-- 11. BANNERS, BLOG & CAMPAIGNS
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  subtitle TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  image_desktop TEXT NOT NULL,
  image_mobile TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  thumbnail TEXT,
  content TEXT NOT NULL,
  category_id UUID REFERENCES public.blog_categories(id),
  author VARCHAR(100) DEFAULT 'Sommelier Master',
  tags TEXT[],
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  discount_pct INT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- 12. NOTIFICATIONS & SETTINGS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'order', -- order, stock, promo, review
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR HIGH PERFORMANCE
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_brand ON public.products(brand_id);
CREATE INDEX idx_products_country ON public.products(country_id);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Customer can read/update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Customer can view own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Anyone can view published products, categories, brands, banners, and blog posts
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products view" ON public.products FOR SELECT USING (status = 'published');

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public categories view" ON public.categories FOR SELECT USING (is_active = true);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public brands view" ON public.brands FOR SELECT USING (status = 'active');
