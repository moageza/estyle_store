import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Search, Upload, ImagePlus, Loader2, Check } from 'lucide-react';
import {
  adminFetchAllProducts,
  adminUpsertProduct,
  adminDeleteProduct,
  uploadProductImage,
  uploadProductImages,
  deleteProductImage,
} from '@/lib/api';
import type { DbProduct } from '@/lib/api';
import { CATEGORIES } from '@/data/products';

const EMPTY_PRODUCT = {
  name_ar: '',
  name_en: '',
  category_key: 'tshirts',
  gender: 'unisex',
  price: 0,
  old_price: null as number | null,
  image: '',
  gallery: [] as string[],
  description_ar: '',
  description_en: '',
  colors: '[]',
  sizes: [] as string[],
  rating: 0,
  reviews: 0,
  tags: [] as string[],
  occasion: [] as string[],
  is_new: false,
  is_trending: false,
  popularity: 0,
  is_active: true,
  stock: 0,
};

/* ── Image Upload Sub-Component ─────────────────────────── */

function ImageUploader({
  label,
  images,
  onUpload,
  onRemove,
  multiple = false,
  uploading,
}: {
  label: string;
  images: string[];
  onUpload: (files: FileList) => void;
  onRemove: (index: number) => void;
  multiple?: boolean;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-soft">{label}</label>

      {/* Existing images */}
      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-cream-dark">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-cream-dark bg-cream-dark/30 px-4 py-4 text-sm text-ink-muted transition hover:border-accent hover:bg-accent/5 hover:text-accent disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            {multiple ? <ImagePlus size={16} /> : <Upload size={16} />}
            {multiple ? 'Upload Images' : 'Upload Image'}
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
          }
          e.target.value = '';
        }}
        className="hidden"
      />
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */

export function ProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [colorsInput, setColorsInput] = useState('');

  const load = async () => {
    try {
      const data = await adminFetchAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name_en.toLowerCase().includes(search.toLowerCase()) ||
      p.name_ar.includes(search) ||
      p.category_key?.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_PRODUCT);
    setColorsInput('');
    setShowForm(true);
  };

  const openEdit = (p: DbProduct) => {
    setEditingId(p.id);
    setForm({
      name_ar: p.name_ar,
      name_en: p.name_en,
      category_key: p.category_key ?? 'tshirts',
      gender: p.gender,
      price: p.price,
      old_price: p.old_price,
      image: p.image,
      gallery: p.gallery ?? [],
      description_ar: p.description_ar,
      description_en: p.description_en,
      colors: JSON.stringify(p.colors ?? []),
      sizes: p.sizes ?? [],
      rating: p.rating,
      reviews: p.reviews,
      tags: p.tags ?? [],
      occasion: p.occasion ?? [],
      is_new: p.is_new,
      is_trending: p.is_trending,
      popularity: p.popularity,
      is_active: p.is_active,
      stock: p.stock,
    });
    // Build colors string from array
    const colorsArr = (p.colors as { name: string; hex: string }[]) ?? [];
    setColorsInput(colorsArr.map((c) => `${c.name}:${c.hex}`).join(', '));
    setShowForm(true);
  };

  /* ── Image Upload Handlers ─────────────────────────────── */

  const handleMainImageUpload = useCallback(
    async (files: FileList) => {
      setUploadingImage(true);
      try {
        const file = files[0];
        const url = await uploadProductImage(file, editingId ?? undefined);
        setForm((f) => ({ ...f, image: url }));
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Image upload failed. Make sure the storage bucket is configured.');
      } finally {
        setUploadingImage(false);
      }
    },
    [editingId],
  );

  const handleGalleryUpload = useCallback(
    async (files: FileList) => {
      setUploadingGallery(true);
      try {
        const urls = await uploadProductImages(Array.from(files), editingId ?? undefined);
        setForm((f) => ({ ...f, gallery: [...f.gallery, ...urls] }));
      } catch (err) {
        console.error('Gallery upload failed:', err);
        alert('Gallery upload failed. Make sure the storage bucket is configured.');
      } finally {
        setUploadingGallery(false);
      }
    },
    [editingId],
  );

  const handleRemoveMainImage = useCallback(async () => {
    const url = form.image;
    setForm((f) => ({ ...f, image: '' }));
    if (url && !url.startsWith('http')) {
      await deleteProductImage(url);
    }
  }, [form.image]);

  const handleRemoveGalleryImage = useCallback(
    async (index: number) => {
      const url = form.gallery[index];
      setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }));
      if (url && !url.startsWith('http')) {
        await deleteProductImage(url);
      }
    },
    [form.gallery],
  );

  /* ── Form Submit ───────────────────────────────────────── */

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Parse colors from input string
      let colors: { name: string; hex: string }[] = [];
      try {
        colors = JSON.parse(form.colors as unknown as string);
      } catch {
        // Try parsing from comma-separated input like "black:#1a1a1a, white:#fff"
        colors = colorsInput
          .split(',')
          .map((pair) => {
            const [name, hex] = pair.trim().split(':');
            if (name && hex) return { name: name.trim(), hex: hex.trim() };
            return null;
          })
          .filter(Boolean) as { name: string; hex: string }[];
      }

      const payload: Partial<DbProduct> = {
        name_ar: form.name_ar,
        name_en: form.name_en,
        category_key: form.category_key,
        gender: form.gender,
        price: form.price,
        old_price: form.old_price,
        image: form.image,
        gallery: form.gallery,
        description_ar: form.description_ar,
        description_en: form.description_en,
        colors: colors as unknown as DbProduct['colors'],
        sizes: form.sizes,
        rating: form.rating,
        reviews: form.reviews,
        tags: form.tags,
        occasion: form.occasion,
        is_new: form.is_new,
        is_trending: form.is_trending,
        popularity: form.popularity,
        is_active: form.is_active,
        stock: form.stock,
      };
      if (editingId) payload.id = editingId;
      await adminUpsertProduct(payload);
      await load();
      setShowForm(false);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminDeleteProduct(id);
      await load();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-dark border-t-accent" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-2xl font-bold text-ink">Products ({products.length})</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="rounded-full border border-cream-dark bg-white py-2 pe-4 ps-9 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-accent"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-cream-dark bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-dark text-left text-xs text-ink-muted">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-cream-dark last:border-0 hover:bg-cream-dark/30">
                  <td className="px-4 py-3">
                    <img src={p.image} alt="" className="h-12 w-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{p.name_en}</p>
                    <p className="text-xs text-ink-muted">{p.name_ar}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft capitalize">{p.category_key}</td>
                  <td className="px-4 py-3 font-medium text-ink">{p.price} SAR</td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= 10 ? 'text-error font-medium' : 'text-ink-soft'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:bg-cream-dark hover:text-ink"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:bg-error/10 hover:text-error"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-ink-muted">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-[5vh] backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-cream-dark bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-cream-dark px-6 py-4">
              <h3 className="font-serif text-lg font-semibold text-ink">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-ink-muted hover:text-ink">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="max-h-[80vh] overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* ── Images Section ───────────────────── */}
                <div className="sm:col-span-2 rounded-2xl border border-cream-dark bg-cream-card p-4">
                  <h4 className="mb-3 text-sm font-semibold text-ink flex items-center gap-2">
                    <ImagePlus size={16} className="text-accent" />
                    Product Images
                  </h4>

                  {/* Main Image */}
                  <div className="mb-4">
                    <ImageUploader
                      label="Main Image *"
                      images={form.image ? [form.image] : []}
                      onUpload={handleMainImageUpload}
                      onRemove={handleRemoveMainImage}
                      uploading={uploadingImage}
                    />
                    <p className="mt-1 text-[11px] text-ink-muted">
                      The primary image shown on product cards and product page.
                    </p>
                  </div>

                  {/* Gallery Images */}
                  <ImageUploader
                    label="Gallery Images (optional)"
                    images={form.gallery}
                    onUpload={handleGalleryUpload}
                    onRemove={handleRemoveGalleryImage}
                    multiple
                    uploading={uploadingGallery}
                  />
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Additional images for the product detail page gallery. You can select multiple files at once.
                  </p>

                  {/* Manual URL fallback */}
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-ink-muted hover:text-ink">
                      Or paste image URLs manually
                    </summary>
                    <div className="mt-2 space-y-2">
                      <input
                        value={form.image}
                        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                        className="w-full rounded-xl border border-cream-dark px-4 py-2 text-xs outline-none focus:border-accent"
                        dir="ltr"
                        placeholder="Main image URL (https://...)"
                      />
                      <textarea
                        value={form.gallery.join('\n')}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            gallery: e.target.value.split('\n').filter((u) => u.trim()),
                          }))
                        }
                        rows={3}
                        className="w-full rounded-xl border border-cream-dark px-4 py-2 text-xs outline-none focus:border-accent"
                        dir="ltr"
                        placeholder="Gallery URLs (one per line)"
                      />
                    </div>
                  </details>
                </div>

                {/* Name EN */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Name (English)</label>
                  <input
                    required
                    value={form.name_en}
                    onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>

                {/* Name AR */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Name (Arabic)</label>
                  <input
                    required
                    value={form.name_ar}
                    onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                    dir="rtl"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Category</label>
                  <select
                    value={form.category_key}
                    onChange={(e) => setForm((f) => ({ ...f, category_key: e.target.value }))}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Price (SAR)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>

                {/* Old Price */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Old Price (optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.old_price ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, old_price: e.target.value ? Number(e.target.value) : null }))
                    }
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>

                {/* Popularity */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Popularity (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.popularity}
                    onChange={(e) => setForm((f) => ({ ...f, popularity: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>

                {/* Colors */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-ink-soft">
                    Colors (name:hex, comma separated)
                  </label>
                  <input
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                    dir="ltr"
                    placeholder="black:#1a1a1a, white:#f7f5f2, navy:#1f2a44"
                  />
                </div>

                {/* Description EN */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Description (English)</label>
                  <textarea
                    value={form.description_en}
                    onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>

                {/* Description AR */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Description (Arabic)</label>
                  <textarea
                    value={form.description_ar}
                    onChange={(e) => setForm((f) => ({ ...f, description_ar: e.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                    dir="rtl"
                  />
                </div>

                {/* Sizes */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Sizes (comma separated)</label>
                  <input
                    value={form.sizes.join(', ')}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sizes: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                    dir="ltr"
                    placeholder="S, M, L, XL"
                  />
                </div>

                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Tags (comma separated)</label>
                  <input
                    value={form.tags.join(', ')}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tags: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                    dir="ltr"
                    placeholder="cotton, basic, everyday"
                  />
                </div>

                {/* Occasions */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Occasions (comma separated)</label>
                  <input
                    value={form.occasion.join(', ')}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        occasion: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                    dir="ltr"
                    placeholder="casual, summer, winter"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                      className="accent-accent"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={form.is_new}
                      onChange={(e) => setForm((f) => ({ ...f, is_new: e.target.checked }))}
                      className="accent-accent"
                    />
                    New
                  </label>
                  <label className="flex items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={form.is_trending}
                      onChange={(e) => setForm((f) => ({ ...f, is_trending: e.target.checked }))}
                      className="accent-accent"
                    />
                    Trending
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-cream-dark px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent disabled:opacity-60"
                >
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : editingId ? (
                    <>
                      <Check size={16} />
                      Update
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
