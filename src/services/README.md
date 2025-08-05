# API Service Documentation

## Overview

The API service provides a centralized way to interact with the backend API. It uses endpoint classes to organize different types of API calls and provides proper TypeScript typing.

## Usage

### Authentication

```typescript
// Login
const response = await apiService.auth.login(credentials);

// Register
const response = await apiService.auth.register(userData);

// Get user profile
const profile = await apiService.auth.getProfile();
```

### User Management

```typescript
// Get all users
const users = await apiService.users.getAllUsers();

// Get user by ID
const user = await apiService.users.getUserById(id);

// Create user
const newUser = await apiService.users.createUser(userData);

// Update user
const updatedUser = await apiService.users.updateUserById(id, userData);

// Deactivate user
await apiService.users.deactivateUser(id);

// Get user count
const count = await apiService.users.getUserCount();
```

### Tenant Management

```typescript
// Get current tenant
const tenant = await apiService.tenants.getCurrentTenant();

// Get all tenants
const tenants = await apiService.tenants.getAllTenants();

// Get tenant by ID
const tenant = await apiService.tenants.getTenant(id);

// Update tenant
const updatedTenant = await apiService.tenants.updateTenant(id, data);

// Delete tenant
await apiService.tenants.deleteTenant(id);
```

## Error Handling

The API service includes automatic error handling:

- **401 Unauthorized**: Automatically clears auth tokens and user data
- **Network errors**: Logged with detailed information
- **Response logging**: All successful requests are logged

## Interceptors

The service includes request and response interceptors:

- **Request interceptor**: Automatically adds Authorization header with JWT token
- **Response interceptor**: Handles authentication errors and logging

## Example Usage

```typescript
import { apiService } from '../services/api';

// Login example
try {
  const response = await apiService.auth.login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  // Handle successful login
  localStorage.setItem('authToken', response.access_token);
  localStorage.setItem('user', JSON.stringify(response.user));
} catch (error) {
  // Handle login error
  console.error('Login failed:', error);
}

// Get user profile example
try {
  const profile = await apiService.auth.getProfile();
  console.log('User profile:', profile);
} catch (error) {
  console.error('Failed to get profile:', error);
}
``` 