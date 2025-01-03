document.addEventListener('DOMContentLoaded', () => {
    const userManager = new Oidc.UserManager({
        authority: `https://${config.domain}`,
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        filterProtocolClaims: true,
        loadUserInfo: true
    });

    // Attach login button event
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => login(userManager));
    }

    // If on the callback page, handle the OAuth callback
    if (window.location.pathname.includes('callback.html')) {
        handleCallback(userManager);
    }

    // If on the app page, check authentication
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

// Handle login button click
function login(userManager) {
    userManager.signinRedirect().catch(error => {
        console.error('Login failed:', error);
    });
}

// Handle OAuth callback
async function handleCallback(userManager) {
    try {
        const user = await userManager.signinRedirectCallback();
        console.log('Callback successful:', user);
        window.location.href = '/app.html';
    } catch (error) {
        console.error('Callback error:', error);
        alert('Authentication failed. Redirecting to login page.');
        window.location.href = '/index.html';
    }
}

// Check if user is authenticated
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

// Handle logout
function logout(userManager) {
    userManager.signoutRedirect().catch(error => {
        console.error('Logout failed:', error);
    });
}
