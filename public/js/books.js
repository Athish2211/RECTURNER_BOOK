document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');

    if (query) {
        searchBooks(query);
    } else {
        fetchBooksFromGoogle();
    }
});

// Function to fetch books for the homepage from multiple genres (via server proxy using .env key)
async function fetchBooksFromGoogle() {
    const genres = ['subject:fiction', 'subject:mystery', 'subject:fantasy', 'subject:romance', 'subject:biography'];
    const genreLabels = { 'subject:fiction': 'Fiction', 'subject:mystery': 'Mystery', 'subject:fantasy': 'Fantasy', 'subject:romance': 'Romance', 'subject:biography': 'Biography' };
    const booksByGenre = {};

    try {
        for (const genre of genres) {
            const response = await fetch(`/api/books/google?q=${encodeURIComponent(genre)}&maxResults=8`);
            if (!response.ok) {
                const err = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(err.message || 'Network response was not ok');
            }
            const data = await response.json();
            booksByGenre[genre] = (data.items || []).filter(Boolean);
        }
        displayBooks(booksByGenre, genreLabels);
    } catch (error) {
        console.error('Error fetching books:', error);
        alert(error.message || 'Failed to fetch books. Please try again.');
    }
}

// Function to search for books (via server proxy)
async function searchBooks(query) {
    try {
        const response = await fetch(`/api/books/google?q=${encodeURIComponent(query)}&maxResults=12`);
        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(err.message || 'Network response was not ok');
        }
        const data = await response.json();
        displaySearchResults(data.items || []);
    } catch (error) {
        console.error('Error searching for books:', error);
        alert(error.message || 'Failed to search for books. Please try again.');
    }
}

// Function to display books by genre
function displayBooks(booksByGenre, genreLabels) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = '';

    for (const genre in booksByGenre) {
        const items = booksByGenre[genre];
        if (!items || items.length === 0) continue;

        const genreSection = document.createElement('div');
        genreSection.classList.add('genre-section');
        const label = (genreLabels && genreLabels[genre]) || genre.replace(/^subject:/, '').replace(/\b\w/g, c => c.toUpperCase());
        const genreTitle = document.createElement('h2');
        genreTitle.textContent = label;
        genreSection.appendChild(genreTitle);

        const genreBooksContainer = document.createElement('div');
        genreBooksContainer.classList.add('genre-books-container');

        items.forEach(book => {
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
        window.location.replace('/pages/login.html');
        return;
    }

    const authors = book.volumeInfo.authors;
    const userBook = {
        userId: loggedInUser._id,
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: Array.isArray(authors) ? authors : (authors ? [String(authors)] : ['Unknown']),
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg'
    };

    try {
        const response = await fetch('/api/user-books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userBook),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to save book');
        }

        alert(`${userBook.title} added to your books.`);
    } catch (error) {
        console.error('Error saving book:', error);
        alert('Failed to save book. Please try again.');
    }
}