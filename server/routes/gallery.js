const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all gallery items
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM gallery ORDER BY date DESC');
        const gallery = rows.map(item => ({
            ...item,
            imageUrl: item.image_url,
        }));
        res.json(gallery);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

// CREATE gallery item
router.post('/', async (req, res) => {
    const { title, imageUrl, date, location } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO gallery (title, image_url, date, location) VALUES (?, ?, ?, ?)`,
            [title, imageUrl, date, location]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create gallery item' });
    }
});

// UPDATE gallery item
router.put('/:id', async (req, res) => {
    const { title, imageUrl, date, location } = req.body;
    try {
        await pool.query(
            `UPDATE gallery SET title=?, image_url=?, date=?, location=? WHERE id=?`,
            [title, imageUrl, date, location, req.params.id]
        );
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update gallery item' });
    }
});

// DELETE gallery item
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
        res.json({ message: 'Gallery item deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete gallery item' });
    }
});

module.exports = router;
