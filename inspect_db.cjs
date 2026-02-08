
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server/.env') });

async function inspect() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        const [rows] = await connection.query('SHOW CREATE TABLE users');
        console.log('USERS TABLE:', rows[0]['Create Table']);

        // Also check cart_items to see how it references users
        try {
            const [cartRows] = await connection.query('SHOW CREATE TABLE cart_items');
            console.log('CART_ITEMS TABLE:', cartRows[0]['Create Table']);
        } catch (e) { console.log('cart_items not found'); }

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}

inspect();
