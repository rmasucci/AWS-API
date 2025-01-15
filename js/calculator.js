/**
 * Calculator module with secure API calls
 * Implements authentication token handling and input validation
 */

async function calculate() {
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
        const accessToken = sessionStorage.getItem('access_token');

        if (!accessToken) {
            throw new Error('No authentication token available');
        }

        const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                num1: parseFloat(num1),
                num2: parseFloat(num2),
                userEmail: userEmail
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
        // Token might be expired
        console.log('Auth Error Details:', await response.text());  // Log the error response
        alert('Authentication failed - check console for details'); // Give us time to check
        sessionStorage.clear();
        setTimeout(() => {                     // Delay redirect
            window.location.href = '/index.html';
        }, 5000);  // 5 second delay
        return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        resultElement.textContent = `The product is: ${data.product}`;
    } catch (error) {
        console.error('Calculation error:', error);
        resultElement.textContent = 'Error calculating result';
    }
}

// Set up page on load
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        const userEmail = sessionStorage.getItem('userEmail');
        if (userEmail) {
            document.getElementById('userEmail').textContent = userEmail;
        }
    }
});