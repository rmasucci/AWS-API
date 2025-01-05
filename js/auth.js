// Generate random string for PKCE
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Generate code challenge from verifier
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function signIn() {
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