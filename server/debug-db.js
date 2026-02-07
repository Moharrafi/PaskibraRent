const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function debugDb() {
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

        const [rows] = await connection.query('DESCRIBE cart_items');
        console.log('Cart Items table structure:', rows);

        await connection.end();
    } catch (err) {
        console.error('Failed to debug database:', err);
    }
}

debugDb();
