/**
 * Security-enhanced authentication module implementing PKCE
 * (Proof Key for Code Exchange - RFC 7636)
 */

// Generate cryptographically secure random string for PKCE
function generateCodeVerifier() {
    const array = new Uint8Array(PKCE_CONFIG.CODE_VERIFIER_LENGTH);
    crypto.getRandomValues(array);
    
    return Array.from(array)
        .map(b => PKCE_CONFIG.ALLOWED_CHARS.charAt(b % PKCE_CONFIG.ALLOWED_CHARS.length))
        .join('');
}

// Generate code challenge using SHA-256 (required for PKCE)
async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Initialize sign-in with PKCE
async function signIn() {
    try {
        // Generate and store PKCE verifier
        const codeVerifier = generateCodeVerifier();
        sessionStorage.setItem('code_verifier', codeVerifier);
        
        // Generate code challenge
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        // Generate and store state parameter for CSRF protection
        const state = generateCodeVerifier().slice(0, 32);
        sessionStorage.setItem('auth_state', state);

        // Construct authorization URL with PKCE parameters
        const authUrl = `https://${config.domain}/oauth2/authorize?` +
            `client_id=${config.clientId}&` +
            `response_type=${config.responseType}&` +
            `scope=${encodeURIComponent(config.scope)}&` +
            `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
            `code_challenge=${encodeURIComponent(codeChallenge)}&` +
            `code_challenge_method=S256&` +
            `state=${state}`;
        
        window.location.href = authUrl;
    } catch (error) {
        console.error('Sign-in initialization failed:', error);
        alert('Authentication failed. Please try again.');
    }
}

// Handle OAuth callback and token exchange
// Handle OAuth callback and token exchange
async function handleCallback() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const savedState = sessionStorage.getItem('auth_state');
        const codeVerifier = sessionStorage.getItem('code_verifier');

        // Verify state parameter to prevent CSRF
        if (!state || state !== savedState) {
            throw new Error('Invalid state parameter');
        }

        if (!code || !codeVerifier) {
            throw new Error('Missing authentication parameters');
        }

        // Exchange code for tokens
        const tokenResponse = await fetch(`https://${config.domain}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: config.clientId,
                code: code,
                redirect_uri: config.redirectUri,
                code_verifier: codeVerifier
            })
        });

        if (!tokenResponse.ok) {
            throw new Error('Token exchange failed');
        }

        const tokens = await tokenResponse.json();
        console.log('Token exchange successful');  // ADD THIS LOG HERE
        
        // Store tokens securely
        sessionStorage.setItem('access_token', tokens.access_token);
        sessionStorage.setItem('id_token', tokens.id_token);
        console.log('Tokens stored in session');  // ADD THIS LOG HERE
        
        // Extract and store user email from ID token
        const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
        sessionStorage.setItem('userEmail', payload.email);

        // Clean up PKCE and state parameters
        sessionStorage.removeItem('code_verifier');
        sessionStorage.removeItem('auth_state');

        // Redirect to app
        window.location.href = '/app.html';
    } catch (error) {
        console.error('Authentication failed:', error);  // THIS LOG IS ALREADY THERE
        window.location.href = '/index.html';
    }
}

// Verify authentication status
function checkAuth() {
    const token = sessionStorage.getItem('access_token');
    console.log('Checking auth token:', token ? 'Token exists' : 'No token found');
    if (!token) {
        console.log('No token - redirecting to login');
        window.location.href = '/index.html';
        return false;
    }
    return true;
}