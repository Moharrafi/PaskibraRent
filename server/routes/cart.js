const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
        req.user = verified.user;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// GET /api/cart - Get user's cart
router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cart_items WHERE user_id = ?', [req.user.id]);
        // Transform to frontend format if needed, but for now sending raw DB rows
        // Frontend expects: { id: string, name: string, ... }
        // We only store minimal info. We might need to join with a products table if we had one.
        // Since COSTUMES is in frontend constant, we will just return the stored item_id and qty
        // and let frontend match it with COSTUMES.
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/cart/sync - Sync local cart to DB (Merge)
router.post('/sync', verifyToken, async (req, res) => {
    const { items } = req.body; // Array of local cart items
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Items must be an array' });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Simple strategy:
        // 1. For each local item, check if exists in DB.
        // 2. If exists, update qty (or max of both).
        // 3. If not, insert.
        // 4. (Optional) Return full updated cart.

        // Efficient Bulk Insert using ON DUPLICATE KEY UPDATE
        // MySQL supports bulk insert with ON DUPLICATE causing update
        if (items.length > 0) {
            const values = items.map(item => [req.user.id, item.id, item.quantity, item.rentalDays || 3]);

            await connection.query(
                `INSERT INTO cart_items (user_id, item_id, quantity, rental_days) 
                 VALUES ? 
                 ON DUPLICATE KEY UPDATE 
                 quantity = VALUES(quantity), 
                 rental_days = VALUES(rental_days)`,
                [values]
            );
        }

        await connection.commit();

        // Return full cart
        const [rows] = await pool.query('SELECT * FROM cart_items WHERE user_id = ?', [req.user.id]);
        res.json(rows);

    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// POST /api/cart/item - Add/Update single item
router.post('/item', verifyToken, async (req, res) => {
    const { id, quantity, rentalDays } = req.body;

    try {
        // Upsert Logic
        await pool.query(
            `INSERT INTO cart_items (user_id, item_id, quantity, rental_days) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             quantity = VALUES(quantity), 
             rental_days = VALUES(rental_days)`,
            [req.user.id, id, quantity, rentalDays || 3]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/cart/item/:id - Remove item
router.delete('/item/:id', verifyToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM cart_items WHERE user_id = ? AND item_id = ?', [req.user.id, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
