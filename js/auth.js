// Initialize userManager and attach it to the global window object
window.userManager = new Oidc.UserManager({
    authority: config.authority,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    filterProtocolClaims: true,
    loadUserInfo: true
});

console.log('userManager initialized:', window.userManager);

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        // Attach login functionality to the login button
        loginButton.addEventListener('click', () => login(window.userManager));
    }

    // Handle the callback if on the callback page
    if (window.location.pathname.includes('callback.html')) {
        handleCallback(window.userManager);
    }

    // Check authentication and update UI if on the app page
    if (window.location.pathname.includes('app.html')) {
        checkAuth(window.userManager).then(user => {
            if (user) {
                const userEmailElement = document.getElementById('userEmail');
                if (userEmailElement) {
                    userEmailElement.textContent = user.profile.email;
                }
            }
        });
    }
});

// Function to initiate login
function login(userManager) {
    userManager.signinRedirect().catch(error => {
        console.error('Login failed:', error);
    });
}

// Function to handle the callback
async function handleCallback(userManager) {
    try {
        const user = await userManager.signinRedirectCallback();
        console.log('Callback successful:', user);
        window.location.href = '/app.html';
    } catch (error) {
        console.error('Callback error:', error.message);
        console.error('Callback error stack:', error.stack);
        alert('Authentication failed. Redirecting to login page.');
        window.location.href = '/index.html';
    }
}

// Function to check authentication
async function checkAuth(userManager) {
    try {
        const user = await userManager.getUser();
        if (!user) {
            console.warn('No user found. Redirecting to login page.');
            window.location.href = '/index.html';
            return null;
        }
        return user;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/index.html';
        return null;
    }
}

// Function to handle logout
function logout(userManager) {
    userManager.signoutRedirect().catch(error => {
        console.error('Logout failed:', error);
    });
}
