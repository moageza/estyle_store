/*
# Product Reviews Table

## Overview
Creates a reviews table for customers to leave feedback and ratings on products.
Includes RLS policies for public read and authenticated write.

## Tables
1. `reviews` - Customer reviews with ratings, linked to products
*/

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
DROP POLICY IF EXISTS "public_read_approved_reviews" ON reviews;
CREATE POLICY "public_read_approved_reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

-- Anyone can insert a review (no auth required)
DROP POLICY IF EXISTS "anyone_insert_reviews" ON reviews;
CREATE POLICY "anyone_insert_reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Admins can update (approve/reject) and delete reviews
DROP POLICY IF EXISTS "admin_manage_reviews" ON reviews;
CREATE POLICY "admin_manage_reviews"
  ON reviews FOR ALL TO authenticated
  USING (is_admin());

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);
