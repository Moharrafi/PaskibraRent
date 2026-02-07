
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function migrate() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        console.log('Connected to database for migration...');

        // Add is_verified column
        try {
            await pool.query('ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE');
            console.log('Added is_verified column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('is_verified column already exists.');
            } else {
                throw err;
            }
        }

        // Add verification_token column
        try {
            await pool.query('ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)');
            console.log('Added verification_token column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('verification_token column already exists.');
            } else {
                throw err;
            }
        }

        console.log('Migration completed.');
        await pool.end();
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrate();
