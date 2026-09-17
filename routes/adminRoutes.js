const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/query', async (req, res) => {
    try {
        const { collection, method, filter } = req.body;
        
        if (!collection || !method) {
            return res.status(400).json({ error: 'Collection and method are required' });
        }

        const db = mongoose.connection.db;
        const col = db.collection(collection);

        let result;
        const queryFilter = filter ? JSON.parse(filter) : {};

        switch (method) {
            case 'find':
                result = await col.find(queryFilter).limit(50).toArray();
                break;
            case 'deleteMany':
                result = await col.deleteMany(queryFilter);
                break;
            case 'count':
                result = await col.countDocuments(queryFilter);
                break;
            case 'drop':
                result = await col.drop();
                break;
            default:
                return res.status(400).json({ error: 'Unsupported method. Try find, deleteMany, count, or drop.' });
        }

        res.json({ success: true, result });
    } catch (err) {
        console.error('Admin DB Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
