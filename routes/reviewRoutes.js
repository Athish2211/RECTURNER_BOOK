const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Route to post a review
router.post('/', async (req, res) => {
    const { bookId, userId, reviewText, rating } = req.body;

    try {
        const newReview = new Review({ bookId, userId, reviewText, rating });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error posting review:', error);
        res.status(500).json({ message: 'Failed to post review', error: error.message });
    }
});

// Route to get reviews for a book
router.get('/', async (req, res) => {
    const { bookId } = req.query;

    try {
        const reviews = await Review.find({ bookId });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
});

// Route to upvote a review
router.post('/upvote/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.upvoteReview();
        res.status(200).json(review);
    } catch (error) {
        console.error('Error upvoting review:', error);
        res.status(500).json({ message: 'Failed to upvote review', error: error.message });
    }
});

module.exports = router;