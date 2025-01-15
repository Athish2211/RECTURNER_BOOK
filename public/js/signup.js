document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const age = document.getElementById('age').value.trim();

    if (!name || !email || !password || !age) {
        alert('Please fill in all fields.');
        return;
    }

    const newUser = { name, email, password, age };

    try {
        console.log('Sending signup request:', newUser);
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText); 
            throw new Error(errorText || 'Sign-up failed');
        }

        alert('Signup successful! You can now log in.');
        window.location.href = '/pages/login.html';
    } catch (error) {
        console.error('Error during signup:', error);
        alert(`Signup failed: ${error.message}`);
    }
});