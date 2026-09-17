const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vpn_store';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const subRoutes = require('./routes/subRoutes');

app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/sub', subRoutes);

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection handshake successful.');
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB. Retrying in 5 seconds...', err);
        setTimeout(connectDB, 5000);
    }
};

connectDB();
