const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    description: { type: String },
    recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    reviews: [{
        user: { type: String },
        comment: { type: String },
        rating: { type: Number }
    }]
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;