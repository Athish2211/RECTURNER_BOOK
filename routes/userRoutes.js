const express = require('express');
const User = require('../models/User'); // Assuming you have a User model
const bcrypt = require('bcrypt'); // For password hashing
const router = express.Router();

// Route for user signup
router.post('/signup', async (req, res) => {
    const { name, age, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
        const user = new User({ name, age, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful', user });
        
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Route for getting user profile information
router.get('/profile', async (req, res) => {
    // Here you would typically get the user's ID from a session or token
    const userId = req.user.id; // Assuming you have middleware that sets req.user

    try {
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            name: user.name,
            email: user.email,
            memberSince: user.createdAt.toLocaleDateString(), // Format as needed
            booksBorrowed: user.booksBorrowed.length,
            reviewsWritten: user.reviewsWritten.length,
        });
        
    } catch (err) {
        res.status(500).json({ message : 'Server error', error : err.message });
    }
});

module.exports = router;