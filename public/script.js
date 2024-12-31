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
document.getElementById('search-btn').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    fetch(`/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const suggestionsList = document.getElementById('suggestions-list');
            suggestionsList.innerHTML = '';
            data.forEach(book => {
                const li = document.createElement('li');
                li.textContent = book.title;
                suggestionsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
});

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