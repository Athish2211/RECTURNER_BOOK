const express = require('express');
const router = express.Router();
const Review = require('../models/review'); // Import Review model

// Route to submit a review
router.post('/reviews', async (req, res) => {
    const { bookId, reviewer, rating, comment } = req.body;

    try {
        const newReview = new Review({ bookId, reviewer, rating, comment });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit review', error: error.message });
    }
});

// Route to fetch reviews by bookId
router.get('/reviews/:bookId', async (req, res) => {
    const { bookId } = req.params;

    try {
        const reviews = await Review.findReviewsByBook(bookId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
});

module.exports = router;