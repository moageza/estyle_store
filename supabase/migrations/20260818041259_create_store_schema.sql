/*
# E-commerce Store Schema: Products, Categories, Orders, Admin

## Overview
Creates the complete database schema for the e-commerce store, replacing hardcoded product data.
Enables admin management of products, categories, and orders through a secure admin dashboard.

## New Tables
1. `categories` - Product categories with bilingual names (ar/en), sortable
2. `products` - Full product catalog with bilingual content, images, colors, sizes, stock
3. `orders` - Customer orders with status tracking
4. `admin_users` - Authorized admin user IDs

## Helper Functions (created first, before policies reference them)
- `is_admin()` — SECURITY DEFINER, returns true if current auth user is in admin_users
- `create_first_admin()` — one-time setup for first admin account

## Security (RLS on every table)
- `categories`: public SELECT, admin-only write
- `products`: public SELECT (active only), admin SELECT (all), admin-only write
- `orders`: public INSERT (checkout), admin-only SELECT/UPDATE
- `admin_users`: self SELECT only
- Storage bucket `product-images`: public read, admin-only write/delete
*/

-- ============================================================
-- HELPER FUNCTIONS (must exist before policies reference them)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "self_select_admin" ON admin_users;
CREATE POLICY "self_select_admin"
  ON admin_users FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION create_first_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_users) THEN
    RAISE EXCEPTION 'Admin account already exists';
  END IF;
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  INSERT INTO admin_users (user_id) VALUES (auth.uid());
END;
$$;

REVOKE EXECUTE ON FUNCTION create_first_admin() FROM anon;
GRANT EXECUTE ON FUNCTION create_first_admin() TO authenticated;

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_categories" ON categories;
CREATE POLICY "public_select_categories"
  ON categories FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories"
  ON categories FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories"
  ON categories FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories"
  ON categories FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  category_key text REFERENCES categories(key) ON DELETE SET NULL,
  gender text NOT NULL DEFAULT 'unisex',
  price numeric NOT NULL DEFAULT 0,
  old_price numeric,
  image text NOT NULL DEFAULT '',
  gallery text[] NOT NULL DEFAULT '{}',
  description_ar text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  colors jsonb NOT NULL DEFAULT '[]',
  sizes text[] NOT NULL DEFAULT '{}',
  rating numeric NOT NULL DEFAULT 0,
  reviews int NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  occasion text[] NOT NULL DEFAULT '{}',
  is_new boolean NOT NULL DEFAULT false,
  is_trending boolean NOT NULL DEFAULT false,
  popularity int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  stock int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_active_products" ON products;
CREATE POLICY "public_select_active_products"
  ON products FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_select_all_products" ON products;
CREATE POLICY "admin_select_all_products"
  ON products FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
  ON products FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
  ON products FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
  ON products FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  customer_address text NOT NULL,
  customer_city text NOT NULL,
  notes text,
  subtotal numeric NOT NULL DEFAULT 0,
  shipping numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  items jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders"
  ON orders FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_orders" ON orders;
CREATE POLICY "admin_select_orders"
  ON orders FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders"
  ON orders FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- STORAGE BUCKET for product images
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_insert_product_images" ON storage.objects;
CREATE POLICY "admin_insert_product_images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

DROP POLICY IF EXISTS "admin_update_product_images" ON storage.objects;
CREATE POLICY "admin_update_product_images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND is_admin())
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

DROP POLICY IF EXISTS "admin_delete_product_images" ON storage.objects;
CREATE POLICY "admin_delete_product_images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_key);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);