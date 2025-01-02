const userManager = new Oidc.UserManager({
    authority: `https://${config.domain}`,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    filterProtocolClaims: true,
    loadUserInfo: true,
    post_logout_redirect_uri: config.postLogoutRedirectUri
});

// Handle login button click
function login() {
    userManager.signinRedirect();
}

// Handle OAuth callback
async function handleCallback() {
    try {
        const user = await userManager.signinRedirectCallback();
        window.location.href = '/app.html';
    } catch (error) {
        console.error('Callback error:', error);
        window.location.href = '/index.html';
    }
}

// Check if user is authenticated
async function checkAuth() {
    try {
        const user = await userManager.getUser();
        if (!user) {
            window.location.href = '/index.html';
        }
        return user;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/index.html';
    }
}

// Handle logout
function logout() {
    userManager.signoutRedirect();
}

// If we're in the app page, check auth and show user info
if (window.location.pathname.includes('app.html')) {
    checkAuth().then(user => {
        if (user) {
            document.getElementById('userEmail').textContent = user.profile.email;
        }
    });
}