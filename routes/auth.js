const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// SIGNUP
router.post('/signup', async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        password: hashed
    });

    await user.save();
    res.json({ message: "User created" });
});

// LOGIN
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.json({ message: "User not found" });

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) return res.json({ message: "Wrong password" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
    );

    res.json({ token });
});

module.exports = router;