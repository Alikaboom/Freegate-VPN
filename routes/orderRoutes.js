const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET all orders for the dummy user
router.get('/', async (req, res) => {
    try {
        // In a real app with auth, we would filter by req.user.email
        // For this assessment, we fetch the dummy buyer's orders
        const orders = await Order.find({ customerEmail: 'test-buyer@sandbox.paypal.com' })
                                  .populate('productId')
                                  .sort({ createdAt: -1 });
        
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Server error while fetching orders' });
    }
});

module.exports = router;
