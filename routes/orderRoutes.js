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

router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'Server error while updating order' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Server error while deleting order' });
    }
});

module.exports = router;
