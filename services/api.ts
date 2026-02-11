
import axios from 'axios';

// Create an axios instance
// Create an axios instance
const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, ''), // Remove trailing slash
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        // No auto-login for register anymore
        return response.data;
    },

    verifyEmail: async (token) => {
        const response = await api.post('/auth/verify', { token });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            // Token invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        }
    },
};

export const cartService = {
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },
    syncCart: async (items: any[]) => {
        const response = await api.post('/cart/sync', { items });
        return response.data;
    },
    addItem: async (id: string, quantity: number, rentalDays: number) => {
        const response = await api.post('/cart/item', { id, quantity, rentalDays });
        return response.data;
    },
    removeItem: async (id: string) => {
        const response = await api.delete(`/cart/item/${id}`);
        return response.data;
    }
};

export const productService = {
    getProducts: async () => {
        const response = await api.get('/products');
        // Map backend snake_case/different names to frontend Costume interface
        return response.data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            category: item.category,
            price: Number(item.price),
            // Use first image from array or fallback
            image: (item.imageUrls && item.imageUrls.length > 0) ? item.imageUrls[0] : (item.image_urls ? JSON.parse(item.image_urls)[0] : '/images/placeholder.jpg'),
            images: item.imageUrls || (item.image_urls ? JSON.parse(item.image_urls) : []),
            description: item.description,
            tags: item.tags || [],
            availableStock: item.stock,
            material: item.material,
            sizes: item.sizes || [],
            includedItems: item.packageContents || []
        }));
    },
    getProductById: async (id: string) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    }
};

export const galleryService = {
    getGallery: async () => {
        const response = await api.get('/gallery');
        return response.data;
    }
};

export const newsletterService = {
    subscribe: async (email: string) => {
        const response = await api.post('/newsletter', { email });
        return response.data;
    }
};

export default api;
