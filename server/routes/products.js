const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all products
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        const products = rows.map(product => ({
            ...product,
            imageUrls: JSON.parse(product.image_urls || '[]'),
            tags: JSON.parse(product.tags || '[]'),
            packageContents: JSON.parse(product.package_contents || '[]'),
            sizes: JSON.parse(product.sizes || '[]'),
            rentalDuration: product.rental_duration,
        }));
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });

        const product = rows[0];
        res.json({
            ...product,
            imageUrls: JSON.parse(product.image_urls || '[]'),
            tags: JSON.parse(product.tags || '[]'),
            packageContents: JSON.parse(product.package_contents || '[]'),
            sizes: JSON.parse(product.sizes || '[]'),
            rentalDuration: product.rental_duration,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// CREATE product
router.post('/', async (req, res) => {
    const { name, category, price, rentalDuration, stock, description, imageUrls, material, tags, packageContents, sizes } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO products (name, category, price, rental_duration, stock, description, image_urls, material, tags, package_contents, sizes) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, price, rentalDuration, stock, description, JSON.stringify(imageUrls), material, JSON.stringify(tags), JSON.stringify(packageContents), JSON.stringify(sizes)]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// UPDATE product
router.put('/:id', async (req, res) => {
    const { name, category, price, rentalDuration, stock, description, imageUrls, material, tags, packageContents, sizes } = req.body;
    try {
        await pool.query(
            `UPDATE products SET name=?, category=?, price=?, rental_duration=?, stock=?, description=?, image_urls=?, material=?, tags=?, package_contents=?, sizes=? WHERE id=?`,
            [name, category, price, rentalDuration, stock, description, JSON.stringify(imageUrls), material, JSON.stringify(tags), JSON.stringify(packageContents), JSON.stringify(sizes), req.params.id]
        );
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;
