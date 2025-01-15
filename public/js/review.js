
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    if (bookId) {
        fetchBookDetails(bookId);
    }

    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = star.getAttribute('data-value');
            stars.forEach(s => s.classList.remove('selected'));
            star.classList.add('selected');
        });
    });

    document.getElementById('post-review-btn').addEventListener('click', () => postReview(bookId, selectedRating));
    document.getElementById('want-to-read-btn').addEventListener('click', addToWantToRead);
});

function stripHtmlTags(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.body.textContent || "";
}

function displayBookDetails(book) {
    document.getElementById('book-thumbnail').src = book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg';
    document.getElementById('book-title').textContent = book.volumeInfo.title;
    document.getElementById('book-author').textContent = `Author: ${book.volumeInfo.authors?.join(', ') || 'Unknown'}`;
    document.getElementById('book-rating').textContent = `Rating: ${book.volumeInfo.averageRating || 'N/A'}`;
    document.getElementById('book-description').textContent = stripHtmlTags(book.volumeInfo.description || 'No description available.');
    loadReviews(book.id);
}

async function fetchBookDetails(bookId) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const book = await response.json();
        displayBookDetails(book);
    } catch (error) {
        console.error('Error fetching book details:', error);
        alert('Failed to fetch book details. Please try again.');
    }
}

async function addToWantToRead() {
    const bookId = new URLSearchParams(window.location.search).get('bookId');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('You must be logged in to add books to your list.');
        window.location.href = '/pages/login.html'; // Redirect to login page if not logged in
        return;
    }

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const book = await response.json();
        const userBook = {
            userId: loggedInUser._id,
            bookId: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg'
        };

        console.log('Sending request to add book:', userBook); // Log the request data
        const addResponse = await fetch('/api/user-books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userBook),
        });

        if (!addResponse.ok) {
            const errorText = await addResponse.text();
            console.error('Error response:', errorText); // Log the error response
            throw new Error('Failed to save book');
        }

        alert(`${userBook.title} added to your books.`);
    } catch (error) {
        console.error('Error saving book:', error);
        alert('Failed to save book. Please try again.');
    }
}

async function postReview(bookId, selectedRating) {
    const reviewText = document.getElementById('review-input').value.trim();
    const rating = selectedRating;

    if (!reviewText || !rating) {
        alert('Please provide a review and rating.');
        return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('You must be logged in to post a review.');
        window.location.href = '/pages/login.html'; // Redirect to login page if not logged in
        return;
    }

    const review = {
        bookId,
        reviewText,
        rating,
        userId: loggedInUser._id
    };

    try {
        console.log('Sending review:', review); // Log the review data
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText); // Log the error response
            throw new Error('Failed to post review');
        }

        alert('Review posted successfully.');
        document.getElementById('review-input').value = ''; // Clear the review input
        loadReviews(bookId); // Reload reviews
    } catch (error) {
        console.error('Error posting review:', error);
        alert('Failed to post review. Please try again.');
    }
}

// Function to load reviews for a book
async function loadReviews(bookId) {
    try {
        const response = await fetch(`/api/reviews/${bookId}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        console.error('Error loading reviews:', error);
        alert('Failed to load reviews. Please try again.');
    }
}

// Function to display reviews
function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = ''; // Clear previous reviews

    if (!reviews.length) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this book!</p>';
        return;
    }

    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');

        reviewItem.innerHTML = `
            <p><strong>Rating:</strong> ${review.rating}</p>
            <p><strong>Review:</strong> ${review.reviewText}</p>
        `;

        reviewItem.querySelector('.upvote-btn').addEventListener('click', () => upvoteReview(review._id));

        reviewsContainer.appendChild(reviewItem);
    });
}

async function upvoteReview(reviewId) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('You must be logged in to upvote reviews.');
        window.location.href = '/pages/login.html'; // Redirect to login page if not logged in
        return;
    }

    try {
        const response = await fetch(`/api/reviews/upvote/${reviewId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: loggedInUser._id }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText); // Log the error response
            throw new Error('Failed to upvote review');
        }

        alert('Review upvoted successfully.');
        loadReviews(new URLSearchParams(window.location.search).get('bookId')); // Reload reviews
    } catch (error) {
        console.error('Error upvoting review:', error);
        alert('Failed to upvote review. Please try again.');
    }
}