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

router.post('/capture-paypal-order', async (req, res) => {
    try {
        const { orderID, productId } = req.body;
        const customerEmail = 'test-buyer@sandbox.paypal.com';
        const vpnUuid = crypto.randomUUID();
        
        const vpnConfig = `vless://${vpnUuid}@us1.freegate-nodes.com:443?encryption=none&security=tls&sni=us1.freegate-nodes.com&type=ws&host=us1.freegate-nodes.com&path=%2F#Freegate-${orderID.substring(0,6)}`;

        // Sync with Cloudflare KV (BPB Panel backend mock)
        console.log(`[CF-KV] Synced UUID ${vpnUuid} for Order ${orderID}`);

        const newOrder = new Order({
            paypalOrderId: orderID,
            productId: productId,
            customerEmail: customerEmail,
            vpnConfigUrl: vpnConfig
        });

        await newOrder.save();
        
        res.status(200).json({
            id: orderID,
            status: 'COMPLETED',
            configUrl: vpnConfig
        });
    } catch (err) {
        console.error('Error provisioning VPN:', err);
        res.status(500).json({ error: 'Server error while capturing order' });
    }
});

module.exports = router;
