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
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle 401/403 errors (Invalid token or not an admin)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Force logout if access is denied so they can sign in properly
            const isAuth = localStorage.getItem('paskibrarent_auth_session');
            if (isAuth) {
                localStorage.removeItem('paskibrarent_auth_session');
                // We keep 'token' if we want main app to stay logged in, but since we use same token key, 
                // it's safer to clear it if it's invalid or force a reload to let AdminApp catch it.
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export const apiService = {
    // Auth
    login: async (email: string, password: string): Promise<{ token: string, user: any }> => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // Products
    getProducts: async (): Promise<Product[]> => {
        const response = await api.get('/products');
        return response.data;
    },
    createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
        const response = await api.post('/products', product);
        return response.data;
    },

    // Bookings
    getAllBookings: async (): Promise<any[]> => {
        const response = await api.get('/bookings/all');
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
