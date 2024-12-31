const express = require('express');
const router = express.Router();
const UserBook = require('../models/UserBook'); // Assuming you have a UserBook model

// Route to save a book to the user's list
router.post('/user-books', async (req, res) => {
    const { userId, bookId, title, authors, thumbnail } = req.body;

    try {
        const newUserBook = new UserBook({ userId, bookId, title, authors, thumbnail });
        await newUserBook.save();
        res.status(201).json(newUserBook);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save book', error: error.message });
    }
});

module.exports = router;