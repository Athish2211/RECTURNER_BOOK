// Fetch search results for search-page.html
async function fetchSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');
    
    if (query) {
        console.log('Fetching books for query:', query);  // Debugging search query
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            displaySearchResults(data.items || []); // Display search results
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }
}

// Function to display search results on search-page.html
function displaySearchResults(books) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!books.length) {
        resultsContainer.innerHTML = '<p>No books found for your search term.</p>';
        return;
    }

    books.forEach(book => {
        const thumbnailUrl = book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg';

        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        bookItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="${book.volumeInfo.title}" />
            <h4>${book.volumeInfo.title}</h4>
            <p>By ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
            <button class="want-to-read-btn">Want to Read</button>
            <a href="review.html?id=${book.id}&thumbnail=${encodeURIComponent(thumbnailUrl)}" class="review-link">View Details</a>
        `;

        // Add "Want to Read" functionality
        bookItem.querySelector('.want-to-read-btn').addEventListener('click', () => {
            saveToYourBooks(book);
            alert(`${book.volumeInfo.title} added to your books.`);
        });

        resultsContainer.appendChild(bookItem);
    });
}

// Add search functionality to search button
if (document.getElementById('search-btn')) {
    document.getElementById('search-btn').addEventListener('click', () => {
        const query = document.getElementById('search-input').value.trim();
        if (query) {
            console.log('Searching for :',query);
            window.location.href = `search-page.html?search=${encodeURIComponent(query)}`;
        } else {
            alert('Please enter a search term.');
        }
    });
}

// Display "Your Books" on the respective page
if (window.location.pathname.includes('your-books.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            alert('You must be logged in to view your books.');
            window.location.href = '/login.html'; // Redirect to login if not logged in
            return;
        }

        const yourBooksContainer = document.getElementById('your-books-container');
        const yourBooks = JSON.parse(localStorage.getItem(`yourBooks-${loggedInUser.email}`)) || [];

        yourBooksContainer.innerHTML = '';
        if (yourBooks.length === 0) {
            yourBooksContainer.innerHTML = '<p>No books in your list yet.</p>';
        } else {
            yourBooks.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');

                bookItem.innerHTML = `
                    <h3>${book.volumeInfo.title}</h3>
                    <p><strong>Author:</strong> ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
                    <img src="${book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg'}" alt="${book.volumeInfo.title}" />
                `;

                yourBooksContainer.appendChild(bookItem);
            });
        }
    });
}


// Fetch book details for review page on load
if (window.location.pathname.includes('review.html')) {
    document.addEventListener('DOMContentLoaded', fetchBookDetails);
}

// Function to fetch individual book details for review page
async function fetchBookDetails() {
    const bookId = new URLSearchParams(window.location.search).get('id');
    const thumbnailUrl = new URLSearchParams(window.location.search).get('thumbnail');
    if (!bookId) return;

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const book = await response.json();
        displayBookDetails(book, thumbnailUrl);
    } catch (error) {
        console.error('Error fetching book details:', error);
    }
}

// Display book details on the review page
function displayBookDetails(book, thumbnailUrl) {
    document.getElementById('book-title').textContent = book.volumeInfo.title;
    document.getElementById('book-author').textContent = `Author: ${book.volumeInfo.authors?.join(', ') || 'Unknown'}`;
    document.getElementById('book-rating').textContent = `Rating: ${book.volumeInfo.averageRating || 'N/A'}`;
    document.getElementById('book-description').textContent = book.volumeInfo.description || 'No description available.';

    // Display the thumbnail on the review page
    document.getElementById('book-thumbnail').src = thumbnailUrl || 'default-thumbnail.jpg';

    // Add functionality to save book to "Your Books"
    document.getElementById('want-to-read-btn').addEventListener('click', () => {
        saveToYourBooks(book);
        alert(`${book.volumeInfo.title} added to your books.`);
    });

    // Load existing reviews
    loadReviews(book.id);

    // Set up review submission
    document.getElementById('review-form').addEventListener('submit', (event) => {
        event.preventDefault();
        submitReview(book.id);
    });
}

// Load and display reviews
function loadReviews(bookId) {
    const reviews = JSON.parse(localStorage.getItem(`reviews-${bookId}`)) || [];
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';

    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `<p>${review.text}</p><p>Rating: ${review.rating}</p><p>By: ${review.user}</p>`;
        reviewList.appendChild(reviewItem);
    });
}

document.getElementById('review-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const bookId = document.getElementById('bookId').value.trim();
    const reviewer = document.getElementById('reviewer').value.trim();
    const rating = document.getElementById('rating').value.trim();
    const comment = document.getElementById('comment').value.trim();
    const reviewData = { bookId, reviewer, rating, comment };

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) throw new Error('Failed to submit review');

        alert('Review submitted successfully!');
        fetchReviews(bookId); // Fetch and display reviews after submission
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
    }
});

async function fetchReviews(bookId) {
    try {
        const response = await fetch(`/api/reviews/${bookId}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');

        const reviews = await response.json();
        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = ''; // Clear existing reviews

        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');
            reviewElement.innerHTML = `
                <p><strong>Reviewer:</strong> ${review.reviewer}</p>
                <p><strong>Rating:</strong> ${review.rating}</p>
                <p><strong>Comment:</strong> ${review.comment}</p>
            `;
            reviewsList.appendChild(reviewElement);
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        alert('Failed to fetch reviews. Please try again.');
    }
}

// Sign out function
function signOut() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    // Also remove books stored for the user
    if (loggedInUser) {
        localStorage.removeItem(`yourBooks-${loggedInUser.email}`); // Remove the user's books
    }

    localStorage.removeItem('loggedInUser');  // Remove user data

    // Redirect to login page after sign-out
    window.location.href = '/login.html'; 
}