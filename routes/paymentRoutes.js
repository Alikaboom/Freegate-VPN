const express = require('express');
const router = express.Router();

// Route to create a dummy PayPal order
router.post('/create-paypal-order', async (req, res) => {
    try {
        const { productId } = req.body;
        
        // In a production environment, we would securely fetch the product price from the DB here
        // and make an authenticated call to PayPal's REST API.
        // As per the assessment brief, this is a simulated dummy process using Sandbox rules.
        
        const dummyOrderId = "PAYPAL_TEST_" + Math.floor(Math.random() * 1000000000);
        
        res.status(200).json({ id: dummyOrderId });
    } catch (err) {
        console.error('Error creating PayPal order:', err);
        res.status(500).json({ error: 'Server error while creating order' });
    }
});

// Route to capture a dummy PayPal order
router.post('/capture-paypal-order', async (req, res) => {
    try {
        const { orderID } = req.body;
        
        // In a real environment, we would call PayPal to execute/capture the transaction.
        // Here, we simulate a successful transaction capture.
        
        const mockCaptureResponse = {
            id: orderID,
            status: 'COMPLETED',
            payer: {
                email_address: 'test-buyer@sandbox.paypal.com'
            }
        };

        res.status(200).json(mockCaptureResponse);
    } catch (err) {
        console.error('Error capturing PayPal order:', err);
        res.status(500).json({ error: 'Server error while capturing order' });
    }
});

module.exports = router;
