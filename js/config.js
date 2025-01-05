/**
 * Security-critical configuration for AWS Cognito authentication.
 * All URLs must use HTTPS in production.
 */
const config = {
    // Cognito Configuration
    userPoolId: 'us-east-1_nfpYH8ZRY',
    clientId: '6sd335m3c12tt510u3eu4ve4du',
    domain: 'us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com',
    region: 'us-east-1',
    
    // OAuth 2.0 Settings
    scope: 'openid email profile',
    responseType: 'code', // Authorization Code Grant Flow
    
    // Application URLs (must be registered in Cognito)
    redirectUri: 'https://dl3afkou5pqln.cloudfront.net/callback.html',
    signoutUri: 'https://dl3afkou5pqln.cloudfront.net/index.html',
    
    // API Configuration
    apiEndpoint: 'https://9909whh55j.execute-api.us-east-1.amazonaws.com/prod/calculate'
};

// PKCE Configuration
const PKCE_CONFIG = {
    CODE_VERIFIER_LENGTH: 128,  // RFC 7636 recommends min 43 chars
    ALLOWED_CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
};