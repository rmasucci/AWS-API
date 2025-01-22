/**
 * Calculator module with secure API calls
 * Implements authentication token handling and input validation
 */

async function calculate() {
    // Check if the user is authenticated
    if (!checkAuth()) return;

    const num1 = document.getElementById('number1').value;
    const num2 = document.getElementById('number2').value;
    const resultElement = document.getElementById('result');

    // Input validation
    if (num1 === '' || num2 === '') {
        resultElement.textContent = 'Please enter both numbers.';
        return;
    }

    try {
        const userEmail = sessionStorage.getItem('userEmail');
        const idToken = sessionStorage.getItem('id_token');

        console.log('ID Token length:', idToken ? idToken.length : 'No token found');
        console.log('ID Token first 20 chars:', idToken ? idToken.substring(0, 20) : 'No token found');

        if (!idToken) {
            throw new Error('No authentication token available');
        }

        // Make the API call
        const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                num1: parseFloat(num1),
                num2: parseFloat(num2),
                userEmail: userEmail
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.log('Auth Error Details:', await response.text());
                alert('Authentication failed - check console for details');
                sessionStorage.clear();
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 5000); // Redirect after a short delay
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        resultElement.textContent = `The product is: ${data.product}`;
    } catch (error) {
        console.error('Calculation error:', error);
        resultElement.textContent = 'Error calculating result';
    }
}

// Check if the user is authenticated
function checkAuth() {
    const idToken = sessionStorage.getItem('id_token');

    if (idToken) {
        try {
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);

            if (payload.exp < now) {
                console.warn('ID token expired');
                sessionStorage.clear();
                window.location.href = '/index.html';
                return false;
            }

            console.log('User authenticated:', payload);
            return true;
        } catch (error) {
            console.error('Failed to parse ID token:', error);
            sessionStorage.clear();
            window.location.href = '/index.html';
            return false;
        }
    } else {
        console.warn('No ID token found, redirecting to login');
        window.location.href = '/index.html';
        return false;
    }
}
