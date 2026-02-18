const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Review = require('../models/review');
// #region agent log
const _logPath = path.join(__dirname, '..', '.cursor', 'debug.log');
function _agentLog(o) { try { const dir = path.dirname(_logPath); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.appendFileSync(_logPath, JSON.stringify({ ...o, timestamp: Date.now() }) + '\n'); } catch (e) {} }
// #endregion

// Route to get reviews for a book
router.get('/', async (req, res) => {
    const { bookId } = req.query;
    // #region agent log
    _agentLog({ location: 'reviewRoutes:GET', message: 'reviews fetch', data: { bookId: bookId || 'missing', hasQuery: !!req.query.bookId }, hypothesisId: 'H1' });
    // #endregion
    try {
        const reviews = await Review.find({ bookId });
        // #region agent log
        _agentLog({ location: 'reviewRoutes:GET', message: 'reviews result', data: { count: reviews.length, bookId }, hypothesisId: 'H1' });
        // #endregion
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
});

// Route to post a new review
router.post('/', async (req, res) => {
    const { bookId, reviewText, rating, userId } = req.body;
    // #region agent log
    _agentLog({ location: 'reviewRoutes:POST', message: 'post review', data: { bookId: !!bookId, rating, ratingType: typeof rating }, hypothesisId: 'H5' });
    // #endregion
    try {
        const ratingNum = Number(rating);
        if (!(ratingNum >= 1 && ratingNum <= 5)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        const newReview = new Review({
            bookId,
            reviewText,
            rating: ratingNum,
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

        if (String(review.userId) === String(userId)) {
            return res.status(403).json({ message: 'You cannot upvote your own review' });
        }

        if (!Array.isArray(review.upvotedBy)) {
            review.upvotedBy = [];
        }
        const userIdStr = String(userId);
        const alreadyUpvoted = review.upvotedBy.some(id => String(id) === userIdStr);
        if (alreadyUpvoted) {
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