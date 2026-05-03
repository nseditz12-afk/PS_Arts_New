const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

// GET PRODUCTS
router.get('/', async (req, res) => {
    res.json(await Product.find());
});

// ADD PRODUCT
router.post('/add', auth, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        sellerId: req.user.id
    });

    await product.save();
    res.json({ message: "Product added" });
});

// CREATE ORDER
router.post('/create-cart-order', auth, async (req, res) => {
    let total = 0;
    req.body.cart.forEach(i => total += i.price);

    const order = await razorpay.orders.create({
        amount: total * 100,
        currency: "INR"
    });

    res.json(order);
});

// PAYMENT SUCCESS
router.post('/checkout-success', auth, async (req, res) => {
    const { cart, paymentId } = req.body;

    for (let item of cart) {
        await new Order({
            userId: req.user.id,
            name: item.name,
            price: item.price,
            paymentId
        }).save();
    }

    res.json({ message: "Order saved" });
});

// GET ORDERS
router.get('/orders', auth, async (req, res) => {
    res.json(await Order.find({ userId: req.user.id }));
});

module.exports = router;