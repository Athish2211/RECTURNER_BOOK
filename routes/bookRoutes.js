const express = require('express');
const Book = require('../models/Book'); // Assuming you have a Book model
const router = express.Router();

// Route: Fetch all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Route: Fetch books by filter (title, author, genre)
router.get('/search', async (req, res) => {
    const { title, author, genre } = req.query;
    const filter = {};
    if (title) filter.title = new RegExp(title, 'i');
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    try {
        const books = await Book.find(filter);
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;