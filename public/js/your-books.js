document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('You must be logged in to view your books.');
        window.location.href = '/pages/login.html'; // Redirect to login if not logged in
        return;
    }

    const yourBooksContainer = document.getElementById('your-books-container');
    const yourBooks = JSON.parse(localStorage.getItem(`yourBooks-${loggedInUser.email}`)) || [];

    yourBooksContainer.innerHTML = '';
    if (yourBooks.length === 0) {
        yourBooksContainer.innerHTML = '<p>No books in your list. Start adding some!</p>';
        return;
    }

    yourBooks.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        bookItem.innerHTML = `
            <img src="${book.thumbnail}" alt="${book.title}" />
            <h3>${book.title}</h3>
            <p>By ${book.authors?.join(', ') || 'Unknown'}</p>
            <button class="want-to-read-btn" data-id="${book.bookId}">Want to Read</button>
        `;

        bookItem.querySelector('.want-to-read-btn').addEventListener('click', () => {
            addToWantToRead(book);
        });

        yourBooksContainer.appendChild(bookItem);
    });
});

async function addToWantToRead(book) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('You must be logged in to add books to your list.');
        window.location.href = '/pages/login.html'; // Redirect to login page if not logged in
        return;
    }

    const userBook = {
        userId: loggedInUser._id,
        bookId: book.bookId,
        title: book.title,
        authors: book.authors,
        thumbnail: book.thumbnail
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