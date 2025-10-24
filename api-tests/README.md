# API Tests

This folder contains REST Client files for testing the Widget-as-a-Service API endpoints.

## Prerequisites

1. Install the **REST Client** extension in VSCode (`humao.rest-client`)
2. Make sure your backend server is running on `http://localhost:3000`

## Files

- `auth.http` - Authentication endpoint tests
- `environments.http` - Environment variables and test data
- `README.md` - This documentation

## How to Use

1. Open any `.http` file in VSCode
2. Click "Send Request" above any request block (or use `Ctrl+Alt+R`)
3. View the response in the VSCode panel

## Token Management

The authentication tests automatically capture the `access_token` from successful login responses and store it in a global variable. This token is then used for testing protected endpoints like `/auth/profile`.

**Important**: Run the login tests (Test 1 or Test 2) before testing the profile endpoint to ensure you have a valid token.

## Available Test Users

Based on the current backend configuration:

- **john** / **changeme**
- **maria** / **guess**

## Test Scenarios

The `auth.http` file includes tests for:

### Authentication Tests
- ✅ Valid login credentials (john and maria)
- ❌ Invalid username
- ❌ Invalid password
- ❌ Missing fields
- ❌ Empty request body
- ❌ Malformed JSON

### Protected Endpoint Tests
- ✅ Get user profile with valid token
- ❌ Get user profile without token
- ❌ Get user profile with invalid token
- ❌ Get user profile with malformed authorization header
- ❌ Get user profile with empty authorization header

## Environment Variables

You can modify the `environments.http` file to:
- Change the base URL for different environments
- Add new test users
- Configure different content types

## Adding New Tests

To add new API endpoint tests:

1. Create a new `.http` file (e.g., `users.http`, `widgets.http`)
2. Import variables from `environments.http` if needed
3. Add your test requests following the same format

## Example Request Format

```http
### Test Description
POST {{baseUrl}}/endpoint
Content-Type: {{contentType}}

{
  "field": "value"
}
```
