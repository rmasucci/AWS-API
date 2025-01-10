```mermaid
sequenceDiagram
   participant Browser
   participant IndexHTML
   participant AuthJS
   participant CallbackHTML
   participant AppHTML
   participant CalcJS
   participant Cognito
   participant APIGateway

   %% Initial Auth Flow
   Browser->>IndexHTML: Click "Sign In"
   IndexHTML->>AuthJS: signIn()
   AuthJS->>AuthJS: Generate code_verifier (128 char)<br/>Store in sessionStorage
   AuthJS->>AuthJS: Generate code_challenge = SHA256(verifier)<br/>Base64URL encode
   AuthJS->>Cognito: GET /oauth2/authorize<br/>client_id, code_challenge,<br/>redirect_uri, response_type=code,<br/>scope=openid email profile
   
   %% User Login
   Cognito->>Browser: Present Cognito Hosted UI
   Browser->>Cognito: Submit credentials

   %% Code Exchange 
   Cognito->>CallbackHTML: Redirect with authorization_code
   CallbackHTML->>AuthJS: handleCallback()
   AuthJS->>AuthJS: Retrieve code_verifier<br/>from sessionStorage
   AuthJS->>Cognito: POST /oauth2/token<br/>code, code_verifier, client_id
   Cognito->>AuthJS: Return tokens (JWT format):<br/>access_token, id_token
   AuthJS->>AuthJS: Store tokens in sessionStorage
   AuthJS->>AppHTML: Redirect to app.html

   %% Protected App Flow
   AppHTML->>CalcJS: Enter calculation
   CalcJS->>AuthJS: Get access_token
   AuthJS->>CalcJS: Return token from sessionStorage
   CalcJS->>APIGateway: POST /calculate<br/>Authorization: Bearer {access_token}
   APIGateway->>Cognito: Validate token
   Cognito->>APIGateway: Token valid
   APIGateway->>CalcJS: Return result
   CalcJS->>AppHTML: Display result

   Note over Browser,APIGateway: Security Implementation:<br/>1. AuthJS handles PKCE & token management<br/>2. CallbackHTML processes OAuth redirect<br/>3. CalcJS retrieves token for API calls<br/>4. Tokens stored in sessionStorage (cleared on tab close)
