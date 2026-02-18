const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/review');

// Route to handle user signup
router.post('/signup', async (req, res) => {
    const { name, email, password, age } = req.body;
    try {
        console.log('Received signup request:', req.body); // Log the request data

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, age });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already registered. Please log in or use a different email.' });
        }
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
});

// Route to handle user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const userObj = user.toObject ? user.toObject() : { _id: user._id, name: user.name, email: user.email, age: user.age, createdAt: user.createdAt };
        delete userObj.password;
        res.status(200).json({ message: 'Login successful', user: userObj });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Failed to login', error: error.message });
    }
});

module.exports = router;