const express = require('express');
const router = express.Router();
const Review = require('../models/review'); // Assuming you have a Review model

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

// Route to post a new review
router.post('/', async (req, res) => {
    const { bookId, reviewText, rating, userId } = req.body;

    try {
        const newReview = new Review({
            bookId,
            reviewText,
            rating,
            userId,
            upvotes: 0,
            upvotedBy: []
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error posting review:', error);
        res.status(500).json({ message: 'Failed to post review', error: error.message });
    }
});

// Upvote route
router.post('/upvote/:id', async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.body.userId;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (!Array.isArray(review.upvotedBy)) {
            review.upvotedBy = [];
        }
        
        // Check if the user has already upvoted this review
        if (review.upvotedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already upvoted this review' });
        }

        // Add the user ID to the list of upvoters and increment the upvote count
        review.upvotedBy.push(userId);
        review.upvotes += 1;
        await review.save();

        res.json({ message: 'Review upvoted successfully' });
    } catch (error) {
        console.error('Error upvoting review:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;