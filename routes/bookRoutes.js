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

// Route: Add a new book
router.post('/', async (req, res) => {
    const { title, author, genre, description } = req.body;
    const book = new Book({ title, author, genre, description });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add other routes as necessary...

module.exports = router;