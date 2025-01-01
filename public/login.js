document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const userData = { email, password };

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const user = await response.json(); // Assuming this returns user data
        console.log('Logged in user:', user); // Debugging statement
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store user data

        alert('Login successful!');
        window.location.href = '/homepage.html'; // Redirect to homepage after login
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
    }
});