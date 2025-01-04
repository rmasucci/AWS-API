// Include metadata manually to bypass .well-known/openid-configuration
const metadata = {
    authorization_endpoint: "https://us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com/oauth2/authorize",
    token_endpoint: "https://us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com/oauth2/token",
    userinfo_endpoint: "https://us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com/oauth2/userInfo",
    end_session_endpoint: "https://us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com/oauth2/logout"
};

// Initialize userManager with explicit metadata
window.userManager = new Oidc.UserManager({
    authority: config.authority,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    filterProtocolClaims: true,
    loadUserInfo: true,
    metadata: metadata // Pass explicit metadata here
});

console.log('userManager initialized:', window.userManager);

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => login(window.userManager));
        console.log('Login button event listener added.');
    }
});

// Login function
function login(userManager) {
    console.log('Initiating login...');
    userManager.signinRedirect().catch(error => {
        console.error('Login failed:', error);
    });
}
