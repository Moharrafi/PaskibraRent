import axios from 'axios';
import { Product, GalleryItem } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token if available (reusing main app token logic if needed, or admin specific)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Use standard token if integrated
    // Or if using the simple admin auth from storageService, we might not have a real token yet.
    // For now, we assume the API is open or we use the 'token' from localStorage if it exists.
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const apiService = {
    // Products
    getProducts: async (): Promise<Product[]> => {
        const response = await api.get('/products');
        return response.data;
    },
    createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
        const response = await api.post('/products', product);
        return response.data;
    },
    updateProduct: async (product: Product): Promise<Product> => {
        const response = await api.put(`/products/${product.id}`, product);
        return response.data;
    },
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },

    // Gallery
    getGallery: async (): Promise<GalleryItem[]> => {
        const response = await api.get('/gallery');
        return response.data;
    },
    createGalleryItem: async (item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> => {
        const response = await api.post('/gallery', item);
        return response.data;
    },
    updateGalleryItem: async (item: GalleryItem): Promise<GalleryItem> => {
        const response = await api.put(`/gallery/${item.id}`, item);
        return response.data;
    },
    deleteGalleryItem: async (id: string): Promise<void> => {
        await api.delete(`/gallery/${id}`);
    },

    // Stats (Aggregated from products for now)
    getStats: async () => {
        const products = await apiService.getProducts();
        return {
            totalProducts: products.length,
            totalValue: products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0),
            lowStockCount: products.filter(p => p.stock < 10).length,
            categoriesCount: new Set(products.map(p => p.category)).size
        };
    },

    getRevenueStats: async (year?: number) => {
        const response = await api.get('/bookings/stats/revenue', { params: { year } });
        return response.data;
    },

    // Broadcast
    sendBroadcast: async (subject: string, message: string, imageUrl?: string): Promise<any> => {
        const response = await api.post('/newsletter/broadcast', { subject, message, imageUrl });
        return response.data;
    }
};
