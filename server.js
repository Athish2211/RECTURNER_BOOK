const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import path module

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Serve static files from the 'public' directory (placed at the end)
app.post('/api/users/signup', async (req, res) => {
    const { name, email, password, age } = req.body;

    // Basic validation
    if (!name || !email || !password || !age) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email.' });
        }

        // Create new user
        const newUser = new User({ name, email, password, age });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful!', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/returner')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const User = require('./models/User'); // Import User model

const Review = require('./models/review'); // Assuming you created the review model//
// {"conversationId":"60fe1590-dc8c-48b0-a974-0b8c78bed35a","source":"instruct"}

// Middleware to handle review-related routes
app.use('/api/reviews', require('./routes/reviewRoutes')); // Review routes

// Use routes for books and users
app.use('/api/books', require('./routes/bookRoutes')); // Book routes
app.use('/api/users', require('./routes/userRoutes')); // User routes

// Serve the homepage at the root route (localhost:5000)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html')); // Update the path if necessary
});

// Serve static files from the 'public' directory (placed at the end)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable or default port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});