# Cognito Managed Login User Interaction Flows

## 1. New User First-Time Login Flow

```mermaid
sequenceDiagram
    participant Admin
    participant User
    participant Email
    participant CognitoUI
    participant Cognito

    Admin->>Cognito: Create new user
    Cognito->>Email: Send temporary password
    User->>Email: Open email & get temp password
    User->>CognitoUI: Navigate to login page
    User->>CognitoUI: Enter email & temp password
    CognitoUI->>Cognito: Validate credentials
    Cognito->>CognitoUI: Force password change
    User->>CognitoUI: Enter new password (must meet requirements)
    CognitoUI->>Cognito: Update password
    Note over Cognito: Validate password requirements
    Cognito->>CognitoUI: Password accepted
    CognitoUI->>User: Redirect to app
```

Security Considerations:
- Temporary password expires after 24 hours
- New password must meet complexity requirements
- Email link security
- Secure password transmission

## 2. Normal User Login Flow

```mermaid
sequenceDiagram
    participant User
    participant CognitoUI
    participant Cognito
    participant App

    User->>App: Click Login
    App->>CognitoUI: Redirect with PKCE
    User->>CognitoUI: Enter username & password
    CognitoUI->>Cognito: Validate credentials
    Cognito->>CognitoUI: Authentication successful
    CognitoUI->>App: Return with auth code
    App->>User: Show authenticated content
```

Security Considerations:
- PKCE protection
- Rate limiting
- Secure session handling
- Token management

## 3. Invalid Credentials Flow

```mermaid
sequenceDiagram
    participant User
    participant CognitoUI
    participant Cognito

    User->>CognitoUI: Enter incorrect credentials
    CognitoUI->>Cognito: Validate credentials
    Cognito->>CognitoUI: Authentication failed
    CognitoUI->>User: Show error message
    Note over Cognito: Track failed attempts
    Note over CognitoUI: No specific error details
```

Security Considerations:
- Generic error messages
- Account lockout after X attempts
- Brute force protection
- No username enumeration

## 4. Password Reset Flow

```mermaid
sequenceDiagram
    participant User
    participant CognitoUI
    participant Cognito
    participant Email

    User->>CognitoUI: Click "Forgot Password"
    User->>CognitoUI: Enter email
    CognitoUI->>Cognito: Request password reset
    Cognito->>Email: Send reset code
    User->>Email: Get reset code
    User->>CognitoUI: Enter code & new password
    CognitoUI->>Cognito: Verify code & update password
    Cognito->>CognitoUI: Password updated
    CognitoUI->>User: Show success message
```

Security Considerations:
- Reset code expiration
- Rate limiting reset requests
- Secure email delivery
- Password requirements enforcement

## Security Best Practices

### Password Requirements
- Minimum length: 8 characters
- Must contain:
  * Uppercase letters
  * Lowercase letters
  * Numbers
  * Special characters
- Cannot be same as previous X passwords

### Account Protection
1. Failed Login Attempts:
   - Temporary lockout after X failures
   - Increasing lockout duration
   - Admin notification of lockouts

2. Password Reset Security:
   - Limited-time reset codes
   - Single-use codes
   - Rate limiting of reset requests
   - Secure email delivery

3. Session Management:
   - Secure token handling
   - Session timeouts
   - Concurrent session handling
   - Device tracking

## Error Messages

### Best Practices
- Generic error messages
- No username enumeration
- No password requirement hints
- Clear user guidance

### Example Messages:
```
Login Error:
"The username or password is incorrect"
(Not: "This username doesn't exist")

Password Requirements:
"Your password doesn't meet the requirements"
(Not: "Your password needs a number")

Account Lockout:
"Please try again later or contact support"
(Not: "Account locked for 30 minutes")
```

## User Experience Considerations

### Accessibility
- Clear error messages
- Keyboard navigation
- Screen reader support
- High contrast options

### Mobile Support
- Responsive design
- Touch-friendly inputs
- Clear input fields
- Mobile-optimized layouts

## Testing Checklist

### Functional Testing
- [ ] New user flow
- [ ] Normal login
- [ ] Password reset
- [ ] Invalid credentials
- [ ] Account lockout

### Security Testing
- [ ] Password requirements
- [ ] Rate limiting
- [ ] Session handling
- [ ] Token management
- [ ] Error messages

### Integration Testing
- [ ] Email delivery
- [ ] App redirects
- [ ] Token handling
- [ ] Error handling
