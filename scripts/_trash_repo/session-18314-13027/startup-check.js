#!/usr/bin/env node

/**
 * Startup validation script for PharmGenius
 * Validates environment, dependencies, and data files before starting the server
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateEnvironment, validateCSVData, validateJSONData } from './utils/validation.js';
import logger from './utils/logger.js';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StartupValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checks = [];
  }

  addError(message) {
    this.errors.push(message);
    logger.error(`Startup Error: ${message}`);
  }

  addWarning(message) {
    this.warnings.push(message);
    logger.warn(`Startup Warning: ${message}`);
  }

  addCheck(name, status, details = '') {
    this.checks.push({ name, status, details });
    const statusIcon = status === 'pass' ? '✓' : status === 'warn' ? '⚠' : '✗';
    console.log(`${statusIcon} ${name}${details ? ': ' + details : ''}`);
  }

  async validateEnvironment() {
    console.log('\n🔍 Validating Environment...');
    
    const envValidation = validateEnvironment();
    
    if (envValidation.isValid) {
      this.addCheck('Environment Variables', 'pass');
    } else {
      envValidation.errors.forEach(error => this.addError(error));
      this.addCheck('Environment Variables', 'fail', envValidation.errors.join(', '));
    }

    envValidation.warnings.forEach(warning => {
      this.addWarning(warning);
      this.addCheck('Optional Environment', 'warn', warning);
    });

    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      this.addCheck('Node.js Version', 'pass', nodeVersion);
    } else {
      this.addError(`Node.js version ${nodeVersion} is not supported. Requires >= 18.0.0`);
      this.addCheck('Node.js Version', 'fail', nodeVersion);
    }
  }

  async validateDataFiles() {
    console.log('\n📁 Validating Data Files...');
    
    const dataFiles = [
      {
        name: 'UAE Drug List (data/csv)',
        path: path.join('..', 'data', 'csv', 'UAE drug list.csv'),
        type: 'csv',
        required: true,
        requiredColumns: ['Package Name', 'Generic Name']
      },
      {
        name: 'Daman Formulary (data/json)',
        path: path.join('..', 'data', 'json', 'daman-formulary.json'),
        type: 'json',
        required: true,
        requiredProperties: ['medications']
      },
      {
        name: 'ICD-10 Data (data/json)',
        path: path.join('..', 'data', 'json', 'icd10-data.json'),
        type: 'json',
        required: true,
        requiredProperties: []
      }
    ];

    for (const file of dataFiles) {
      const filePath = path.join(__dirname, file.path);
      
      try {
        if (!fs.existsSync(filePath)) {
          if (file.required) {
            this.addError(`Required data file missing: ${file.path}`);
            this.addCheck(file.name, 'fail', 'File not found');
          } else {
            this.addWarning(`Optional data file missing: ${file.path}`);
            this.addCheck(file.name, 'warn', 'File not found');
          }
          continue;
        }

        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        
        if (stats.size === 0) {
          this.addError(`Data file is empty: ${file.path}`);
          this.addCheck(file.name, 'fail', 'Empty file');
          continue;
        }

        // Validate file content based on type
        if (file.type === 'csv') {
          await this.validateCSVFile(filePath, file);
        } else if (file.type === 'json') {
          await this.validateJSONFile(filePath, file);
        }

        this.addCheck(file.name, 'pass', `${sizeKB}KB`);
        
      } catch (error) {
        this.addError(`Error validating ${file.path}: ${error.message}`);
        this.addCheck(file.name, 'fail', error.message);
      }
    }
  }

  async validateCSVFile(filePath, fileConfig) {
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
            return;
          }

          const validation = validateCSVData(results.data, fileConfig.requiredColumns || []);
          
          if (!validation.isValid) {
            reject(new Error(validation.errors.join(', ')));
            return;
          }

          resolve(validation);
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  }

  async validateJSONFile(filePath, fileConfig) {
    const jsonContent = fs.readFileSync(filePath, 'utf8');
    
    try {
      const data = JSON.parse(jsonContent);
      const validation = validateJSONData(data, fileConfig.requiredProperties || []);
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      return validation;
    } catch (error) {
      throw new Error(`JSON validation failed: ${error.message}`);
    }
  }

  async validateDependencies() {
    console.log('\n📦 Validating Dependencies...');
    
    try {
      const packageJsonPath = path.join(__dirname, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check if node_modules exists
      const nodeModulesPath = path.join(__dirname, 'node_modules');
      if (!fs.existsSync(nodeModulesPath)) {
        this.addError('node_modules directory not found. Run: npm install');
        this.addCheck('Dependencies Installed', 'fail', 'node_modules missing');
        return;
      }

      // Check critical dependencies
      const criticalDeps = ['express', '@azure/cosmos', 'papaparse', 'cors'];
      let missingDeps = 0;
      
      for (const dep of criticalDeps) {
        const depPath = path.join(nodeModulesPath, dep);
        if (!fs.existsSync(depPath)) {
          this.addError(`Critical dependency missing: ${dep}`);
          missingDeps++;
        }
      }

      if (missingDeps === 0) {
        this.addCheck('Critical Dependencies', 'pass', `${criticalDeps.length} dependencies found`);
      } else {
        this.addCheck('Critical Dependencies', 'fail', `${missingDeps} missing`);
      }

      this.addCheck('Package Configuration', 'pass', `v${packageJson.version}`);
      
    } catch (error) {
      this.addError(`Dependency validation failed: ${error.message}`);
      this.addCheck('Dependencies', 'fail', error.message);
    }
  }

  async validateBuildArtifacts() {
    console.log('\n🏗️ Validating Build Artifacts...');
    
    const distPath = path.join(__dirname, 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    if (!fs.existsSync(distPath)) {
      this.addWarning('Build directory (dist) not found. Run: npm run build');
      this.addCheck('Frontend Build', 'warn', 'dist/ missing');
      return;
    }

    if (!fs.existsSync(indexPath)) {
      this.addWarning('index.html not found in dist. Run: npm run build');
      this.addCheck('Frontend Build', 'warn', 'index.html missing');
      return;
    }

    const stats = fs.statSync(indexPath);
    this.addCheck('Frontend Build', 'pass', `Built ${stats.mtime.toLocaleDateString()}`);
  }

  async validatePorts() {
    console.log('\n🌐 Validating Port Configuration...');
    
    const port = process.env.PORT || 3001;
    
    // Basic port validation
    if (isNaN(port) || port < 1 || port > 65535) {
      this.addError(`Invalid port number: ${port}`);
      this.addCheck('Port Configuration', 'fail', `Invalid: ${port}`);
      return;
    }

    this.addCheck('Port Configuration', 'pass', `Port ${port}`);
  }

  async runAllValidations() {
    console.log('🚀 PharmGenius Startup Validation\n');
    console.log('='.repeat(50));
    
    await this.validateEnvironment();
    await this.validateDependencies();
    await this.validateDataFiles();
    await this.validateBuildArtifacts();
    await this.validatePorts();
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Validation Summary:');
    console.log(`✓ Passed: ${this.checks.filter(c => c.status === 'pass').length}`);
    console.log(`⚠ Warnings: ${this.warnings.length}`);
    console.log(`✗ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Critical Issues Found:');
      this.errors.forEach(error => console.log(`  • ${error}`));
      console.log('\n🛠️ Please fix these issues before starting the server.');
      process.exit(1);
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    console.log('\n✅ Startup validation completed successfully!');
    console.log('🎉 Ready to start PharmGenius server.');
    
    return {
      success: true,
      errors: this.errors,
      warnings: this.warnings,
      checks: this.checks
    };
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new StartupValidator();
  validator.runAllValidations().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

export default StartupValidator;