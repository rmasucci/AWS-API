async function calculate() {
    const user = await userManager.getUser();
    if (!user) {
        window.location.href = '/index.html';
        return;
    }

    const num1 = document.getElementById('number1').value;
    const num2 = document.getElementById('number2').value;
    const resultElement = document.getElementById('result');

    if (num1 === '' || num2 === '') {
        resultElement.textContent = 'Please enter both numbers.';
        return;
    }

    try {
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
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        resultElement.textContent = `The product is: ${data.product}`;
    } catch (error) {
        console.error('Error:', error);
        resultElement.textContent = 'Error calculating result';
    }
}