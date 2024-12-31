document.addEventListener('DOMContentLoaded', () => {
    fetchBooksFromGoogle();
});

// Function to fetch books for the homepage from multiple genres
async function fetchBooksFromGoogle() {
    const genres = ['fiction', 'mystery', 'fantasy', 'romance', 'biography'];
    const apiKey = 'AIzaSyB_cCice-LLGG8DHOJsMLTgEFb45moca80';
    const booksByGenre = {};

    try {
        for (const genre of genres) {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(genre)}&maxResults=10&key=${apiKey}`);
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

// Function to display books on the homepage
function displayBooks(booksByGenre) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = ''; // Clear previous results

    for (const [genre, books] of Object.entries(booksByGenre)) {
        const genreSection = document.createElement('div');
        genreSection.classList.add('genre-section');

        const genreTitle = document.createElement('h2');
        genreTitle.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
        genreSection.appendChild(genreTitle);

        const genreBooksContainer = document.createElement('div');
        genreBooksContainer.classList.add('genre-books-container');

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
                console.log(`Want to Read button clicked for book: ${book.volumeInfo.title}`);
                addToWantToRead(book);
            });

            genreBooksContainer.appendChild(bookItem);
        });

        genreSection.appendChild(genreBooksContainer);
        booksContainer.appendChild(genreSection);
    }
}

// Function to save a book to the user's list
async function addToWantToRead(book) {
    console.log(`addToWantToRead called from book:'+${book.volumeInfo.title}`);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('You must be logged in to add books to your list.');
        window.location.href = '/login.html'; // Redirect to login page if not logged in
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

        alert(`${userBook.title} added to your books.`);
    } catch (error) {
        console.error('Error saving book:', error);
        alert('Failed to save book. Please try again.');
    }
}
