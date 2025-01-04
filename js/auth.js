function signIn() {
    const authUrl = `https://${config.domain}/login?` +
        `client_id=${config.clientId}&` +
        `response_type=code&` +
        `scope=openid+email+profile&` +
        `redirect_uri=${encodeURIComponent(config.redirectUri)}`;
    
    window.location.href = authUrl;
}

async function handleCallback() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            // Exchange code for tokens
            // Redirect to app page
            window.location.href = '/app.html';
        }
    } catch (error) {
        console.error('Error handling callback:', error);
        window.location.href = '/index.html';
    }
}

function signOut() {
    const signOutUrl = `https://${config.domain}/logout?` +
        `client_id=${config.clientId}&` +
        `logout_uri=${encodeURIComponent(config.signoutUri)}`;
    
    window.location.href = signOutUrl;
}