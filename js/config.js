const config = {
    userPoolId: 'us-east-1_xxxxxx', // Your User Pool ID
    clientId: 'xxxxxxxxxxxxxxxxxx',  // Your App Client ID
    domain: 'your-domain-prefix.auth.us-east-1.amazoncognito.com',
    region: 'us-east-1',
    apiEndpoint: 'https://your-api-gateway-url/prod/calculate',
    redirectUri: 'https://your-cloudfront-domain/callback.html',
    postLogoutRedirectUri: 'https://your-cloudfront-domain/index.html'
};