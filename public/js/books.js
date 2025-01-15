document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');

    if (query) {
        searchBooks(query);
    } else {
        fetchBooksFromGoogle();
    }
});

// Function to fetch books for the homepage from multiple genres
async function fetchBooksFromGoogle() {
    const genres = ['fiction', 'mystery', 'fantasy', 'romance', 'biography'];
    const apiKey = 'AIzaSyB_cCice-LLGG8DHOJsMLTgEFb45moca80';
    const booksByGenre = {};

    try {
        for (const genre of genres) {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(genre)}&maxResults=8&key=${apiKey}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            booksByGenre[genre] = data.items || [];
        }

        displayBooks(booksByGenre); // Display books returned by the API
    } catch (error) {
        console.error('Error fetching books:', error);
        alert('Failed to fetch books. Please try again.');
    }
}

// Function to search for books
async function searchBooks(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const books = data.items || [];

        displaySearchResults(books); // Display search results
    } catch (error) {
        console.error('Error searching for books:', error);
        alert('Failed to search for books. Please try again.');
    }
}

// Function to display books by genre
function displayBooks(booksByGenre) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = ''; // Clear previous results

    for (const genre in booksByGenre) {
        const genreSection = document.createElement('div');
        genreSection.classList.add('genre-section');

        const genreTitle = document.createElement('h2');
        genreTitle.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
        genreSection.appendChild(genreTitle);

        const genreBooksContainer = document.createElement('div');
        genreBooksContainer.classList.add('genre-books-container');

        booksByGenre[genre].forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-container');

            const thumbnailUrl = book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg';

            bookItem.innerHTML = `
                <img src="${thumbnailUrl}" alt="${book.volumeInfo.title}" />
                <h3>${book.volumeInfo.title}</h3>
                <p>By ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
                <button class="view-details-btn" data-id="${book.id}">View Details</button>
                <button class="want-to-read-btn" data-id="${book.id}">Want to Read</button>
            `;

            bookItem.querySelector('.view-details-btn').addEventListener('click', () => {
                window.location.href = `review.html?bookId=${book.id}`;
            });

            bookItem.querySelector('.want-to-read-btn').addEventListener('click', () => {
                console.log(`Want to Read button clicked for book: ${book.volumeInfo.title}`);
                addToWantToRead(book);
            });

            genreBooksContainer.appendChild(bookItem);
        });

        genreSection.appendChild(genreBooksContainer);
        booksContainer.appendChild(genreSection);
    }
}

// Function to display search results
function displaySearchResults(books) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = ''; // Clear previous results

    if (!books.length) {
        booksContainer.innerHTML = '<p>No books found. Please try a different search term.</p>';
        return;
    }

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-container');

        const thumbnailUrl = book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg';

        bookItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="${book.volumeInfo.title}" />
            <h3>${book.volumeInfo.title}</h3>
            <p>By ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
            <button class="view-details-btn" data-id="${book.id}">View Details</button>
            <button class="want-to-read-btn" data-id="${book.id}">Want to Read</button>
        `;

        bookItem.querySelector('.view-details-btn').addEventListener('click', () => {
            window.location.href = `review.html?bookId=${book.id}`;
        });

        bookItem.querySelector('.want-to-read-btn').addEventListener('click', () => {
            const bookData = {
                bookId: book.id,
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors,
                thumbnail: thumbnailUrl
            };
            addToWantToRead(bookData);
            
        });

        booksContainer.appendChild(bookItem);
    });
}

async function addToWantToRead(book) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('You must be logged in to add books to your list.');
        window.location.href = '/pages/login.html'; // Redirect to login page if not logged in
        return;
    }

    const userBook = {
        userId: loggedInUser._id,
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors?.join(', ') || 'Unknown',
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg'
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