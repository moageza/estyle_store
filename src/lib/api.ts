import { supabase } from '@/lib/supabase';
import type { Product, ColorOption } from '@/types';

/* ── Row types (matching the DB schema) ────────────────────── */

interface DbCategory {
  id: number;
  key: string;
  name_ar: string;
  name_en: string;
  sort_order: number;
}

export interface DbProduct {
  id: number;
  name_ar: string;
  name_en: string;
  category_key: string | null;
  gender: string;
  price: number;
  old_price: number | null;
  image: string;
  gallery: string[];
  description_ar: string;
  description_en: string;
  colors: ColorOption[];
  sizes: string[];
  rating: number;
  reviews: number;
  tags: string[];
  occasion: string[];
  is_new: boolean;
  is_trending: boolean;
  popularity: number;
  is_active: boolean;
  stock: number;
}

/* ── Mappers ───────────────────────────────────────────────── */

interface CategoryItem {
  key: string;
  ar: string;
  en: string;
}

function dbCategoryToCategory(row: DbCategory): CategoryItem {
  return {
    key: row.key,
    ar: row.name_ar,
    en: row.name_en,
  };
}

function dbProductToProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: { ar: row.name_ar, en: row.name_en },
    category: (row.category_key ?? 'accessories') as Product['category'],
    gender: row.gender as Product['gender'],
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    image: row.image,
    gallery: row.gallery ?? [],
    description: { ar: row.description_ar, en: row.description_en },
    colors: (row.colors as ColorOption[]) ?? [],
    sizes: row.sizes ?? [],
    rating: row.rating,
    reviews: row.reviews,
    tags: row.tags ?? [],
    occasion: row.occasion as Product['occasion'],
    isNew: row.is_new,
    isTrending: row.is_trending,
    popularity: row.popularity,
  };
}

/* ── Public API ────────────────────────────────────────────── */

export type { CategoryItem };

export async function fetchCategories(): Promise<CategoryItem[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data as DbCategory[]).map(dbCategoryToCategory);
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true });

  if (error) throw error;
  return (data as DbProduct[]).map(dbProductToProduct);
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return dbProductToProduct(data as DbProduct);
}

/* ── Orders ────────────────────────────────────────────────── */

export interface DbOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  customer_city: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  items: unknown;
  created_at: string;
  updated_at: string;
}

export async function createOrder(order: {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  notes?: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: unknown;
}): Promise<DbOrder> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      id: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail,
      customer_address: order.customerAddress,
      customer_city: order.customerCity,
      notes: order.notes ?? null,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      status: 'pending',
      items: order.items,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DbOrder;
}

/* ── Admin: Product CRUD ───────────────────────────────────── */

export async function adminFetchAllProducts(): Promise<DbProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data as DbProduct[];
}

export async function adminUpsertProduct(product: Partial<DbProduct>): Promise<DbProduct> {
  const { data, error } = await supabase
    .from('products')
    .upsert(product)
    .select()
    .single();

  if (error) throw error;
  return data as DbProduct;
}

export async function adminDeleteProduct(id: number): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/* ── Admin: Order management ───────────────────────────────── */

export async function adminFetchOrders(): Promise<DbOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as DbOrder[];
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<DbOrder> {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbOrder;
}

/* ── Auth ──────────────────────────────────────────────────── */

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .single();
  if (error || !data) return false;
  return true;
}

/* ── Storage: Product Image Upload ────────────────────────── */

const STORAGE_BUCKET = 'product-images';

/**
 * Upload an image file to the Supabase Storage bucket.
 * Returns the public URL of the uploaded file.
 */
export async function uploadProductImage(
  file: File,
  productId?: number,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const folder = productId ? `products/${productId}` : 'products/unassigned';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

/**
 * Upload multiple image files at once. Returns array of public URLs.
 */
export async function uploadProductImages(
  files: File[],
  productId?: number,
): Promise<string[]> {
  const urls = await Promise.all(
    files.map((file) => uploadProductImage(file, productId)),
  );
  return urls;
}

/**
 * Delete an image from storage by its path.
 */
export async function deleteProductImage(path: string): Promise<void> {
  // Extract the path after the bucket name from a full URL or relative path
  const bucketIndex = path.indexOf(STORAGE_BUCKET);
  let filePath: string;
  if (bucketIndex !== -1) {
    filePath = path.slice(bucketIndex + STORAGE_BUCKET.length + 1);
  } else {
    filePath = path;
  }
  // Remove query params if present
  filePath = filePath.split('?')[0];

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);

  if (error) console.warn('Image delete failed:', error.message);
}

/**
 * List all images for a product from storage.
 */
export async function listProductImages(productId: number): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(`products/${productId}`);

  if (error || !data) return [];

  return data.map((file) => {
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(`products/${productId}/${file.name}`);
    return urlData.publicUrl;
  });
}

/* ── Reviews ────────────────────────────────────────────── */

export interface Review {
  id: string;
  product_id: number;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  title: string | null;
  comment: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

/**
 * Fetch approved reviews for a product.
 */
export async function fetchProductReviews(productId: number): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Review[];
}

/**
 * Submit a new review (anyone can submit, requires admin approval).
 */
export async function submitReview(review: {
  productId: number;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
}): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: review.productId,
      customer_name: review.customerName,
      customer_email: review.customerEmail ?? null,
      rating: review.rating,
      title: review.title ?? null,
      comment: review.comment,
      is_approved: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

/**
 * Admin: Fetch all reviews (including unapproved).
 */
export async function adminFetchAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Review[];
}

/**
 * Admin: Approve or reject a review.
 */
export async function adminUpdateReview(id: string, isApproved: boolean): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .update({ is_approved: isApproved })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

/**
 * Admin: Delete a review.
 */
export async function adminDeleteReview(id: string): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
