document.addEventListener('DOMContentLoaded',() => {
    fetchBooksFromGoogle();
});


// Function to fetch books for the homepage with a random query
async function fetchBooksFromGoogle(query = '') {
    const categories = ['fiction', 'non-fiction', 'mystery', 'fantasy', 'romance', 'thriller', 'horror', 'biography'];
    const randomCategory = query || categories[Math.floor(Math.random() * categories.length)];
    const apiKey = 'AIzaSyB_cCice-LLGG8DHOJsMLTgEFb45moca80';  // Replace with your actual Google API key

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(randomCategory)}&maxResults=15&key=${apiKey}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        displayBooks(data.items || []); // Display books returned by the API
    } catch (error) {
        console.error('Error fetching books from Google:', error);
        alert('Failed to fetch books. Please try again.');
    }
}

// Function to display books on the homepage
function displayBooks(books) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = ''; // Clear previous results

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

        booksContainer.appendChild(bookItem);
    });
}

// Function to save a book to the user's list
async function saveToYourBooks(book) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    console.log('Logged in user:', loggedInUser); // Debugging statement
    if (!loggedInUser) {
        alert('You must be logged in to add books to your list.');
        window.location.href = '/login.html'; // Redirect to login page if not logged in
        return;
    }

    const userBook = {
        userId: loggedInUser._id,
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg'
    };

    try {
        console.log('Saving book:', userBook); // Debugging statement
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

        alert(`${book.volumeInfo.title} added to your books.`);
    } catch (error) {
        console.error('Error saving book:', error);
        alert('Failed to save book. Please try again.');
    }
}
