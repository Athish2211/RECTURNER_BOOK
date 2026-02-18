
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
            selectedRating = Number(star.getAttribute('data-value')) || 0;
            stars.forEach(s => {
                s.classList.remove('selected');
                if (Number(s.getAttribute('data-value')) <= selectedRating) s.classList.add('selected');
            });
        });
    });

    document.getElementById('post-review-btn').addEventListener('click', () => {
        const rating = Number(selectedRating) || 0;
        if (rating < 1 || rating > 5) {
            alert('Please select a star rating (1-5) before posting.');
            return;
        }
        postReview(bookId, rating);
    });
    document.getElementById('want-to-read-btn').addEventListener('click', addToWantToRead);
});

function stripHtmlTags(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.body.textContent || "";
}

function displayBookDetails(book) {
    const v = book.volumeInfo || {};
    const thumb = document.getElementById('book-thumbnail');
    const titleEl = document.getElementById('book-title');
    const authorEl = document.getElementById('book-author');
    const ratingEl = document.getElementById('book-rating');
    const descEl = document.getElementById('book-description');
    if (thumb) thumb.src = v.imageLinks?.thumbnail || 'default-thumbnail.jpg';
    if (titleEl) titleEl.textContent = v.title || 'Unknown';
    if (authorEl) authorEl.textContent = 'Author: ' + (v.authors?.length ? v.authors.join(', ') : 'Unknown');
    if (ratingEl) ratingEl.textContent = 'Rating: ' + (v.averageRating != null ? v.averageRating : 'N/A');
    if (descEl) descEl.textContent = stripHtmlTags(v.description || 'No description available.');
    loadReviews(book.id);
}

async function fetchBookDetails(bookId) {
    if (!bookId) {
        document.getElementById('book-description').textContent = 'No book selected.';
        return;
    }
    try {
        const response = await fetch(`/api/books/google/volume?volumeId=${encodeURIComponent(bookId)}`);
        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(err.message || 'Failed to load book details');
        }
        const book = await response.json();
        displayBookDetails(book);
    } catch (error) {
        console.error('Error fetching book details:', error);
        const descEl = document.getElementById('book-description');
        if (descEl) descEl.textContent = 'Could not load this book. ' + (error.message || 'Please try again.');
        if (document.getElementById('review-list')) document.getElementById('review-list').innerHTML = '';
    }
}

async function addToWantToRead() {
    const bookId = new URLSearchParams(window.location.search).get('bookId');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        window.location.replace('/pages/login.html');
        return;
    }

    try {
        const response = await fetch(`/api/books/google/volume?volumeId=${encodeURIComponent(bookId)}`);
        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(err.message || 'Failed to load book');
        }
        const book = await response.json();
        const v = book.volumeInfo || {};
        const authors = v.authors;
        const userBook = {
            userId: loggedInUser._id,
            bookId: book.id,
            title: v.title || 'Unknown',
            authors: Array.isArray(authors) ? authors : (authors ? [String(authors)] : ['Unknown']),
            thumbnail: v.imageLinks?.thumbnail || 'default-thumbnail.jpg'
        };

        const addResponse = await fetch('/api/user-books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userBook),
        });

        if (!addResponse.ok) {
            const err = await addResponse.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to save book');
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
    if (!bookId) return;
    try {
        const response = await fetch(`/api/reviews?bookId=${encodeURIComponent(bookId)}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('review-list').innerHTML = '<p>Failed to load reviews. Please try again.</p>';
    }
}

// Function to display reviews
function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('review-list');
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = '';
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const currentUserId = loggedInUser ? String(loggedInUser._id) : '';

    if (!reviews.length) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this book!</p>';
        return;
    }

    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        const isOwnReview = currentUserId && String(review.userId) === currentUserId;
        reviewItem.innerHTML = `
            <p><strong>Rating:</strong> ${review.rating}</p>
            <p><strong>Review:</strong> ${review.reviewText}</p>
            ${review.upvotes != null ? `<p><strong>Upvotes:</strong> ${review.upvotes}</p>` : ''}
            ${isOwnReview ? '<span class="own-review-label">(Your review)</span>' : '<button type="button" class="upvote-btn">Upvote</button>'}
        `;
        const upvoteBtn = reviewItem.querySelector('.upvote-btn');
        if (upvoteBtn) upvoteBtn.addEventListener('click', () => upvoteReview(review._id));
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
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to upvote review');
        }

        alert('Review upvoted successfully.');
        loadReviews(new URLSearchParams(window.location.search).get('bookId')); // Reload reviews
    } catch (error) {
        console.error('Error upvoting review:', error);
        alert('Failed to upvote review. Please try again.');
    }
}