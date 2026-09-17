const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Server error while fetching products' });
    }
});

// GET a specific product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST a new product (Admin feature)
router.post('/', async (req, res) => {
    try {
        const { name, description, price, bandwidthLimit, tier } = req.body;
        
        // Basic validation
        if (!name || !price || !bandwidthLimit) {
            return res.status(400).json({ error: 'Name, price, and bandwidth limit are required' });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            bandwidthLimit,
            tier
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Server error while adding product' });
    }
});

module.exports = router;
