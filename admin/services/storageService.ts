import { Product, Category, ChartData, AppSettings, GalleryItem } from '../types';

const STORAGE_KEY = 'paskibrarent_catalog';
const GALLERY_KEY = 'paskibrarent_gallery';
const SETTINGS_KEY = 'paskibrarent_settings';
const AUTH_KEY = 'paskibrarent_auth_session';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Seragam ARJUNA (Biru)',
    category: Category.UNIFORM,
    price: 425000,
    rentalDuration: 3,
    stock: 15,
    description: 'Seragam ARJUNA dengan kombinasi warna biru dan emas yang elegan. Dirancang untuk pasukan yang ingin tampil beda dan memukau. Dirancang khusus untuk memberikan kenyamanan maksimal dan tampilan yang berwibawa di lapangan.',
    imageUrls: [
      'https://images.unsplash.com/photo-1542596768-5d1d21f1cfb6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
    ],
    material: 'Drill Castillo High Quality',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    packageContents: ['Seragam Parade Biru', 'Topi Variasi', 'Aksesoris Bahu Emas']
  },
  {
    id: '2',
    name: 'Sepatu PDH Kilap Premium',
    category: Category.ACCESSORIES,
    price: 50000,
    rentalDuration: 3,
    stock: 50,
    description: 'Sepatu pantofel hitam mengkilap untuk kegiatan dinas harian atau upacara. Sol karet anti slip dan bahan kulit sintetis premium.',
    imageUrls: [
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1000&auto=format&fit=crop'
    ],
    material: 'Kulit Sintetis Premium',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    packageContents: ['Sepasang Sepatu', 'Kaos Kaki Hitam']
  },
  {
    id: '3',
    name: 'Bendera Merah Putih (Sutra)',
    category: Category.FLAGS,
    price: 75000,
    rentalDuration: 1,
    stock: 5,
    description: 'Bendera duplikat pusaka bahan sutra halus. Cocok untuk pengibaran acara besar. Warna tahan lama dan tidak mudah luntur.',
    imageUrls: [
      'https://images.unsplash.com/photo-1509255768285-1d01f9d51199?q=80&w=1000&auto=format&fit=crop'
    ],
    material: 'Sutra Asli',
    sizes: ['Standar Istana'],
    packageContents: ['Bendera', 'Tas Penyimpanan']
  }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: '1',
    title: 'Hormat Sang Merah Putih',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1000&auto=format&fit=crop',
    date: '2023-08-17',
    location: 'Istana Negara, Jakarta'
  },
  {
    id: '2',
    title: 'Pasukan Pengibar',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000&auto=format&fit=crop',
    date: '2023-11-10',
    location: 'GOR Soemantri, Kuningan'
  },
  {
    id: '3',
    title: 'Drumband Korps',
    imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e2729?q=80&w=1000&auto=format&fit=crop',
    date: '2024-01-05',
    location: 'SMAN 3 Depok'
  }
];

const DEFAULT_SETTINGS: AppSettings = {
  adminName: 'Admin Paskibra',
  email: 'admin@paskibrarent.id',
  storeName: 'PaskibraRent Pusat',
  notifications: true
};

// --- AUTHENTICATION SERVICE ---

export const checkAuth = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const login = (email: string, password: string): boolean => {
  // Simple mock authentication
  if (password === 'admin123') {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

// --- PRODUCT SERVICE ---

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((p: any) => ({
      ...p,
      imageUrls: p.imageUrls || (p.imageUrl ? [p.imageUrl] : [])
    }));
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
};

export const saveProduct = (product: Product): Product[] => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  
  let newProducts;
  if (index >= 0) {
    newProducts = [...products];
    newProducts[index] = product;
  } else {
    newProducts = [product, ...products];
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
  return newProducts;
};

export const deleteProduct = (id: string): Product[] => {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return products;
};

// --- GALLERY SERVICE ---

export const getGallery = (): GalleryItem[] => {
  const stored = localStorage.getItem(GALLERY_KEY);
  if (!stored) {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(DEFAULT_GALLERY));
    return DEFAULT_GALLERY;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_GALLERY;
  }
};

export const saveGalleryItem = (item: GalleryItem): GalleryItem[] => {
  const items = getGallery();
  const index = items.findIndex(i => i.id === item.id);
  
  let newItems;
  if (index >= 0) {
    newItems = [...items];
    newItems[index] = item;
  } else {
    newItems = [item, ...items];
  }
  
  localStorage.setItem(GALLERY_KEY, JSON.stringify(newItems));
  return newItems;
};

export const deleteGalleryItem = (id: string): GalleryItem[] => {
  const items = getGallery().filter(i => i.id !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
  return items;
};

// --- STATS & OTHERS ---

export const getStats = (products: Product[]) => {
  return {
    totalProducts: products.length,
    totalValue: products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0),
    lowStockCount: products.filter(p => p.stock < 10).length,
    categoriesCount: new Set(products.map(p => p.category)).size
  };
};

export const getRevenueHistory = (): ChartData[] => {
  return [
    { name: 'Jan', rentals: 25, revenue: 3800000 },
    { name: 'Feb', rentals: 32, revenue: 5100000 },
    { name: 'Mar', rentals: 28, revenue: 4500000 },
    { name: 'Apr', rentals: 45, revenue: 7800000 },
    { name: 'Mei', rentals: 55, revenue: 9500000 },
    { name: 'Jun', rentals: 42, revenue: 7200000 },
    { name: 'Jul', rentals: 68, revenue: 12500000 },
    { name: 'Agu', rentals: 120, revenue: 24500000 },
    { name: 'Sep', rentals: 48, revenue: 8400000 },
    { name: 'Okt', rentals: 52, revenue: 9100000 },
    { name: 'Nov', rentals: 65, revenue: 11500000 },
    { name: 'Des', rentals: 85, revenue: 15800000 },
  ];
};

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) {
    return DEFAULT_SETTINGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings): AppSettings => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
};

export const resetData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(GALLERY_KEY);
  window.location.reload();
};