```mermaid
sequenceDiagram
    participant Browser
    participant IndexHTML
    participant AuthJS
    participant CallbackHTML
    participant AppHTML
    participant CalcJS
    participant CognitoHostedUI
    participant CognitoTokenEndpoint
    participant CognitoAuthorizer
    participant APIGateway

    %% Initial Auth Flow
    Browser->>IndexHTML: Click "Sign In"
    IndexHTML->>AuthJS: signIn()
    AuthJS->>AuthJS: Generate code_verifier (128 char)<br/>Store in sessionStorage
    AuthJS->>AuthJS: Generate code_challenge = SHA256(verifier)<br/>Base64URL encode
    AuthJS->>CognitoHostedUI: GET /oauth2/authorize<br/>client_id, code_challenge,<br/>redirect_uri, response_type=code,<br/>scope=openid email profile
    
    %% User Login
    CognitoHostedUI->>Browser: Present login interface
    Browser->>CognitoHostedUI: Submit credentials

    %% Code Exchange 
    CognitoHostedUI->>CallbackHTML: Redirect with authorization_code
    CallbackHTML->>AuthJS: handleCallback()
    AuthJS->>AuthJS: Retrieve code_verifier<br/>from sessionStorage
    AuthJS->>CognitoTokenEndpoint: POST /oauth2/token<br/>code, code_verifier, client_id
    CognitoTokenEndpoint->>AuthJS: Return tokens (JWT format):<br/>access_token, id_token
    AuthJS->>AuthJS: Store tokens in sessionStorage
    AuthJS->>AppHTML: Redirect to app.html

    %% Protected App Flow
    AppHTML->>CalcJS: Enter calculation
    CalcJS->>AuthJS: Get access_token
    AuthJS->>CalcJS: Return token from sessionStorage
    CalcJS->>APIGateway: POST /calculate<br/>Authorization: Bearer {access_token}
    APIGateway->>CognitoAuthorizer: Validate token
    CognitoAuthorizer->>APIGateway: Token valid
    APIGateway->>CalcJS: Return result
    CalcJS->>AppHTML: Display result

    Note over Browser,APIGateway: Cognito Components:<br/>1. Hosted UI: Handles login interface<br/>2. Token Endpoint: Issues JWTs<br/>3. Authorizer: Validates tokens for API
