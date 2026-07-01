export interface Product {
  id: string;
  name: string;
  englishName: string;
  price: number;
  currency: string;
  ingredients: string;
  benefits: string;
  imageUrl: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
