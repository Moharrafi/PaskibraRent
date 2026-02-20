export enum Category {
  FULLSET = 'fullset',
  ACCESSORIES = 'aksesoris'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  rentalDuration: number; // In days (e.g., 3 days)
  stock: number;
  description: string;
  imageUrls: string[]; // Changed from single imageUrl to array
  material: string;
  sizes: string[]; // e.g. ['S', 'M', 'L']
  packageContents: string[]; // e.g. ['Seragam', 'Topi', 'Aksesoris']
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  categoriesCount: number;
}

export interface ChartData {
  name: string;
  rentals: number;
  revenue: number;
}

export interface AppSettings {
  adminName: string;
  email: string;
  storeName: string;
  notifications: boolean;
}

export interface Booking {
  id: number;
  user_id: number;
  name: string;
  institution: string;
  phone: string;
  email: string;
  pickup_date: string;
  return_date: string;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: any[];
}