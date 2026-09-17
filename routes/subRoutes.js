const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        
        const order = await Order.findOne({ vpnConfigUrl: { $regex: uuid } }).populate('productId');

        if (!order) {
            return res.status(404).send('Subscription not found or expired.');
        }

        // I'm generating a valid VLESS URI format using a mock Cloudflare IP
        const vlessUri = `vless://${uuid}@104.21.94.80:443?encryption=none&security=tls&type=ws&host=my-worker.workers.dev&path=%2F#Freegate-Node`;

        const base64Content = Buffer.from(vlessUri).toString('base64');
        
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(base64Content);

    } catch (err) {
        console.error('Error generating subscription:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
