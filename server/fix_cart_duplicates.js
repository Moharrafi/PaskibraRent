
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function fixDuplicates() {
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

        // 1. Remove duplicates, keeping the one with the highest ID (latest)
        console.log('Removing duplicate cart items...');
        await connection.query(`
            DELETE c1 FROM cart_items c1
            INNER JOIN cart_items c2 
            WHERE 
                c1.id < c2.id AND 
                c1.user_id = c2.user_id AND 
                c1.item_id = c2.item_id
        `);
        console.log('Duplicates removed.');

        // 2. Add Unique Constraint
        console.log('Adding unique constraint...');
        try {
            await connection.query(`
                ALTER TABLE cart_items
                ADD CONSTRAINT unique_user_item UNIQUE (user_id, item_id)
            `);
            console.log('Unique constraint added successfully.');
        } catch (err) {
            if (err.code === 'ER_DUP_KEY' || err.code === 'ER_DUP_ENTRY') {
                console.log('Unique constraint already exists or duplicates still exist.');
            } else {
                console.log('Error adding constraint (might already exist):', err.message);
            }
        }

        await connection.end();
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

fixDuplicates();
