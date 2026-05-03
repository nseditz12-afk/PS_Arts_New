const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: String,
    name: String,
    price: Number,
    paymentId: String
});

module.exports = mongoose.model('Order', OrderSchema);