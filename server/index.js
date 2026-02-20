
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Security headers
app.use(helmet());

// Limit JSON payload size to 1MB (down from 50MB) to prevent DoS attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Stricter CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));

// Apply rate limiting to all requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit' }
});
// Apply stricter rate limiting for auth endpoints (login/register/verify)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // 10 requests per 15 mins for auth
    message: { message: 'Terlalu banyak percobaan autentikasi, silakan coba lagi nanti' }
});

app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/products', require('./routes/products'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/newsletter', require('./routes/newsletter'));

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
