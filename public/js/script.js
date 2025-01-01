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