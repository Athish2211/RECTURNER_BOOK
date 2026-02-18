const express = require('express');
const axios = require('axios');
const Book = require('../models/Book');
const router = express.Router();
const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

// Proxy to Google Books API (uses GOOGLE_API_KEY from .env)
router.get('/google', async (req, res) => {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
        return res.status(503).json({ message: 'Google Books API key not configured' });
    }
    const { q, maxResults = 10 } = req.query;
    if (!q) {
        return res.status(400).json({ message: 'Missing query parameter q' });
    }
    try {
        const response = await axios.get(GOOGLE_BOOKS_URL, {
            params: { q, maxResults: Math.min(Number(maxResults) || 10, 40), key },
            timeout: 10000,
        });
        res.json(response.data);
    } catch (err) {
        const status = err.response?.status || 500;
        const message = err.response?.data?.error?.message || err.message || 'Failed to fetch books';
        res.status(status).json({ message });
    }
});

router.get('/google/volume', async (req, res) => {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
        return res.status(503).json({ message: 'Google Books API key not configured' });
    }
    const volumeId = req.query.volumeId;
    if (!volumeId) {
        return res.status(400).json({ message: 'Missing volumeId' });
    }
    try {
        const response = await axios.get(`${GOOGLE_BOOKS_URL}/${encodeURIComponent(volumeId)}`, {
            params: { key },
            timeout: 10000,
        });
        res.json(response.data);
    } catch (err) {
        const status = err.response?.status || 500;
        const message = err.response?.data?.error?.message || err.message || 'Failed to fetch book';
        res.status(status).json({ message });
    }
});

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