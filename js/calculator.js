/**
 * Calculator module with secure API calls
 * Implements authentication token handling and input validation
 */

async function calculate() {
    console.log('Calculate function called');
    if (!checkAuth()) {
        console.log('CheckAuth failed in calculate');
        return;
    }
    const num1 = document.getElementById('number1').value;
    const num2 = document.getElementById('number2').value;
    const resultElement = document.getElementById('result');
    console.log('Input values:', num1, num2);

    try {
        const userEmail = sessionStorage.getItem('userEmail');
        const accessToken = sessionStorage.getItem('access_token');
        console.log('User email and token:', userEmail ? 'Email exists' : 'No email', accessToken ? 'Token exists' : 'No token');

        if (!accessToken) {
            throw new Error('No authentication token available');
        }

        console.log('Making API call to:', config.apiEndpoint);
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
            console.log('API Response status:', response.status);
            if (response.status === 401) {
                console.log('Auth Error Details:', await response.text());
                alert('Authentication failed - check console for details');
                sessionStorage.clear();
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 5000);
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
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