
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/cart', require('./routes/cart'));

// Test Database Connection
// Test Database Connection
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT NOW() as now');
        res.json({ message: 'Database connected successfully', time: rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Backend Server is Running');
});

// Start Server only if not running in Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running heavily on port ${PORT}`);
    });
}

module.exports = app;
