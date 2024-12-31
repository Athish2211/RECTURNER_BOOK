// Function to handle user sign-up
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const ageInput = document.getElementById('age').value.trim();
    const age = parseInt(ageInput, 10); // Convert to integer

    // Validate inputs
    if (!name || !email || !password || !age) {
        alert('All fields are required and age must be a valid number.');
        return;
    }

    const newUser = { name, email, password, age };

    try {
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Parse error response
            throw new Error(errorData.message || 'Sign-up failed'); // Throw custom error
        }

        alert('Signup successful! You can now log in.');
        window.location.href = '/login.html'; // Redirect to login page after successful signup
    } catch (error) {
        console.error('Error during signup:', error);
        alert(`Signup failed: ${error.message}`);
    }
});