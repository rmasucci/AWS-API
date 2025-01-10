sequenceDiagram
    participant Client
    participant IndexHTML
    participant CallbackHTML
    participant AppHTML
    participant AuthJS
    participant CalcJS
    participant Cognito
    participant APIGateway

    %% Initial Application Load
    Client->>IndexHTML: Access index.html
    IndexHTML->>AuthJS: Load auth.js
    
    %% Sign In Initiation
    Client->>IndexHTML: Click "Sign In with Cognito"
    IndexHTML->>AuthJS: Call signIn()
    
    %% PKCE Setup
    Note over AuthJS: Generate PKCE code_verifier<br/>Store in sessionStorage
    Note over AuthJS: Generate code_challenge<br/>using SHA-256
    Note over AuthJS: Generate state parameter<br/>Store in sessionStorage
    
    %% Cognito Authorization Request
    AuthJS->>Cognito: Redirect to /oauth2/authorize with:<br/>client_id, response_type, scope,<br/>redirect_uri, code_challenge, state
    
    %% User Authentication
    Cognito->>Client: Present Cognito hosted UI
    Client->>Cognito: Enter credentials
    
    %% Authorization Code Grant
    Cognito->>CallbackHTML: Redirect to callback.html with<br/>authorization code & state
    CallbackHTML->>AuthJS: Load auth.js
    AuthJS->>AuthJS: handleCallback()
    Note over AuthJS: Verify state parameter
    Note over AuthJS: Retrieve code_verifier
    
    %% Token Exchange
    AuthJS->>Cognito: POST /oauth2/token with<br/>code & code_verifier
    Cognito->>AuthJS: Return tokens<br/>(access, id, refresh)
    Note over AuthJS: Store tokens in sessionStorage<br/>Extract user email from id_token
    AuthJS->>AppHTML: Redirect to app.html
    
    %% Protected App Initialization
    AppHTML->>AuthJS: Load auth.js
    AppHTML->>CalcJS: Load calculator.js
    AuthJS->>AuthJS: checkAuth()
    AuthJS->>AppHTML: Display user email
    
    %% Calculator Operation
    Client->>AppHTML: Enter numbers
    Client->>CalcJS: Click Calculate
    CalcJS->>AuthJS: Get access token
    
    %% Protected API Call
    CalcJS->>APIGateway: POST /calculate with<br/>Bearer token
    APIGateway->>Cognito: Validate token
    Cognito->>APIGateway: Token valid
    APIGateway->>CalcJS: Return result
    CalcJS->>AppHTML: Display result
    
    %% Sign Out
    Client->>AppHTML: Click Sign Out
    AppHTML->>AuthJS: Call signOut()
    Note over AuthJS: Clear sessionStorage
    AuthJS->>Cognito: Redirect to /logout
    Cognito->>IndexHTML: Redirect to index.html
