const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(200).json([]);
        }

        const orders = await Order.find({ customerEmail: email })
                                  .populate('productId')
                                  .sort({ createdAt: -1 });
        
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Server error while fetching orders' });
    }
});

module.exports = router;
