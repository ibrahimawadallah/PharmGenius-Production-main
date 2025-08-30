/**
 * Health monitoring system for PharmGenius
 * Provides comprehensive health checks and monitoring capabilities
 */

import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HealthMonitor {
  constructor() {
    this.checks = new Map();
    this.lastCheckResults = new Map();
    this.startTime = Date.now();
  }

  /**
   * Register a health check
   */
  registerCheck(name, checkFunction, options = {}) {
    this.checks.set(name, {
      fn: checkFunction,
      timeout: options.timeout || 5000,
      critical: options.critical || false,
      interval: options.interval || 30000
    });
  }

  /**
   * Run a single health check
   */
  async runCheck(name) {
    const check = this.checks.get(name);
    if (!check) {
      throw new Error(`Health check '${name}' not found`);
    }

    const startTime = Date.now();
    try {
      const result = await Promise.race([
        check.fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), check.timeout)
        )
      ]);

      const duration = Date.now() - startTime;
      const checkResult = {
        name,
        status: 'healthy',
        duration,
        timestamp: new Date().toISOString(),
        details: result || {},
        critical: check.critical
      };

      this.lastCheckResults.set(name, checkResult);
      return checkResult;
    } catch (error) {
      const duration = Date.now() - startTime;
      const checkResult = {
        name,
        status: 'unhealthy',
        duration,
        timestamp: new Date().toISOString(),
        error: error.message,
        critical: check.critical
      };

      this.lastCheckResults.set(name, checkResult);
      logger.error(`Health check failed: ${name}`, error);
      return checkResult;
    }
  }

  /**
   * Run all health checks
   */
  async runAllChecks() {
    const results = [];
    const promises = Array.from(this.checks.keys()).map(name => this.runCheck(name));
    
    const checkResults = await Promise.allSettled(promises);
    
    checkResults.forEach((result, index) => {
      const checkName = Array.from(this.checks.keys())[index];
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          name: checkName,
          status: 'error',
          error: result.reason.message,
          timestamp: new Date().toISOString(),
          critical: this.checks.get(checkName).critical
        });
      }
    });

    return results;
  }

  /**
   * Get overall health status
   */
  async getHealthStatus() {
    const checks = await this.runAllChecks();
    const uptime = Date.now() - this.startTime;
    
    const healthyChecks = checks.filter(c => c.status === 'healthy').length;
    const unhealthyChecks = checks.filter(c => c.status === 'unhealthy').length;
    const criticalFailures = checks.filter(c => c.critical && c.status !== 'healthy').length;
    
    let overallStatus = 'healthy';
    if (criticalFailures > 0) {
      overallStatus = 'critical';
    } else if (unhealthyChecks > 0) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptime / 1000),
        human: this.formatUptime(uptime)
      },
      checks: {
        total: checks.length,
        healthy: healthyChecks,
        unhealthy: unhealthyChecks,
        critical_failures: criticalFailures
      },
      details: checks
    };
  }

  /**
   * Format uptime in human readable format
   */
  formatUptime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Initialize default health checks
   */
  initializeDefaultChecks() {
    // File system check
    this.registerCheck('filesystem', async () => {
      const testFile = path.join(__dirname, '../.health-check');
      try {
        await fs.promises.writeFile(testFile, 'test');
        await fs.promises.unlink(testFile);
        return { writable: true };
      } catch (error) {
        throw new Error(`Filesystem not writable: ${error.message}`);
      }
    }, { critical: true });

    // Memory usage check
    this.registerCheck('memory', async () => {
      const usage = process.memoryUsage();
      const totalMB = Math.round(usage.rss / 1024 / 1024);
      const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
      
      // Alert if memory usage is too high (>500MB)
      if (totalMB > 500) {
        throw new Error(`High memory usage: ${totalMB}MB`);
      }
      
      return {
        rss: `${totalMB}MB`,
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
        external: `${Math.round(usage.external / 1024 / 1024)}MB`
      };
    });

    // Data files check
    this.registerCheck('data_files', async () => {
      const requiredFiles = [
        {
          label: 'data/csv/UAE drug list.csv',
          filePath: path.join(__dirname, '..', '..', 'data', 'csv', 'UAE drug list.csv')
        },
        {
          label: 'data/json/daman-formulary.json',
          filePath: path.join(__dirname, '..', '..', 'data', 'json', 'daman-formulary.json')
        }
      ];
      
      const fileStatus = {};
      let missingFiles = 0;
      
      for (const f of requiredFiles) {
        try {
          const stats = await fs.promises.stat(f.filePath);
          fileStatus[f.label] = {
            exists: true,
            size: `${Math.round(stats.size / 1024)}KB`,
            modified: stats.mtime.toISOString(),
            path: f.filePath
          };
        } catch (error) {
          fileStatus[f.label] = { exists: false, path: f.filePath };
          missingFiles++;
        }
      }
      
      if (missingFiles > 0) {
        throw new Error(`Missing ${missingFiles} required data files`);
      }
      
      return { files: fileStatus };
    }, { critical: process.env.DATA_FILES_CRITICAL === 'true' });

    // Environment check
    this.registerCheck('environment', async () => {
      const requiredEnvVars = ['NODE_ENV'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
      }
      
      return {
        nodeEnv: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      };
    }, { critical: true });

    // Database connection check
    this.registerCheck('database', async () => {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('MONGODB_URI is not configured in .env file.');
      }

      let client;
      try {
        client = new MongoClient(mongoUri, {
          serverSelectionTimeoutMS: 3000 // Fail fast if DB is not available
        });
        await client.connect();
        const adminDb = client.db().admin();
        const pingResult = await adminDb.ping();
        const serverStatus = await adminDb.serverStatus();

        if (pingResult.ok !== 1) {
          throw new Error('Database ping was not successful.');
        }

        return {
          message: 'Successfully connected and pinged database.',
          version: serverStatus.version,
          connections: serverStatus.connections.current,
          uptimeSeconds: serverStatus.uptime,
        };
      } catch (error) {
        throw new Error(`Database connection failed: ${error.message}`);
      } finally {
        if (client) {
          await client.close();
        }
      }
    }, { critical: true, timeout: 5000 });
  }
}

// Create singleton instance
const healthMonitor = new HealthMonitor();

export default healthMonitor;