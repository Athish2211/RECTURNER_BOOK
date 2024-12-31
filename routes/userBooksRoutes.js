const express = require('express');
const router = express.Router();
const UserBook = require('../models/UserBook'); // Assuming you have a UserBook model

// Route to save a book to the user's list
router.post('/', async (req, res) => {
    const { userId, bookId, title, authors, thumbnail } = req.body;

    console.log('Received request to save book:', { userId, bookId, title, authors, thumbnail }); // Debugging statement

    try {
        const newUserBook = new UserBook({ userId, bookId, title, authors, thumbnail });
        await newUserBook.save();
        res.status(201).json(newUserBook);
    } catch (error) {
        console.error('Error saving book:', error); // Debugging statement
        res.status(500).json({ message: 'Failed to save book', error: error.message });
    }
});

// Route to fetch books from the user's list
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log('Received request to fetch books for user:', userId); // Debugging statement

    try {
        const userBooks = await UserBook.find({ userId });
        if (!userBooks.length) {
            return res.status(404).json({ message: 'No books found for this user' });
        }

        res.status(200).json(userBooks);
    } catch (error) {
        console.error('Error fetching books:', error); // Debugging statement
        res.status(500).json({ message: 'Failed to fetch books', error: error.message });
    }
});

module.exports = router;
