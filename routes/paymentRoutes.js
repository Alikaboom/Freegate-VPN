const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');

router.post('/create-paypal-order', async (req, res) => {
    try {
        const { productId } = req.body;
        const dummyOrderId = "PAYPAL_TEST_" + Math.floor(Math.random() * 1000000000);
        res.status(200).json({ id: dummyOrderId });
    } catch (err) {
        console.error('Error creating PayPal order:', err);
        res.status(500).json({ error: 'Server error while creating order' });
    }
});

const { deployUserWorker } = require('../services/cloudflare');

router.post('/capture-paypal-order', async (req, res) => {
    try {
        const { orderID, productId } = req.body;
        const customerEmail = 'test-buyer@sandbox.paypal.com';
        const vpnUuid = crypto.randomUUID();
        
        let cfDomain = 'fallback-domain.workers.dev';
        try {
            cfDomain = await deployUserWorker(orderID, vpnUuid);
        } catch (cfErr) {
            console.error('Failed to deploy real Cloudflare Worker, falling back to mock:', cfErr);
        }

        const realSubUrl = `https://${cfDomain}/${vpnUuid}/sub`;

        const newOrder = new Order({
            paypalOrderId: orderID,
            productId: productId,
            customerEmail: customerEmail,
            vpnConfigUrl: realSubUrl
        });

        await newOrder.save();
        
        res.status(200).json({
            id: orderID,
            status: 'COMPLETED',
            configUrl: realSubUrl
        });
    } catch (err) {
        console.error('Error provisioning VPN:', err);
        res.status(500).json({ error: 'Server error while capturing order' });
    }
});

module.exports = router;
