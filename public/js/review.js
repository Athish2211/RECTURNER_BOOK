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

async function fetchBookDetails(bookId) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        if (!response.ok) throw new Error('Failed to fetch book details');

        const book = await response.json();
        displayBookDetails(book);
    } catch (error) {
        console.error('Error fetching book details:', error);
        alert('Failed to load book details. Please try again.');
    }
}

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

async function addToWantToRead() {
    const bookId = new URLSearchParams(window.location.search).get('bookId');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('You must be logged in to add books to your list.');
        window.location.href = '/login.html'; // Redirect to login page if not logged in
        return;
    }

    const userBook = {
        userId: loggedInUser._id,
        bookId,
        title: document.getElementById('book-title').textContent,
        authors: document.getElementById('book-author').textContent.replace('Author: ', ''),
        thumbnail: document.getElementById('book-thumbnail').src
    };

    try {
        const response = await fetch('/api/user-books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userBook),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText); // Debugging statement
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

    const review = {
        bookId,
        reviewText,
        rating,
        userId: JSON.parse(localStorage.getItem('loggedInUser'))._id
    };

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });

        if (!response.ok) throw new Error('Failed to post review');

        alert('Review posted successfully!');
        document.getElementById('review-input').value = '';
        document.querySelectorAll('.star').forEach(star => star.classList.remove('selected'));
        loadReviews(bookId);
    } catch (error) {
        console.error('Error posting review:', error);
        alert('Failed to post review. Please try again.');
    }
}

async function loadReviews(bookId) {
    try {
        const response = await fetch(`/api/reviews?bookId=${bookId}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');

        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        alert('Failed to fetch reviews. Please try again.');
    }
}

function displayReviews(reviews) {
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';

    if (!reviews.length) {
        reviewList.innerHTML = '<p>No reviews yet. Be the first to review this book!</p>';
        return;
    }

    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');

        reviewItem.innerHTML = `
            <p><strong>Rating:</strong> ${review.rating} / 5</p>
            <p>${review.reviewText}</p>
            <p><strong>Upvotes:</strong> ${review.upvotes}</p>
            <button class="upvote-btn" data-id="${review._id}">Upvote</button>
        `;

        reviewItem.querySelector('.upvote-btn').addEventListener('click', () => upvoteReview(review._id));

        reviewList.appendChild(reviewItem);
    });
}

async function upvoteReview(reviewId) {
    try {
        const response = await fetch(`/api/reviews/upvote/${reviewId}`, {
            method: 'POST',
        });

        if (!response.ok) throw new Error('Failed to upvote review');

        loadReviews(new URLSearchParams(window.location.search).get('bookId')); // Reload reviews to update the upvote count
    } catch (error) {
        console.error('Error upvoting review:', error);
        alert('Failed to upvote review. Please try again.');
    }
}