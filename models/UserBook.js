const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    authors: { type: [String], required: true },
    thumbnail: { type: String, required: true },
    upVotedBy: { type: [mongoose.Schema.Types.ObjectId], default: [] }
});

module.exports = mongoose.model('UserBook', userBookSchema);