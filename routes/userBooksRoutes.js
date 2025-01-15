const express = require('express');
const router = express.Router();
const UserBook = require('../models/UserBook'); // Assuming you have a UserBook model

// Route to add a book to the user's "Want to Read" list
router.post('/', async (req, res) => {
    const { userId, bookId, title, authors, thumbnail } = req.body;

    try {
        console.log('Received request to add book:', req.body); // Log the request data
        const newUserBook = new UserBook({
            userId,
            bookId,
            title,
            authors,
            thumbnail
        });

        await newUserBook.save();
        res.status(201).json(newUserBook);
    } catch (error) {
        console.error('Error saving book:', error);
        res.status(500).json({ message: 'Failed to save book', error: error.message });
    }
});

// Route to fetch books from the user's list
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userBooks = await UserBook.find({ userId });
        res.status(200).json(userBooks);
    } catch (error) {
        console.error('Error fetching user books:', error);
        res.status(500).json({ message: 'Failed to fetch user books', error: error.message });
    }
});

module.exports = router;