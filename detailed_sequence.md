```mermaid
sequenceDiagram
   participant Client Browser
   participant App Frontend
   participant Cognito Auth
   participant API Gateway

   Note over Client Browser,API Gateway: OAuth 2.0 Authorization Code Grant Flow with PKCE

   %% Generate PKCE and Request Auth
   App Frontend->>App Frontend: Generate code_verifier (128 char random string)<br/>Store in sessionStorage
   App Frontend->>App Frontend: Generate code_challenge = SHA256(code_verifier)<br/>Base64URL encode
   App Frontend->>Cognito Auth: GET /oauth2/authorize<br/>client_id, code_challenge, redirect_uri,<br/>response_type=code, scope=openid email profile
   
   %% User Authentication 
   Cognito Auth->>Client Browser: Present login UI
   Client Browser->>Cognito Auth: Submit credentials

   %% Exchange Code for Tokens
   Cognito Auth->>App Frontend: Redirect with authorization_code
   App Frontend->>App Frontend: Retrieve code_verifier from sessionStorage
   App Frontend->>Cognito Auth: POST /oauth2/token<br/>code, code_verifier, client_id, redirect_uri
   Cognito Auth->>App Frontend: Returns access_token, id_token, refresh_token
   App Frontend->>App Frontend: Store tokens in sessionStorage:<br/>access_token, id_token (JWT format)

   %% Protected API Call
   Client Browser->>App Frontend: Calculate request
   App Frontend->>API Gateway: POST /calculate<br/>Authorization: Bearer {access_token}
   API Gateway->>Cognito Auth: Validate access_token
   Cognito Auth->>API Gateway: Token valid
   API Gateway->>App Frontend: Calculation result

   Note over Client Browser,API Gateway: Key Security Elements:<br/>1. PKCE prevents auth code interception<br/>2. Tokens stored in sessionStorage (cleared on tab close)<br/>3. JWTs used for id_token & access_token<br/>4. Bearer token auth for API calls
