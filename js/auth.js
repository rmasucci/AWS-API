document.addEventListener('DOMContentLoaded', () => {
    // Initialize the OIDC User Manager with the configuration settings.
    const userManager = new Oidc.UserManager({
        authority: `https://${config.domain}`, // The authorization server's base URL.
        client_id: config.clientId,           // The client ID of the Cognito app.
        redirect_uri: config.redirectUri,     // The URI to redirect to after login.
        response_type: 'code',                // The OAuth response type, requesting an authorization code.
        scope: 'openid email profile',        // The scopes requested during authentication.
        filterProtocolClaims: true,           // Filters out protocol claims from the user info.
        loadUserInfo: true                    // Automatically loads additional user info after login.
    });

    // Attach login functionality to the login button if it exists on the page.
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => login(userManager));
    }

    // Handle the OAuth callback if the current page is the callback page.
    if (window.location.pathname.includes('callback.html')) {
        handleCallback(userManager);
    }

    // On the app page, check if the user is authenticated.
    // If authenticated, display the user's email in the UI.
    if (window.location.pathname.includes('app.html')) {
        checkAuth(userManager).then(user => {
            if (user) {
                const userEmailElement = document.getElementById('userEmail');
                if (userEmailElement) {
                    userEmailElement.textContent = user.profile.email;
                }
            }
        });
    }
});

// Initiates the login process by redirecting to the authorization server.
function login(userManager) {
    userManager.signinRedirect().catch(error => {
        console.error('Login failed:', error); // Logs any error during the login process.
    });
}

// Handles the callback after the authorization server redirects back to the app.
async function handleCallback(userManager) {
    try {
        const user = await userManager.signinRedirectCallback(); // Completes the login process and retrieves user info.
        console.log('Callback successful:', user);              // Logs the successfully retrieved user info.
        window.location.href = '/app.html';                     // Redirects the user to the main app page.
    } catch (error) {
        console.error('Callback error:', error);                // Logs any error that occurs during the callback.
        alert('Authentication failed. Redirecting to login page.'); // Alerts the user of the failure.
        window.location.href = '/index.html';                   // Redirects to the login page.
    }
}

// Checks if the user is authenticated.
// If not, redirects to the login page.
async function checkAuth(userManager) {
    try {
        const user = await userManager.getUser(); // Retrieves the current user's details.
        if (!user) {
            console.warn('No user found. Redirecting to login page.'); // Warns if no user is found.
            window.location.href = '/index.html';                      // Redirects to the login page.
            return null;
        }
        return user; // Returns the authenticated user.
    } catch (error) {
        console.error('Auth check failed:', error); // Logs any error during the authentication check.
        window.location.href = '/index.html';      // Redirects to the login page if an error occurs.
        return null;
    }
}

// Initiates the logout process by redirecting to the logout endpoint.
function logout(userManager) {
    userManager.signoutRedirect().catch(error => {
        console.error('Logout failed:', error); // Logs any error during the logout process.
    });
}
