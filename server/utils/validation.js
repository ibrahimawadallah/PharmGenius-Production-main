/**
 * Data validation utilities for PharmGenius
 * Provides validation functions for API inputs and data integrity
 */

import logger from './logger.js';

/**
 * Validates environment variables on startup
 */
export function validateEnvironment() {
  const errors = [];
  const warnings = [];
  
  // Check required environment variables
  if (!process.env.NODE_ENV) {
    warnings.push('NODE_ENV not set, defaulting to development');
  }
  
  if (!process.env.PORT) {
    warnings.push('PORT not set, defaulting to 3001');
  }
  
  // Check MongoDB connection (optional)
  if (!process.env.MONGODB_URI) {
    warnings.push('MONGODB_URI not provided, running in local file mode');
  }
  
  // Check JWT secret (optional for basic functionality)
  if (!process.env.JWT_SECRET) {
    warnings.push('JWT_SECRET not provided, authentication features disabled');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates search query parameters
 */
export function validateSearchQuery(query) {
  const errors = [];
  
  if (!query) {
    errors.push('Query parameter is required');
  } else if (typeof query !== 'string') {
    errors.push('Query must be a string');
  } else if (query.trim().length < 2) {
    errors.push('Query must be at least 2 characters long');
  } else if (query.length > 100) {
    errors.push('Query must be less than 100 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates drug data structure
 */
export function validateDrugData(drug) {
  const errors = [];
  const requiredFields = ['Package Name', 'Generic Name'];
  
  if (!drug || typeof drug !== 'object') {
    errors.push('Drug data must be an object');
    return { isValid: false, errors };
  }
  
  requiredFields.forEach(field => {
    if (!drug[field] || typeof drug[field] !== 'string' || drug[field].trim() === '') {
      errors.push(`Missing or invalid ${field}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates ICD-10 code format
 */
export function validateICD10Code(code) {
  const errors = [];
  
  if (!code) {
    errors.push('ICD-10 code is required');
  } else if (typeof code !== 'string') {
    errors.push('ICD-10 code must be a string');
  } else {
    // Basic ICD-10 format validation (simplified)
    const icd10Pattern = /^[A-Z]\d{2}(\.\d{1,3})?$/;
    if (!icd10Pattern.test(code.toUpperCase())) {
      errors.push('Invalid ICD-10 code format');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates pagination parameters
 */
export function validatePagination(page, limit) {
  const errors = [];
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  
  if (parsedPage < 1) {
    errors.push('Page must be greater than 0');
  }
  
  if (parsedLimit < 1 || parsedLimit > 100) {
    errors.push('Limit must be between 1 and 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    page: parsedPage,
    limit: parsedLimit
  };
}

/**
 * Validates CSV data structure
 */
export function validateCSVData(data, requiredColumns = []) {
  const errors = [];
  
  if (!Array.isArray(data)) {
    errors.push('CSV data must be an array');
    return { isValid: false, errors };
  }
  
  if (data.length === 0) {
    errors.push('CSV data is empty');
    return { isValid: false, errors };
  }
  
  // Check if first row has required columns
  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') {
    errors.push('Invalid CSV data structure');
    return { isValid: false, errors };
  }
  
  const availableColumns = Object.keys(firstRow);
  const missingColumns = requiredColumns.filter(col => !availableColumns.includes(col));
  
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    rowCount: data.length,
    columns: availableColumns
  };
}

/**
 * Validates JSON data structure
 */
export function validateJSONData(data, requiredProperties = []) {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Data must be a valid object');
    return { isValid: false, errors };
  }
  
  requiredProperties.forEach(prop => {
    if (!(prop in data)) {
      errors.push(`Missing required property: ${prop}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitizes user input to prevent injection attacks
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .substring(0, 1000); // Limit length
}

/**
 * Validates API response before sending
 */
export function validateAPIResponse(data) {
  try {
    JSON.stringify(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    logger.error('Invalid API response data', error);
    return { 
      isValid: false, 
      errors: ['Response data is not serializable'] 
    };
  }
}

export default {
  validateSearchQuery,
  validateDrugData,
  validateICD10Code,
  validatePagination,
  validateEnvironment,
  validateCSVData,
  validateJSONData,
  sanitizeInput,
  validateAPIResponse
};