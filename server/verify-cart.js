const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function verifyCart() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        console.log('Connected to database.');

        // Get user ID
        const [users] = await connection.query('SELECT id, email FROM users WHERE email = ?', ['xnoverse898@gmail.com']);
        if (users.length === 0) {
            console.log('User not found.');
            await connection.end();
            return;
        }
        const user = users[0];
        console.log('Found user:', user);

        // Check cart items
        const [cart] = await connection.query('SELECT * FROM cart_items WHERE user_id = ?', [user.id]);
        console.log('Cart Items:', cart);

        await connection.end();
    } catch (err) {
        console.error('Failed to verify cart:', err);
    }
}

verifyCart();
