document.addEventListener('DOMContentLoaded', async () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || !loggedInUser._id) {
        window.location.replace('/pages/login.html');
        return;
    }

    const yourBooksContainer = document.getElementById('your-books-container');
    yourBooksContainer.innerHTML = '<p>Loading your books...</p>';

    try {
        const response = await fetch(`/api/user-books/${loggedInUser._id}`);
        if (!response.ok) throw new Error('Failed to load books');
        const yourBooks = await response.json();
        yourBooksContainer.innerHTML = '';

        if (!yourBooks.length) {
            yourBooksContainer.innerHTML = '<p>No books in your list. Start adding some from Home or Search!</p>';
            return;
        }

        yourBooks.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            const title = (book.title && String(book.title).trim()) || 'Unknown';
            const authors = Array.isArray(book.authors) ? book.authors.join(', ') : (book.authors != null ? String(book.authors) : 'Unknown');
            const thumb = book.thumbnail || 'default-thumbnail.jpg';
            const bid = (book.bookId != null && book.bookId !== '') ? String(book.bookId) : '';
            bookItem.innerHTML = `
                <img src="${thumb}" alt="${title}" />
                <h3>${title}</h3>
                <p>By ${authors}</p>
                ${bid ? `<a href="../pages/review.html?bookId=${encodeURIComponent(bid)}" class="view-details-link">View Details</a>` : ''}
            `;
            yourBooksContainer.appendChild(bookItem);
        });
    } catch (err) {
        console.error('Error loading your books:', err);
        yourBooksContainer.innerHTML = '<p>Failed to load your books. Please try again.</p>';
    }
});