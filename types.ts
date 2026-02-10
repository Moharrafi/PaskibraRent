export interface Costume {
  id: string;
  name: string;
  category: 'fullset' | 'aksesoris';
  price: number;
  image: string;
  images: string[];
  description: string;
  tags: string[];
  availableStock: number;
  material: string;
  sizes: string[];
  includedItems: string[];
}

export interface CartItem extends Costume {
  quantity: number;
  rentalDays: number;
}

export interface BookingDetails {
  name: string;
  institution: string;
  phone: string;
  pickupDate: string;
  returnDate: string;
  email: string;
  rentalDuration: number;
  totalPrice: number;
  items: CartItem[];
}

export interface User {
  id?: string | number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  created_at?: string;
}

export type ViewState = 'HOME' | 'CATALOG' | 'CART' | 'SUCCESS' | 'GALLERY';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}