require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const userBooksRoutes = require('./routes/userBooksRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(express.json());

// Use routes for books, users, user-books, and reviews
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-books', userBooksRoutes);
app.use('/api/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','pages','signup.html')); // Update the path if necessary
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

// Serve the homepage
app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'homepage.html'));
});

// Serve the review page
app.get('/review', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'review.html'));
});

// Serve the your-books page
app.get('/your-books', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'your-books.html'));
});

// Serve the about page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'about.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recturner_book')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start the server (try next port if default is in use)
const PORT = process.env.PORT || 5001;
const MAX_PORT = 5010;
function tryListen(port) {
    if (port > MAX_PORT) {
        console.error(`No available port between ${PORT} and ${MAX_PORT}`);
        return;
    }
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} in use, trying ${port + 1}...`);
            tryListen(port + 1);
        } else {
            console.error('Server error:', err.message);
        }
    });
}
tryListen(Number(PORT) || 5001);