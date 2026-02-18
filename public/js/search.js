document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');
    if (query) {
        searchBooks(query);
    }
});

function handleSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert('Please enter a search term.');
        return;
    }

    // Redirect to the homepage with the search query as a URL parameter
    window.location.href = `homepage.html?search=${encodeURIComponent(query)}`;
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

// Function to add a book to the user's "Want to Read" list
async function addToWantToRead(book) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        window.location.replace('/pages/login.html');
        return;
    }

    const authors = book.authors;
    const userBook = {
        userId: loggedInUser._id,
        bookId: book.bookId || book.id,
        title: book.title || 'Unknown',
        authors: Array.isArray(authors) ? authors : (authors ? [String(authors)] : ['Unknown']),
        thumbnail: book.thumbnail || 'default-thumbnail.jpg'
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
        alert(error.message || 'Failed to save book. Please try again.');
    }
}