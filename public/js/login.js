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

        const data = await response.json();
        const user = data.user || data; // support both { user } and plain user
        if (!user || !user._id) throw new Error('Invalid login response');
        console.log('Logged in user:', user);
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store user object (name, email, _id)

        alert('Login successful!');
        window.location.href = '/pages/homepage.html'; // Redirect to homepage after login
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
    }
});