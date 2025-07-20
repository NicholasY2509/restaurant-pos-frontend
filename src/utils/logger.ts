// Logger utility for consistent error logging and display

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: Error;
  context?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs

  private addLog(level: LogLevel, message: string, error?: Error, context?: Record<string, any>) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      context
    };

    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      const logMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[logMethod](`[${level.toUpperCase()}] ${message}`, error || '', context || '');
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.addLog(LogLevel.DEBUG, message, undefined, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.addLog(LogLevel.INFO, message, undefined, context);
  }

  warn(message: string, error?: Error, context?: Record<string, any>) {
    this.addLog(LogLevel.WARN, message, error, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.addLog(LogLevel.ERROR, message, error, context);
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Get error logs only
  getErrorLogs(): LogEntry[] {
    return this.getLogsByLevel(LogLevel.ERROR);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Test function to demonstrate logging
  testLogging() {
    this.info('Application started successfully');
    this.debug('Debug information', { version: '1.0.0', environment: 'development' });
    this.warn('This is a warning message', new Error('Test warning'));
    this.error('This is an error message', new Error('Test error'), { 
      component: 'TestComponent',
      action: 'testAction'
    });
  }
}

export const logger = new Logger();

// Helper function to log API errors
export const logApiError = (operation: string, error: any, context?: Record<string, any>) => {
  const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
  const statusCode = error?.response?.status;
  
  logger.error(`API Error in ${operation}: ${errorMessage}`, error, {
    operation,
    statusCode,
    url: error?.config?.url,
    method: error?.config?.method,
    ...context
  });
};

// Helper function to log user actions
export const logUserAction = (action: string, context?: Record<string, any>) => {
  logger.info(`User Action: ${action}`, context);
};

// Initialize with some test logs in development
if (process.env.NODE_ENV === 'development') {
  // Add a small delay to ensure the logger is initialized
  setTimeout(() => {
    logger.testLogging();
  }, 1000);
} 