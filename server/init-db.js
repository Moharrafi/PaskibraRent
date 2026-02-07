
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function initDb() {
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

        const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

        // Split by semicolon to run multiple statements if any, though schema.sql usually has one
        const statements = schemaSql.split(';').filter(stmt => stmt.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
                console.log('Executed schema statement.');
            }
        }

        console.log('Database initialized successfully.');
        await connection.end();
    } catch (err) {
        console.error('Failed to initialize database:', err);
    }
}

initDb();
