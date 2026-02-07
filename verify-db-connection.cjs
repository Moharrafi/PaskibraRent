const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

console.log('Testing Database Connection...');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME);

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD, // Ensure this isn't undefined
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });
        console.log('Connection successful!');
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('Query result:', rows);
        await connection.end();
    } catch (err) {
        console.error('Connection failed!');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('Full error:', err);
    }
}

testConnection();
