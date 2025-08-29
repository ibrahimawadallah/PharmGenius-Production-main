/**
 * Enhanced logging utility for PharmGenius
 * Provides structured logging with different levels and environments
 */

class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    
    this.currentLevel = this.levels[process.env.LOG_LEVEL] || this.levels.info;
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    };

    if (this.isProduction) {
      return JSON.stringify(logEntry);
    } else {
      // Pretty format for development
      const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta, null, 2)}` : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
    }
  }

  log(level, message, meta = {}) {
    if (this.levels[level] <= this.currentLevel) {
      const formattedMessage = this.formatMessage(level, message, meta);
      
      if (level === 'error') {
        console.error(formattedMessage);
      } else if (level === 'warn') {
        console.warn(formattedMessage);
      } else {
        console.log(formattedMessage);
      }
    }
  }

  error(message, error = null) {
    const meta = {};
    if (error) {
      meta.error = {
        message: error.message,
        stack: error.stack,
        name: error.name
      };
    }
    this.log('error', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  // Health check logging
  health(component, status, details = {}) {
    this.info(`Health Check: ${component}`, {
      component,
      status,
      ...details
    });
  }

  // API request logging
  request(method, path, query = {}, body = {}) {
    if (!this.isProduction) {
      this.debug(`API Request: ${method} ${path}`, {
        method,
        path,
        query,
        body: Object.keys(body).length > 0 ? body : undefined
      });
    }
  }

  // Performance logging
  performance(operation, duration, meta = {}) {
    this.info(`Performance: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      ...meta
    });
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;