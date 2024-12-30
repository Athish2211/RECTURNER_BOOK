const express = require('express');
const Review = require('../models/review'); // Import Review model
const router = express.Router();

// Route to create a review
router.post('/', async (req, res) => {
    const { bookId, reviewerName, rating, reviewText } = req.body;

    const newReview = new Review({
        bookId,
        reviewerName,
        rating,
        reviewText
    });

    try {
        await newReview.save();
        res.status(201).json({ message: 'Review created successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating review', error: err });
    }
});

// Route to get all reviews for a book
router.get('/:bookId', async (req, res) => {
    const { bookId } = req.params;

    try {
        const reviews = await Review.findReviewsByBook(bookId);
        res.json(reviews.map(review => review.getReviewDetails()));
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reviews', error: err });
    }
});

// Route to upvote a review (increase review rating)
router.post('/:reviewId/upvote', async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId);
        if (review) {
            await review.upvoteReview();
            res.json({ message: 'Review upvoted successfully!' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error upvoting review', error: err });
    }
});

module.exports = router;