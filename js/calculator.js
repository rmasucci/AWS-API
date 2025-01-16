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

        console.log('Token length:', accessToken ? accessToken.length : 'no token');
        console.log('Token first 20 chars:', accessToken ? accessToken.substring(0, 20) : 'no token');

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
        resultElement.textContent = `The product is: ${data.product}`;
    } catch (error) {
        console.error('Calculation error:', error);
        resultElement.textContent = 'Error calculating result';
    }
}