const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    bandwidthLimit: { type: String, required: true }, // e.g., '100GB', 'Unlimited'
    tier: { type: String, default: 'Basic' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
