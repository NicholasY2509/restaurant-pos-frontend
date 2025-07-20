# Logging System Documentation

This document explains how to use the logging system in the Restaurant POS application.

## Overview

The application includes a comprehensive logging system that helps with debugging, error tracking, and monitoring user actions. The logging system is only active in development mode and provides both console output and a UI-based log viewer.

## Features

- **Multiple Log Levels**: DEBUG, INFO, WARN, ERROR
- **Context Support**: Add additional data to log entries
- **Error Stack Traces**: Automatic error stack trace capture
- **UI Log Viewer**: Visual log viewer with filtering and export
- **Console Output**: Development console logging
- **Error Boundary**: React error boundary integration
- **API Error Logging**: Automatic API error logging

## How to Use

### Basic Logging

```typescript
import { logger } from '../utils/logger';

// Info logging
logger.info('User logged in successfully', { userId: 123, email: 'user@example.com' });

// Debug logging
logger.debug('Processing form data', { formData: { name: 'John', email: 'john@example.com' } });

// Warning logging
logger.warn('API rate limit approaching', new Error('Rate limit warning'));

// Error logging
logger.error('Failed to save data', error, { component: 'UserForm', action: 'save' });
```

### API Error Logging

```typescript
import { logApiError } from '../utils/logger';

try {
  const data = await apiService.getUsers();
} catch (error) {
  logApiError('getUsers', error, { userId: 123 });
}
```

### User Action Logging

```typescript
import { logUserAction } from '../utils/logger';

const handleSave = async () => {
  logUserAction('Save user profile', { userId: 123, changes: { name: 'New Name' } });
  // ... save logic
};
```

## Log Viewer

In development mode, a log viewer button appears in the bottom-right corner of the screen. Click it to:

- View all application logs
- Filter logs by level (ERROR, WARN, INFO, DEBUG)
- Export logs as JSON
- Clear logs
- View error details and context

## Error Boundary

The application includes an error boundary that catches React errors and logs them automatically. If an error occurs, users see a friendly error message with a "Try Again" button.

## Log Levels

### DEBUG
- Use for detailed debugging information
- Only visible in development mode
- Example: Form validation details, API request/response data

### INFO
- Use for general application flow
- Example: User actions, successful operations, application state changes

### WARN
- Use for potentially problematic situations
- Example: API rate limits, deprecated feature usage, performance warnings

### ERROR
- Use for actual errors that need attention
- Example: API failures, authentication errors, unexpected exceptions

## Best Practices

1. **Include Context**: Always include relevant context data with your logs
2. **Use Appropriate Levels**: Choose the right log level for your message
3. **Don't Log Sensitive Data**: Avoid logging passwords, tokens, or personal information
4. **Be Descriptive**: Use clear, descriptive messages
5. **Log User Actions**: Log important user actions for debugging and analytics

## Example Usage in Components

```typescript
import React, { useState, useEffect } from 'react';
import { logger, logUserAction } from '../utils/logger';
import apiService from '../services/api';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        logger.info('Fetching user profile');
        const data = await apiService.getProfile();
        setUser(data);
        logger.info('User profile loaded successfully', { userId: data.id });
      } catch (error) {
        logger.error('Failed to load user profile', error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (formData: any) => {
    try {
      logUserAction('Update user profile', { userId: user.id, changes: formData });
      const updatedUser = await apiService.updateProfile(formData);
      setUser(updatedUser);
      logger.info('User profile updated successfully', { userId: user.id });
    } catch (error) {
      logger.error('Failed to update user profile', error as Error, { userId: user.id });
    }
  };

  // ... rest of component
};
```

## Production Considerations

- Logs are only collected in development mode
- In production, consider integrating with external logging services (Sentry, LogRocket, etc.)
- The log viewer is automatically disabled in production builds
- Console logging is disabled in production

## Troubleshooting

### Logs Not Appearing
- Ensure you're in development mode
- Check that the logger is properly imported
- Verify the log viewer is enabled

### Performance Issues
- Avoid logging large objects in production
- Use appropriate log levels
- Consider rate limiting for high-frequency logs

### Missing Error Details
- Ensure errors are properly caught and passed to logger
- Check that error objects include stack traces
- Verify error boundary is properly configured 