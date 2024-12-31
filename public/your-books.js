document.addEventListener('DOMContentLoaded', () => {
    fetchYourBooks();
});

async function fetchYourBooks() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    console.log('Logged in user:', loggedInUser); // Debugging statement
    if (!loggedInUser) {
        alert('You must be logged in to view your books.');
        window.location.href = '/login.html'; // Redirect to login page if not logged in
        return;
    }

    try {
        console.log('Fetching books for user:', loggedInUser._id); // Debugging statement
        const response = await fetch(`/api/user-books/${loggedInUser._id}`);
        if (!response.ok) throw new Error('Failed to fetch your books');

        const books = await response.json();
        console.log('Fetched books:', books); // Debugging statement
        displayYourBooks(books);
    } catch (error) {
        console.error('Error fetching your books:', error);
        alert('Failed to fetch your books. Please try again.');
    }
}

function displayYourBooks(books) {
    const yourBooksContainer = document.getElementById('your-books-container');
    yourBooksContainer.innerHTML = ''; // Clear existing books

    if (!books.length) {
        yourBooksContainer.innerHTML = '<p>No books found in your list.</p>';
        return;
    }

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        bookItem.innerHTML = `
            <img src="${book.thumbnail}" alt="${book.title}" />
            <h3>${book.title}</h3>
            <p>By ${book.authors?.join(', ') || 'Unknown'}</p>
        `;

        yourBooksContainer.appendChild(bookItem);
    });
}