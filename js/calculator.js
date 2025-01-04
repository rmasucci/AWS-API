async function calculate() {
    // Retrieves the currently logged-in user's details using userManager.getUser().
    // If the user is not authenticated (null or undefined), redirects to the login page (/index.html).
    const user = await userManager.getUser();
    if (!user) {
        window.location.href = '/index.html';
        return;
    }

    // Gets the input values for the two numbers from the input fields with IDs 'number1' and 'number2'.
    // Retrieves the result element to display feedback or results to the user.
    const num1 = document.getElementById('number1').value;
    const num2 = document.getElementById('number2').value;
    const resultElement = document.getElementById('result');

    // Checks if either of the input fields is empty.
    // If true, displays an error message in the result element and stops further execution.
    if (num1 === '' || num2 === '') {
        resultElement.textContent = 'Please enter both numbers.';
        return;
    }

    try {
        // Sends a POST request to the backend API (config.apiEndpoint) with the two numbers as JSON.
        // Includes an Authorization header with the user's access token to authenticate the request.
        const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`
            },
            body: JSON.stringify({
                num1: parseFloat(num1),
                num2: parseFloat(num2)
            })
       
