
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function addColumn() {
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

        // Check if column exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'booking_items' AND COLUMN_NAME = 'item_id'
        `, [process.env.DB_NAME]);

        if (columns.length === 0) {
            console.log('Adding item_id column...');
            await connection.query(`
                ALTER TABLE booking_items
                ADD COLUMN item_id VARCHAR(255) AFTER booking_id
            `);
            console.log('Column item_id added successfully.');
        } else {
            console.log('Column item_id already exists.');
        }

        await connection.end();
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

addColumn();
