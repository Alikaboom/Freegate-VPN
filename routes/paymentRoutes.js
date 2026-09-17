const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const Order = require('../models/Order');

// Route to create a dummy PayPal order
router.post('/create-paypal-order', async (req, res) => {
    try {
        const { productId } = req.body;
        
        // Generate dummy order for sandbox testing
        const dummyOrderId = "PAYPAL_TEST_" + Math.floor(Math.random() * 1000000000);
        
        res.status(200).json({ id: dummyOrderId });
    } catch (err) {
        console.error('Error creating PayPal order:', err);
        res.status(500).json({ error: 'Server error while creating order' });
    }
});

// Route to capture order and provision VPN
router.post('/capture-paypal-order', async (req, res) => {
    try {
        const { orderID, productId } = req.body;
        
        const customerEmail = 'test-buyer@sandbox.paypal.com';

        // Generate a unique UUID for the BPB-Worker-Panel config
        const vpnUuid = crypto.randomUUID();
        
        // Construct the VLESS link for the user
        const vpnConfig = `vless://${vpnUuid}@us1.freegate-nodes.com:443?encryption=none&security=tls&type=ws&host=us1.freegate-nodes.com&path=%2F#Freegate-${orderID.substring(0,6)}`;

        // Sync with Cloudflare KV (BPB Panel backend)
        // Note: Using a console mock here until real CF API keys are provided
        console.log(`[CF-KV] Synced UUID ${vpnUuid} for Order ${orderID}`);

        // Save order and config to database
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
