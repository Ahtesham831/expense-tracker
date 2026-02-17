const mongoose = require('mongoose');

const IdempotencySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    response: {
        type: Object,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours
    }
});

module.exports = mongoose.model('Idempotency', IdempotencySchema);
