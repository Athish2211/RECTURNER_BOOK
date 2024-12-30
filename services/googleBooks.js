const axios = require('axios');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Store your key in .env
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

async function searchBooks(query, maxResults = 10) {
    try {
        const response = await axios.get(GOOGLE_BOOKS_BASE_URL, {
            params: {
                q: query,
                maxResults,
                key: GOOGLE_API_KEY,
            },
        });

        const books = response.data.items.map((item) => ({
            id: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown',
            description: item.volumeInfo.description  || 'No description available.',
            thumbnail: item.volumeInfo.imageLinks?.thumbnail  || null,
            categories: item.volumeInfo.categories || [],
        }));

        return books;
    } catch (error) {
        console.error('Error fetching data from Google Books API:', error.message);
        throw new Error('Failed to fetch books from Google API');
    }
}

module.exports = { searchBooks };