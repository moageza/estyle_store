import { PRODUCTS } from '@/data/products';
import type { Occasion, Product } from '@/types';

interface KeywordMap {
  occasions: Occasion[];
  categories: string[];
  colors: string[];
  genders: ('men' | 'women')[];
  tags: string[];
}

const OCCASION_WORDS: Record<Occasion, string[]> = {
  casual: ['casual', 'كاجوال', 'يومي', 'عادي', 'everyday', 'daily', 'راحة'],
  formal: ['formal', 'رسمي', 'رسمية', 'official', 'ceremony', 'حفل رسمي'],
  party: ['party', 'حفلة', 'حفلات', 'سهره', 'سهرات', 'celebration', 'مناسبة'],
  summer: ['summer', 'صيف', 'صيفي', 'hot', 'heat', 'beach', 'plage', 'شاطئ'],
  winter: ['winter', 'شتاء', 'شتوي', 'cold', 'بارد', 'دافئ', 'warm'],
  sport: ['sport', 'رياضي', 'رياضية', 'gym', 'workout', 'training', 'running', 'جري'],
  business: ['business', 'عمل', 'مكتب', 'office', 'work', 'وظيفة'],
  evening: ['evening', 'سهرة', 'مساء', 'night', 'nightout', 'dinner', 'عشاء'],
};

const COLOR_WORDS: Record<string, string[]> = {
  black: ['black', 'أسود', 'سوداء', 'اسود'],
  white: ['white', 'أبيض', 'بيضاء', 'ابيض'],
  blue: ['blue', 'أزرق', 'زرقاء', 'ازرق'],
  navy: ['navy', 'كحلي', 'نيلي'],
  gray: ['gray', 'grey', 'رمادي', 'رمادية'],
  beige: ['beige', 'بيج', 'بيم'],
  brown: ['brown', 'بني', 'بنية'],
  green: ['green', 'أخضر', 'خضراء', 'اخضر'],
  red: ['red', 'أحمر', 'حمراء', 'احمر'],
  pink: ['pink', 'وردي', 'زهر'],
  gold: ['gold', 'ذهبي', 'ذهب'],
  silver: ['silver', 'فضي', 'فضة'],
};

const CATEGORY_WORDS: Record<string, string[]> = {
  tshirts: ['t-shirt', 'tshirt', 'تيشيرت', 'ت_شيرت', 'تي', 'كناكة'],
  shirts: ['shirt', 'قميص', 'قمصان', 'بدلة'],
  hoodies: ['hoodie', 'هودي', 'كاب', 'جاكيت', 'jacket', 'سترة', 'سترة'],
  jeans: ['jeans', 'جينز', 'بنطال', 'سروال', 'pants', 'trouser', 'denim'],
  dresses: ['dress', 'فستان', 'فساتين', 'عباية', 'gown'],
  sneakers: ['shoes', 'sneakers', 'حذاء', 'أحذية', 'boot', 'بوت', 'صندل', 'sandals'],
  bags: ['bag', 'handbag', 'حقيبة', 'حقائب', 'شنطة'],
  watches: ['watch', 'ساعة', 'ساعات'],
  accessories: ['accessory', 'accessories', 'إكسسوار', 'اكسسوار', 'نظارة', 'sunglasses', 'glasses'],
};

const GENDER_WORDS = {
  men: ['men', 'man', 'mens', 'رجال', 'رجل', 'ولد', 'شاب'],
  women: ['women', 'woman', 'womens', 'نساء', 'نسائية', 'بنت', 'امراة', 'سيدة'],
};

export interface ScoredProduct {
  product: Product;
  score: number;
  reasons: string[];
}

export function analyzeQuery(query: string): KeywordMap {
  const q = query.toLowerCase();
  const result: KeywordMap = { occasions: [], categories: [], colors: [], genders: [], tags: [] };

  (Object.keys(OCCASION_WORDS) as Occasion[]).forEach((occ) => {
    if (OCCASION_WORDS[occ].some((w) => q.includes(w.toLowerCase()))) result.occasions.push(occ);
  });
  Object.entries(CATEGORY_WORDS).forEach(([cat, words]) => {
    if (words.some((w) => q.includes(w.toLowerCase()))) result.categories.push(cat);
  });
  Object.entries(COLOR_WORDS).forEach(([color, words]) => {
    if (words.some((w) => q.includes(w.toLowerCase()))) result.colors.push(color);
  });
  (Object.keys(GENDER_WORDS) as ('men' | 'women')[]).forEach((g) => {
    if (GENDER_WORDS[g].some((w) => q.includes(w.toLowerCase()))) result.genders.push(g);
  });

  // tags from free text
  const tagHints = ['elegant', 'أنيق', 'minimal', 'بسيط', 'classic', 'كلاسيك', 'sport', 'رياضي',
    'luxury', 'فاخر', 'premium', 'light', 'خفيف', 'warm', 'دافئ'];
  tagHints.forEach((tag) => {
    if (q.includes(tag.toLowerCase())) result.tags.push(tag.toLowerCase());
  });

  return result;
}

export function recommendOutfits(query: string, limit = 4): ScoredProduct[] {
  const map = analyzeQuery(query);
  const scored: ScoredProduct[] = PRODUCTS.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    // Occasion match (strong)
    map.occasions.forEach((occ) => {
      if (product.occasion.includes(occ)) {
        score += 30;
        reasons.push(occ);
      }
    });

    // Category match
    if (map.categories.includes(product.category)) {
      score += 25;
      reasons.push(product.category);
    }

    // Color match
    map.colors.forEach((color) => {
      if (product.colors.some((c) => c.name === color)) {
        score += 20;
        reasons.push(color);
      }
    });

    // Gender match
    if (map.genders.length > 0) {
      if (map.genders.includes(product.gender as 'men' | 'women') || product.gender === 'unisex') {
        score += 15;
      } else {
        score -= 10;
      }
    }

    // Tag match
    map.tags.forEach((tag) => {
      if (product.tags.some((pt) => pt.toLowerCase().includes(tag) || tag.includes(pt.toLowerCase()))) {
        score += 10;
      }
    });

    // Base popularity boost so good items surface
    score += product.popularity * 0.05;
    if (product.isTrending) score += 3;
    if (product.isNew) score += 2;

    return { product, score, reasons };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Try to build a varied outfit: different categories preferred
  if (map.categories.length === 0 && scored.length > 1) {
    const picked: ScoredProduct[] = [];
    const usedCategories = new Set<string>();
    for (const s of scored) {
      if (!usedCategories.has(s.product.category)) {
        picked.push(s);
        usedCategories.add(s.product.category);
      }
      if (picked.length >= limit) break;
    }
    // fill remaining from top scored
    for (const s of scored) {
      if (picked.length >= limit) break;
      if (!picked.includes(s)) picked.push(s);
    }
    return picked.slice(0, limit);
  }

  return scored.slice(0, limit);
}
