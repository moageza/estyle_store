import type { Lang } from '@/types';

type Dict = Record<string, { ar: string; en: string }>;

export const t: Dict = {
  // Brand
  brandTagline: { ar: 'اكتشف ستايلك الجديد', en: 'Discover Your New Style' },

  // Nav
  navHome: { ar: 'الرئيسية', en: 'Home' },
  navShop: { ar: 'المتجر', en: 'Shop' },
  navAdvisor: { ar: 'مستشار الستايل', en: 'AI Style Advisor' },
  navWishlist: { ar: 'المفضلة', en: 'Wishlist' },
  navCart: { ar: 'السلة', en: 'Cart' },

  // Hero
  heroTitle: { ar: 'اكتشف ستايلك الجديد', en: 'Discover Your New Style' },
  heroSubtitle: {
    ar: 'تصفّح أحدث صيحات الموضة واصنع إطلالتك الخاصة من تشكيلة منتقاة بعناية للرجال والنساء.',
    en: 'Browse the latest fashion trends and craft your own look from a carefully curated collection for men and women.',
  },
  heroShopNow: { ar: 'تسوّق الآن', en: 'Shop Now' },
  heroDiscover: { ar: 'اكتشف الستايل', en: 'Discover Style' },

  // Categories
  categoriesTitle: { ar: 'تسوّق حسب الفئة', en: 'Shop by Category' },
  categoriesSubtitle: {
    ar: 'اختر من بين فئاتنا المختارة بعناية لإطلالة مكتملة.',
    en: 'Choose from our carefully curated categories for a complete look.',
  },
  catMen: { ar: 'رجال', en: 'Men' },
  catWomen: { ar: 'نساء', en: 'Women' },
  catShoes: { ar: 'أحذية', en: 'Shoes' },
  catAccessories: { ar: 'إكسسوار', en: 'Accessories' },
  shopAll: { ar: 'تسوّق الكل', en: 'Shop All' },

  // Sections
  newArrivals: { ar: 'وصل حديثاً', en: 'New Arrivals' },
  newArrivalsSub: { ar: 'أحدث القطع التي أضفناها لمتجرنا', en: 'The latest pieces we just added' },
  trending: { ar: 'الأكثر رواجاً', en: 'Trending Now' },
  trendingSub: { ar: 'القطع التي يحبها عملاؤنا هذا الأسبوع', en: 'What our customers love this week' },
  viewAll: { ar: 'عرض الكل', en: 'View All' },
  viewProduct: { ar: 'عرض المنتج', en: 'View Product' },

  // Product
  addToCart: { ar: 'أضف إلى السلة', en: 'Add to Cart' },
  addToWishlist: { ar: 'أضف إلى المفضلة', en: 'Add to Wishlist' },
  removeFromWishlist: { ar: 'إزالة من المفضلة', en: 'Remove from Wishlist' },
  outOfStock: { ar: 'غير متوفر', en: 'Out of Stock' },
  inStock: { ar: 'متوفر', en: 'In Stock' },
  description: { ar: 'الوصف', en: 'Description' },
  size: { ar: 'المقاس', en: 'Size' },
  color: { ar: 'اللون', en: 'Color' },
  quantity: { ar: 'الكمية', en: 'Quantity' },
  selectSize: { ar: 'اختر المقاس', en: 'Select Size' },
  selectColor: { ar: 'اختر اللون', en: 'Select Color' },
  reviews: { ar: 'تقييم', en: 'Reviews' },
  relatedProducts: { ar: 'منتجات مشابهة', en: 'Related Products' },
  freeShipping: { ar: 'شحن مجاني للطلبات فوق ٥٠٠', en: 'Free shipping over 500' },
  securePay: { ar: 'دفع آمن', en: 'Secure Checkout' },
  easyReturns: { ar: 'إرجاع سهل خلال ١٤ يوم', en: 'Easy 14-day returns' },

  // Shop
  shopTitle: { ar: 'المتجر', en: 'Shop' },
  shopSubtitle: { ar: 'كل ما تحتاجه لإطلالتك في مكان واحد', en: 'Everything you need for your look in one place' },
  search: { ar: 'ابحث عن منتج...', en: 'Search products...' },
  filters: { ar: 'الفلاتر', en: 'Filters' },
  category: { ar: 'الفئة', en: 'Category' },
  allCategories: { ar: 'كل الفئات', en: 'All Categories' },
  priceRange: { ar: 'نطاق السعر', en: 'Price Range' },
  allSizes: { ar: 'كل المقاسات', en: 'All Sizes' },
  allColors: { ar: 'كل الألوان', en: 'All Colors' },
  sortBy: { ar: 'ترتيب حسب', en: 'Sort By' },
  sortNewest: { ar: 'الأحدث', en: 'Newest' },
  sortPriceLow: { ar: 'السعر: الأقل أولاً', en: 'Price: Low to High' },
  sortPriceHigh: { ar: 'السعر: الأعلى أولاً', en: 'Price: High to Low' },
  sortPopular: { ar: 'الأكثر رواجاً', en: 'Most Popular' },
  noResults: { ar: 'لا توجد منتجات مطابقة', en: 'No matching products' },
  clearFilters: { ar: 'مسح الفلاتر', en: 'Clear Filters' },
  results: { ar: 'منتج', en: 'items' },
  apply: { ar: 'تطبيق', en: 'Apply' },
  close: { ar: 'إغلاق', en: 'Close' },

  // AI Advisor
  advisorTitle: { ar: 'مستشار الستايل الذكي', en: 'AI Style Advisor' },
  advisorSubtitle: {
    ar: 'صف ما تريد ارتداءه وسنختار لك إطلالة متكاملة من منتجاتنا.',
    en: 'Describe what you want to wear and we will curate a complete outfit from our products.',
  },
  advisorPlaceholder: {
    ar: 'مثال: أحتاج إطلالة كاجوال للصيف...',
    en: 'e.g. I need a casual outfit for summer...',
  },
  advisorGenerate: { ar: 'اقترح الإطلالة', en: 'Suggest Outfit' },
  advisorSuggestions: { ar: 'اقتراحات لك', en: 'Suggestions for you' },
  advisorEmpty: { ar: 'اكتب وصفاً لنقترح لك إطلالة', en: 'Type a description to get outfit suggestions' },
  advisorTry: { ar: 'جرّب مثالاً:', en: 'Try an example:' },
  advisorAddAll: { ar: 'أضف الكل للسلة', en: 'Add All to Cart' },
  advisorMatch: { ar: 'تطابق', en: 'match' },

  // Cart
  cartTitle: { ar: 'سلة التسوق', en: 'Shopping Cart' },
  cartEmpty: { ar: 'سلتك فارغة', en: 'Your cart is empty' },
  cartEmptyDesc: { ar: 'ابدأ التسوق وأضف منتجاتك المفضلة', en: 'Start shopping and add your favorite products' },
  continueShopping: { ar: 'متابعة التسوق', en: 'Continue Shopping' },
  orderSummary: { ar: 'ملخص الطلب', en: 'Order Summary' },
  subtotal: { ar: 'المجموع الفرعي', en: 'Subtotal' },
  shipping: { ar: 'الشحن', en: 'Shipping' },
  total: { ar: 'الإجمالي', en: 'Total' },
  free: { ar: 'مجاني', en: 'Free' },
  checkout: { ar: 'إتمام الشراء', en: 'Checkout' },
  remove: { ar: 'إزالة', en: 'Remove' },
  cartItem: { ar: 'منتج', en: 'item' },
  cartItems: { ar: 'منتجات', en: 'items' },

  // Wishlist
  wishlistTitle: { ar: 'قائمة المفضلة', en: 'My Wishlist' },
  wishlistEmpty: { ar: 'قائمة مفضلتك فارغة', en: 'Your wishlist is empty' },
  wishlistEmptyDesc: { ar: 'أضف المنتجات التي تحبها لتجدها هنا', en: 'Add products you love to find them here' },
  moveToCart: { ar: 'نقل إلى السلة', en: 'Move to Cart' },

  // Checkout
  checkoutTitle: { ar: 'إتمام الطلب', en: 'Checkout' },
  contactInfo: { ar: 'معلومات التواصل', en: 'Contact Information' },
  shippingAddress: { ar: 'عنوان الشحن', en: 'Shipping Address' },
  fullName: { ar: 'الاسم الكامل', en: 'Full Name' },
  phone: { ar: 'رقم الهاتف', en: 'Phone Number' },
  email: { ar: 'البريد الإلكتروني', en: 'Email' },
  address: { ar: 'العنوان', en: 'Address' },
  city: { ar: 'المدينة', en: 'City' },
  orderNotes: { ar: 'ملاحظات الطلب (اختياري)', en: 'Order Notes (optional)' },
  placeOrder: { ar: 'تأكيد الطلب', en: 'Place Order' },
  paymentNote: { ar: 'الدفع عند الاستلام متاح حالياً', en: 'Cash on Delivery currently available' },
  required: { ar: 'هذا الحقل مطلوب', en: 'This field is required' },
  invalidEmail: { ar: 'بريد إلكتروني غير صحيح', en: 'Invalid email' },
  invalidPhone: { ar: 'رقم هاتف غير صحيح', en: 'Invalid phone' },

  // Confirmation
  orderConfirmed: { ar: 'تم تأكيد طلبك', en: 'Order Confirmed' },
  orderThanks: {
    ar: 'شكراً لك! تم استلام طلبك بنجاح وسنتواصل معك قريباً.',
    en: 'Thank you! Your order has been received and we will contact you soon.',
  },
  orderNumber: { ar: 'رقم الطلب', en: 'Order Number' },
  backHome: { ar: 'العودة للرئيسية', en: 'Back to Home' },

  // Footer
  footerAbout: {
    ar: 'eStyle هو وجهتك للأزياء العصرية. نختار لك أرقى القطع لتصنع ستايلك الخاص.',
    en: 'eStyle is your destination for modern fashion. We curate the finest pieces to craft your style.',
  },
  footerShop: { ar: 'تسوّق', en: 'Shop' },
  footerHelp: { ar: 'المساعدة', en: 'Help' },
  footerContact: { ar: 'تواصل معنا', en: 'Contact' },
  footerAbout2: { ar: 'من نحن', en: 'About Us' },
  footerShipping: { ar: 'الشحن والإرجاع', en: 'Shipping & Returns' },
  footerSizes: { ar: 'دليل المقاسات', en: 'Size Guide' },
  footerFaq: { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  footerRights: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  footerNewsletter: { ar: 'النشرة البريدية', en: 'Newsletter' },
  footerNewsSub: {
    ar: 'اشترك ليصلك جديدنا وعروضنا الحصرية.',
    en: 'Subscribe to get our latest drops and exclusive offers.',
  },
  subscribe: { ar: 'اشترك', en: 'Subscribe' },
  emailPlaceholder: { ar: 'بريدك الإلكتروني', en: 'Your email' },

  // Misc
  currency: { ar: 'ر.س', en: 'SAR' },
  off: { ar: 'خصم', en: 'OFF' },
  new: { ar: 'جديد', en: 'NEW' },
  sale: { ar: 'تخفيض', en: 'SALE' },
  trending_: { ar: 'رائج', en: 'HOT' },
  addedToCart: { ar: 'تمت الإضافة إلى السلة', en: 'Added to cart' },
  addedToWishlist: { ar: 'تمت الإضافة إلى المفضلة', en: 'Added to wishlist' },
  removedFromWishlist: { ar: 'تمت الإزالة من المفضلة', en: 'Removed from wishlist' },
  selectSizeFirst: { ar: 'يرجى اختيار المقاس', en: 'Please select a size' },
  selectColorFirst: { ar: 'يرجى اختيار اللون', en: 'Please select a color' },

  // Color names
  colorBlack: { ar: 'أسود', en: 'Black' },
  colorWhite: { ar: 'أبيض', en: 'White' },
  colorBlue: { ar: 'أزرق', en: 'Blue' },
  colorNavy: { ar: 'كحلي', en: 'Navy' },
  colorGray: { ar: 'رمادي', en: 'Gray' },
  colorBeige: { ar: 'بيج', en: 'Beige' },
  colorBrown: { ar: 'بني', en: 'Brown' },
  colorGreen: { ar: 'أخضر', en: 'Green' },
  colorRed: { ar: 'أحمر', en: 'Red' },
  colorPink: { ar: 'وردي', en: 'Pink' },
  colorYellow: { ar: 'أصفر', en: 'Yellow' },
  colorGold: { ar: 'ذهبي', en: 'Gold' },
  colorSilver: { ar: 'فضي', en: 'Silver' },
};

export const tr = (key: string, lang: Lang): string => {
  const entry = t[key];
  if (!entry) return key;
  return entry[lang];
};
