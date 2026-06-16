-- BizRankUp Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor or via: psql -f schema.sql

-- ============ USERS ============
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar VARCHAR(500),
  role VARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  image VARCHAR(500),
  parent_id INT DEFAULT NULL REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ BRANDS ============
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  logo VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) DEFAULT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  category_id INT DEFAULT NULL REFERENCES categories(id) ON DELETE SET NULL,
  brand_id INT DEFAULT NULL REFERENCES brands(id) ON DELETE SET NULL,
  stock INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_address JSONB DEFAULT '{}'::jsonb,
  billing_address JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ REVIEWS ============
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id INT DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ BLOG POSTS ============
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  image VARCHAR(500),
  author VARCHAR(255),
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ OFFERS / COUPONS ============
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  min_order DECIMAL(10,2) DEFAULT 0,
  usage_limit INT DEFAULT NULL,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ ADDRESSES ============
CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  user_id INT DEFAULT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  street VARCHAR(500) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255),
  zip VARCHAR(50),
  country VARCHAR(255) DEFAULT 'Bangladesh',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ EXPENSES ============
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ HERO SLIDES ============
CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  image VARCHAR(500) NOT NULL,
  link VARCHAR(500),
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) DEFAULT 'info',
  title VARCHAR(255) NOT NULL,
  message TEXT,
  for_role VARCHAR(50) NOT NULL DEFAULT 'all' CHECK (for_role IN ('all', 'customer', 'admin')),
  read_by JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ FAQ ============
CREATE TABLE IF NOT EXISTS faq (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ ORDER STATUSES ============
CREATE TABLE IF NOT EXISTS order_statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50) DEFAULT '#6B7280',
  icon VARCHAR(50) DEFAULT 'FiCircle',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ SHIPPING RATES ============
CREATE TABLE IF NOT EXISTS shipping_rates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  min_delivery_days INT DEFAULT 3,
  max_delivery_days INT DEFAULT 7,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ PAYMENT GATEWAYS ============
CREATE TABLE IF NOT EXISTS payment_gateways (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(100) NOT NULL UNIQUE,
  credentials JSONB NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ SOCIAL LOGIN PROVIDERS ============
CREATE TABLE IF NOT EXISTS social_login_providers (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(50) NOT NULL UNIQUE,
  credentials JSONB NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ AUTO-UPDATE TRIGGERS ============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
    CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_brands_updated_at') THEN
    CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
    CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at') THEN
    CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_blog_posts_updated_at') THEN
    CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_payment_gateways_updated_at') THEN
    CREATE TRIGGER update_payment_gateways_updated_at BEFORE UPDATE ON payment_gateways FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_social_login_providers_updated_at') THEN
    CREATE TRIGGER update_social_login_providers_updated_at BEFORE UPDATE ON social_login_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;
