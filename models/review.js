const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    upvotes: { type: Number, default: 0 }, // Add upvotes field
    createdAt: { type: Date, default: Date.now }
});

reviewSchema.methods.upvoteReview = function() {
    this.upvotes += 1;
    return this.save();
};

// Create and export the Review model
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;