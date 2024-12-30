// Function to handle user sign-up
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const ageInput = document.getElementById('age').value.trim();
    const age = parseInt(ageInput, 10); // Convert to integer

    // Validate inputs
    if (!name || !email || !password || !age) {
        alert('All fields are required and age must be a valid number.');
        return;
    }

    const newUser = { name, email, password, age };

    try {
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Parse error response
            throw new Error(errorData.message || 'Sign-up failed'); // Throw custom error
        }

        alert('Signup successful! You can now log in.');
        window.location.href = '/login.html'; // Redirect to login page after successful signup
    } catch (error) {
        console.error('Error during signup:', error);
        alert(`Signup failed: ${error.message}`);
    }
});

// Function to handle user login
document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const userData = { email, password };

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) throw new Error('Login failed');

        const user = await response.json(); // Assuming this returns user data
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store user data

        alert('Login successful!');
        window.location.href = '/homepage.html'; // Redirect to homepage after login
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
    }
});

// Function to fetch books for the homepage with a random query
async function fetchBooksFromGoogle(query = '') {
    const categories = ['fiction', 'non-fiction', 'mystery', 'fantasy', 'romance'];
    const randomCategory = query || categories[Math.floor(Math.random() * categories.length)];
    const apiKey = 'AIzaSyB_cCice-LLGG8DHOJsMLTgEFb45moca80';  // Replace with your actual Google API key

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(randomCategory)}&maxResults=12&key=${apiKey}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log(data);
        displayBooks(data.items || []); // Display books returned by the API
    } catch (error) {
        console.error('Error fetching books from Google:', error);
    }
}

// Function to display books on the homepage
function displayBooks(books) {
    const resultsContainer = document.getElementById('search-results') || document.getElementById('top-rated-books');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!books.length) {
        resultsContainer.innerHTML = '<p>No books found. Try another search term.</p>';
        return;
    }

    books.forEach(book => {
        const thumbnailUrl = book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg'; // Use fallback image if no thumbnail exists

        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        bookItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="${book.volumeInfo.title}" />
            <h3>${book.volumeInfo.title}</h3>
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

// Fetch books for the homepage on load
if (window.location.pathname.includes('homepage.html')) {
    document.addEventListener('DOMContentLoaded', () => fetchBooksFromGoogle('fiction'));
}

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

// Save a book to the "Your Books" section
function saveToYourBooks(book) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('You must be logged in to add books to your list.');
        window.location.href = '/login.html'; // Redirect to login page if not logged in
        return;
    }

    const userBooksKey = `yourBooks-${loggedInUser.email}`;
    const yourBooks = JSON.parse(localStorage.getItem(userBooksKey)) || [];
    if (!yourBooks.find(b => b.id === book.id)) {
        yourBooks.push(book);
        localStorage.setItem(userBooksKey, JSON.stringify(yourBooks));
    } else {
        alert('This book is already in your list.');
    }
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

// Submit a new review
function submitReview(bookId) {
    const reviewInput = document.getElementById('review-input');
    const ratingInput = document.getElementById('rating-input');  // Assuming there's a rating input field
    const newReviewText = reviewInput.value.trim();
    const newRating = ratingInput.value;

    if (!newReviewText || !newRating) {
        alert('Please enter both a review and a rating before submitting.');
        return;
    }

    const newReview = {
        text: newReviewText,
        rating: newRating,
        user: JSON.parse(localStorage.getItem('loggedInUser')).name // Assuming user data is stored
    };

    const reviews = JSON.parse(localStorage.getItem(`reviews-${bookId}`)) || [];
    reviews.push(newReview);
    localStorage.setItem(`reviews-${bookId}`, JSON.stringify(reviews));

    reviewInput.value = '';  // Clear input field
    ratingInput.value = '';  // Clear rating field
    loadReviews(bookId); // Reload reviews
}

// Sign out function
function signOut() {
    localStorage.removeItem('loggedInUser');  // Remove user data
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    // Also remove books stored for the user
    if (loggedInUser) {
        localStorage.removeItem(`yourBooks-${loggedInUser.email}`); // Remove the user's books
    }

    // Redirect to login page after sign-out
    window.location.href = '/login.html'; 
}