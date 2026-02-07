const axios = require('axios');
const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const API_URL = 'http://localhost:5001/api';

async function testCart() {
    let connection;
    try {
        console.log('Testing Cart flow...');

        // 0. Check if route exists
        try {
            await axios.get(`${API_URL}/cart`);
        } catch (e) {
            if (e.response && e.response.status === 404) {
                console.error('CRITICAL: /api/cart route NOT FOUND. Server might need restart.');
                return;
            }
            if (e.response && e.response.status === 401) {
                console.log('Route /api/cart exists (got 401 as expected).');
            } else {
                console.log(`Route check returned ${e.response ? e.response.status : e.message}`);
                // Dump HTML if it's HTML
                if (e.response && typeof e.response.data === 'string' && e.response.data.includes('<!DOCTYPE html>')) {
                    console.error('HTML Error during route check:', e.response.data.substring(0, 500));
                }
            }
        }

        // 0. Setup DB Connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        // 1. Create Test User
        const tempEmail = `test${Date.now()}@example.com`;
        const tempPass = 'password123';

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPass, salt);

        console.log(`Inserting temp user directly: ${tempEmail}`);
        await connection.query(
            'INSERT INTO users (name, email, password, is_verified) VALUES (?, ?, ?, 1)',
            ['Test Cart', tempEmail, hashedPassword]
        );

        // 2. Login
        console.log('Logging in temp user...');
        const login = await axios.post(`${API_URL}/auth/login`, {
            email: tempEmail,
            password: tempPass
        });
        const token = login.data.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        // 3. Add Item
        console.log('Adding item to cart...');
        try {
            await axios.post(`${API_URL}/cart/item`, {
                id: '1', quantity: 1, rentalDays: 3
            }, { headers: { Authorization: `Bearer ${token}` } });
            console.log('Item added.');
        } catch (e) {
            console.error('Add Item Failed:', e.message);
            if (e.response) {
                console.log('Status:', e.response.status);
                console.log('Data:', typeof e.response.data === 'string' ? e.response.data.substring(0, 200) : e.response.data);
            }
            return;
        }

        // 4. Get Cart
        console.log('Fetching cart...');
        const cart = await axios.get(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Cart Items:', cart.data);

        if (cart.data.length > 0 && cart.data[0].item_id === '1') {
            console.log('SUCCESS: Cart persistence works!');
        } else {
            console.log('FAILURE: Cart is empty.');
        }

    } catch (err) {
        console.error('Test Failed:', err.response ? err.response.data : err.message);
    } finally {
        if (connection) await connection.end();
    }
}

testCart();
