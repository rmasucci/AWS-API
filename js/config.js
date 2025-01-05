const config = {
    userPoolId: 'us-east-1_nfpYH8ZRY',
    scope: 'openid email profile',
    clientId: '6sd335m3c12tt510u3eu4ve4du',
    domain: 'us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com',
    region: 'us-east-1',
    redirectUri: 'https://dl3afkou5pqln.cloudfront.net/callback.html',
    signoutUri: 'https://dl3afkou5pqln.cloudfront.net/index.html',
    apiEndpoint: 'https://9909whh55j.execute-api.us-east-1.amazonaws.com/prod/calculate'
};

// Configure AWS SDK
//AWS.config.region = config.region;

const poolData = {
    UserPoolId: config.userPoolId,
    ClientId: config.clientId
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

/*const config = {
    authority: "https://us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com",
    clientId: "6sd335m3c12tt510u3eu4ve4du",
    redirectUri: "https://dl3afkou5pqln.cloudfront.net/callback.html",
    postLogoutRedirectUri: "https://dl3afkou5pqln.cloudfront.net/index.html",
    authorizationEndpoint: "https://us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com/oauth2/authorize",
    tokenEndpoint: "https://us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com/oauth2/token",
    userInfoEndpoint: "https://us-east-1nfpyh8zry.auth.us-east-1.amazoncognito.com/oauth2/userInfo",
    responseType: "code",
    scope: "openid email profile"
};
*/