const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paypalOrderId: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customerEmail: { type: String, required: true },
    vpnConfigUrl: { type: String, required: true },
    status: { type: String, default: 'COMPLETED' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
