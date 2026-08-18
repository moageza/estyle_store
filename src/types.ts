export type Category =
  | 'tshirts'
  | 'shirts'
  | 'hoodies'
  | 'jeans'
  | 'dresses'
  | 'sneakers'
  | 'bags'
  | 'watches'
  | 'accessories';

export type Occasion =
  | 'casual'
  | 'formal'
  | 'party'
  | 'summer'
  | 'winter'
  | 'sport'
  | 'business'
  | 'evening';

export type Gender = 'men' | 'women' | 'unisex';

export type ColorName =
  | 'black'
  | 'white'
  | 'blue'
  | 'navy'
  | 'gray'
  | 'beige'
  | 'brown'
  | 'green'
  | 'red'
  | 'pink'
  | 'yellow'
  | 'gold'
  | 'silver';

export interface ColorOption {
  name: ColorName;
  hex: string;
}

export interface Product {
  id: number;
  name: { ar: string; en: string };
  category: Category;
  gender: Gender;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  description: { ar: string; en: string };
  colors: ColorOption[];
  sizes: string[];
  rating: number;
  reviews: number;
  tags: string[];
  occasion: Occasion[];
  isNew?: boolean;
  isTrending?: boolean;
  popularity: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
  size: string;
  color: ColorName;
}

export interface WishlistItem {
  productId: number;
}

export type Lang = 'ar' | 'en';

export interface OrderInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
}

export interface PlacedOrder {
  id: string;
  items: CartItem[];
  info: OrderInfo;
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
}
