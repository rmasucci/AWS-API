// Debugging: Check if config.js loaded and contains the required values
console.log('Config loaded:', config);

// Debugging: Check if Oidc.UserManager is available
if (typeof Oidc === 'undefined' || typeof Oidc.UserManager === 'undefined') {
    console.error('Oidc.UserManager is not available. Ensure oidc-client.min.js is loaded.');
} else {
    console.log('Oidc.UserManager is available.');
}

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

// Debugging: Verify that userManager is initialized
console.log('userManager initialized:', window.userManager);

document.addEventListener('DOMContentLoaded', () => {
    // Attach login functionality to the login button
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => login(window.userManager));
        console.log('Login button event listener added.');
    } else {
        console.warn('Login button not found. Ensure the button has id="loginButton".');
    }

    // Handle the callback if on the callback page
    if (window.location.pathname.includes('callback.html')) {
        console.log('Handling callback on callback.html...');
        handleCallback(window.userManager);
    }

    // Check authentication and update UI if on the app page
    if (window.location.pathname.includes('app.html')) {
        console.log('Checking authentication on app.html...');
        checkAuth(window.userManager).then(user => {
            if (user) {
                const userEmailElement = document.getElementById('userEmail');
                if (userEmailElement) {
                    userEmailElement.textContent = user.profile.email;
                    console.log('User email set in UI:', user.profile.email);
                } else {
                    console.warn('User email element not found. Ensure the element has id="userEmail".');
                }
            } else {
                console.warn('No user found on app.html.');
            }
        }).catch(error => {
            console.error('Error during authentication check:', error);
        });
    }
});

// Function to initiate login
function login(userManager) {
    console.log('Initiating login...');
    userManager.signinRedirect().catch(error => {
        console.error('Login failed:', error);
    });
}

// Function to handle the callback
async function handleCallback(userManager) {
    try {
        console.log('Handling OIDC callback...');
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
    console.log('Checking authentication...');
    try {
        const user = await userManager.getUser();
        if (!user) {
            console.warn('No user found. Redirecting to login page.');
            window.location.href = '/index.html';
            return null;
        }
        console.log('User authenticated:', user);
        return user;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/index.html';
        return null;
    }
}

// Function to handle logout
function logout(userManager) {
    console.log('Initiating logout...');
    userManager.signoutRedirect().catch(error => {
        console.error('Logout failed:', error);
    });
}
