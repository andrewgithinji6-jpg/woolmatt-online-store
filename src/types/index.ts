export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  quantity?: number;
  discount?: number;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}