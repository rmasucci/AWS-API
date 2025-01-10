```mermaid
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
    
    %% Sign In Flow
    Client->>IndexHTML: Click "Sign In with Cognito"
    IndexHTML->>AuthJS: Call signIn()
    
    %% PKCE Setup
    Note over AuthJS: Generate PKCE code_verifier<br/>Store in sessionStorage
    Note over AuthJS: Generate code_challenge<br/>using SHA-256
    Note over AuthJS: Generate state parameter<br/>Store in sessionStorage
    
    %% Cognito Authorization
    AuthJS->>Cognito: Redirect to /oauth2/authorize
    Cognito->>Client: Present login UI
    Client->>Cognito: Enter credentials
    
    %% Callback Processing
    Cognito->>CallbackHTML: Redirect with code & state
    CallbackHTML->>AuthJS: handleCallback()
    AuthJS->>Cognito: Exchange code for tokens
    Cognito->>AuthJS: Return tokens
    
    %% Protected App Init
    AuthJS->>AppHTML: Redirect to app.html
    AppHTML->>AuthJS: Load auth.js
    AppHTML->>CalcJS: Load calculator.js
    
    %% Page Load Check
    CalcJS->>AuthJS: checkAuth()
    alt No valid token
        AuthJS->>IndexHTML: Redirect to index.html
    end
    
    CalcJS->>AppHTML: Display user email
    
    %% Calculator Operation
    Client->>AppHTML: Enter numbers
    Client->>CalcJS: Click Calculate
    
    %% Input Validation
    Note over CalcJS: Validate input numbers
    alt Invalid Input
        CalcJS->>AppHTML: Display validation error
    end
    
    %% API Call with Error Handling
    CalcJS->>AuthJS: Get access token
    
    alt No Token Available
        CalcJS->>AppHTML: Display auth error
        CalcJS->>IndexHTML: Redirect to login
    else Token Available
        CalcJS->>APIGateway: POST /calculate with Bearer token
        
        alt HTTP 401
            APIGateway->>CalcJS: Unauthorized
            CalcJS->>AuthJS: Clear session
            AuthJS->>IndexHTML: Redirect to login
        else HTTP 200
            APIGateway->>Cognito: Validate token
            Cognito->>APIGateway: Token valid
            APIGateway->>CalcJS: Return calculation
            CalcJS->>AppHTML: Display result
        else Other Error
            APIGateway->>CalcJS: Error response
            CalcJS->>AppHTML: Display error message
        end
    end
    
    %% Sign Out
    Client->>AppHTML: Click Sign Out
    AppHTML->>AuthJS: signOut()
    AuthJS->>Cognito: Logout request
    Cognito->>IndexHTML: Return to index.html
