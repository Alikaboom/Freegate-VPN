const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Simulated BPB-Worker-Panel Subscription Endpoint
router.get('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const format = req.query.format || 'base64'; // Support normal, base64, clash, singbox

        // Find the order that owns this UUID
        // In our DB, vpnConfigUrl contains the UUID. Let's just do a simple regex or string match
        const order = await Order.findOne({ vpnConfigUrl: { $regex: uuid } }).populate('productId');

        if (!order) {
            return res.status(404).send('Subscription not found or expired.');
        }

        const tier = order.productId.tier; // E.g., 'Tier 1', 'Tier 2'
        const allowedLinks = order.productId.bandwidthLimit; // We can store the allowed link count here or infer it

        // We generate a valid VLESS URI format using a mock Cloudflare IP (e.g., standard Cloudflare Anycast)
        const vlessUri = `vless://${uuid}@104.21.94.80:443?encryption=none&security=tls&type=ws&host=your-worker.workers.dev&path=%2F#Freegate-Node`;

        // Depending on the format requested, and the user's Tier access, we return data.
        // V2ray/Nekobox expects Base64 encoded VLESS URIs by default.
        
        const base64Content = Buffer.from(vlessUri).toString('base64');
        
        // Return standard base64 subscription content
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(base64Content);

    } catch (err) {
        console.error('Error generating subscription:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
