export interface Costume {
  id: string;
  name: string;
  category: 'pria' | 'wanita' | 'aksesoris' | 'fullset';
  price: number;
  image: string;
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
}

export type ViewState = 'HOME' | 'CATALOG' | 'CART' | 'SUCCESS' | 'GALLERY';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}