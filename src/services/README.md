# API Service Structure

This document explains the new modular API service structure that separates endpoints by feature/domain.

## Overview

The API service has been refactored to use a modular approach where each domain (auth, users, tenants, menu) has its own endpoint class. This provides better organization, maintainability, and type safety.

## Structure

```
src/services/
├── api.ts                 # Main API service with interceptors
├── endpoints/
│   ├── index.ts          # Exports all endpoint classes
│   ├── auth.ts           # Authentication endpoints
│   ├── tenants.ts        # Tenant management endpoints
│   ├── users.ts          # User management endpoints
│   └── menu.ts           # Menu management endpoints
└── README.md             # This documentation
```

## Usage

### Basic Usage (Backward Compatible)

The main `apiService` still provides all the old methods for backward compatibility:

```typescript
import apiService from '../services/api';

// Old way (still works)
const users = await apiService.getAllUsers();
const tenant = await apiService.getCurrentTenant();
await apiService.login(credentials);
```

### New Modular Usage

You can now use the modular approach for better organization:

```typescript
import apiService from '../services/api';

// Auth endpoints
const profile = await apiService.auth.getProfile();
await apiService.auth.login(credentials);
await apiService.auth.register(userData);

// Tenant endpoints
const tenant = await apiService.tenants.getCurrentTenant();
await apiService.tenants.updateTenant(id, data);

// User endpoints
const users = await apiService.users.getAllUsers();
await apiService.users.deleteUser(id);

// Menu endpoints (new)
const menuItems = await apiService.menu.getAllMenuItems();
await apiService.menu.createMenuItem(newItem);
```

## Adding New Endpoint Groups

### 1. Create a new endpoint file

Create `src/services/endpoints/orders.ts`:

```typescript
import { AxiosInstance } from 'axios';

interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export class OrderEndpoints {
  constructor(private api: AxiosInstance) {}

  async getAllOrders(): Promise<Order[]> {
    const response = await this.api.get<Order[]>('/orders');
    return response.data;
  }

  async createOrder(data: any): Promise<Order> {
    const response = await this.api.post<Order>('/orders', data);
    return response.data;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const response = await this.api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  }
}
```

### 2. Export from index.ts

Add to `src/services/endpoints/index.ts`:

```typescript
export { OrderEndpoints } from './orders';
```

### 3. Add to main API service

Update `src/services/api.ts`:

```typescript
import { OrderEndpoints } from './endpoints';

class ApiService {
  public orders: OrderEndpoints;

  constructor() {
    // ... existing code ...
    this.orders = new OrderEndpoints(this.api);
  }
}
```

## Benefits

### 1. Better Organization
- Each domain has its own file
- Easy to find specific endpoints
- Clear separation of concerns

### 2. Type Safety
- Each endpoint class can have its own types
- Better IntelliSense support
- Compile-time error checking

### 3. Maintainability
- Easy to add new endpoints
- Easy to modify existing endpoints
- No conflicts between different domains

### 4. Scalability
- Can easily add new endpoint groups
- Each team can work on different endpoint files
- Easy to test individual endpoint groups

## Best Practices

### 1. Naming Conventions
- Use plural nouns for endpoint groups: `users`, `tenants`, `orders`
- Use descriptive method names: `getAllUsers`, `updateTenant`, `createOrder`
- Follow REST conventions: GET, POST, PATCH, DELETE

### 2. Type Definitions
- Define interfaces in the endpoint file or import from types
- Use descriptive interface names
- Include all necessary fields

### 3. Error Handling
- Let the main API service handle global errors
- Endpoint classes focus on data transformation
- Use consistent error patterns

### 4. Documentation
- Add JSDoc comments for complex methods
- Document expected request/response formats
- Include usage examples

## Migration Guide

### From Old Structure
If you're using the old structure, you can gradually migrate:

```typescript
// Old way
const users = await apiService.getAllUsers();

// New way
const users = await apiService.users.getAllUsers();
```

### Gradual Migration
1. Start using new structure for new features
2. Gradually migrate existing code
3. Old methods remain available for backward compatibility
4. Remove old methods when no longer needed

## Examples

### Authentication
```typescript
// Login
const response = await apiService.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Get profile
const profile = await apiService.auth.getProfile();
```

### User Management
```typescript
// Get all users
const users = await apiService.users.getAllUsers();

// Update user
const updatedUser = await apiService.users.updateUser(1, {
  firstName: 'John',
  lastName: 'Doe'
});

// Delete user
await apiService.users.deleteUser(1);
```

### Tenant Management
```typescript
// Get current tenant
const tenant = await apiService.tenants.getCurrentTenant();

// Update tenant
const updatedTenant = await apiService.tenants.updateTenant(1, {
  name: 'New Restaurant Name'
});
```

### Menu Management
```typescript
// Get all menu items
const menuItems = await apiService.menu.getAllMenuItems();

// Create new menu item
const newItem = await apiService.menu.createMenuItem({
  name: 'Margherita Pizza',
  description: 'Classic tomato and mozzarella',
  price: 12.99,
  category: 'Pizza'
});

// Toggle availability
await apiService.menu.toggleMenuItemAvailability(1);
``` 