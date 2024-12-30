const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the review schema
const reviewSchema = new Schema({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book', // Assuming you have a Book model to reference
        required: true
    },
    reviewerName: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true,
        trim: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    reviewRating: {
        type: Number,
        default: 0, // Rating for how helpful or useful the review is
        min: 0,
        max: 5
    }
});

// Static method to fetch reviews by bookId
reviewSchema.statics.findReviewsByBook = function(bookId) {
    return this.find({ bookId: bookId }).exec();
};

// Instance method to return review details
reviewSchema.methods.getReviewDetails = function() {
    return {
        reviewer: this.reviewerName,
        rating: this.rating,
        reviewText: this.reviewText,
        date: this.reviewDate.toISOString(),
        reviewRating: this.reviewRating
    };
};

// Method to increase the review rating (helpfulness)
reviewSchema.methods.upvoteReview = function() {
    if (this.reviewRating < 5) {
        this.reviewRating += 1;
    }
    return this.save();
};

// Create and export the Review model
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;