import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import logger from './utils/logger.js';
import healthMonitor from './utils/healthMonitor.js';
import { validateEnvironment } from './utils/validation.js';

// Import models
import User from './models/User.js';
import Organization from './models/Organization.js';
import Consultation from './models/Consultation.js';
import Course from './models/Course.js';
import Payment from './models/Payment.js';
import Post from './models/Post.js';

// Import routes
import authRouter from './routes/auth.js';
import externalApisRouter from './routes/external-apis.js';
import pregnancyCategoriesHandler from './routes/pregnancy-categories.js';
import drugInteractionsHandler from './routes/drug-interactions.js';
import icd10ExternalHandler from './routes/icd10.js';
import snomedRouter from './routes/snomed.js';
import { icd10EnhancedRouter } from './routes/icd10-enhanced.js';
import nhsRouter from './routes/nhs-integration.js';
import openfdaRouter from './routes/openfda.js';
import rxnormRouter from './routes/rxnorm.js';

// Load environment variables
dotenv.config();

// Validate environment on startup
const envValidation = validateEnvironment();
if (!envValidation.isValid) {
  console.error('Environment validation failed:', envValidation.errors);
  process.exit(1);
}

if (envValidation.warnings.length > 0) {
  console.warn('Environment warnings:', envValidation.warnings);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Use the imported logger
const log = logger;

// Initialize health monitoring
healthMonitor.initializeDefaultChecks();

// Initialize MongoDB connection
let mongoClient, db;
let mongoDbAvailable = false;

async function initializeMongoDB() {
  try {
    if (!process.env.MONGODB_URI) {
      log.warn('MONGODB_URI not provided, running in local file mode.');
      return false;
    }

    mongoClient = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    await mongoClient.connect();
    db = mongoClient.db();

    await db.command({ ping: 1 });
    mongoDbAvailable = true;
    log.info('MongoDB initialized successfully');

    // Initialize all models
    await User.initialize(db);
    await Organization.initialize(db);
    await Consultation.initialize(db);
    await Course.initialize(db);
    await Payment.initialize(db);
    await Post.initialize(db);

    log.info('All models initialized successfully');
    return true;
  } catch (error) {
    log.error('Failed to initialize MongoDB', error);
    mongoDbAvailable = false;
    return false;
  }
}

const mongoInitialized = await initializeMongoDB();
if (!mongoInitialized) {
  log.warn('Running in local file mode. Some features may be limited.');
}

// Security middleware
if (process.env.HELMET_ENABLED !== 'false') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
}

// Rate limiting
if (process.env.RATE_LIMIT_ENABLED !== 'false') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per window
    message: {
      error: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  });
  app.use(limiter);
}

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
if (process.env.LOG_REQUESTS !== 'false') {
  app.use((req, res, next) => {
    log.request(req.method, req.path, req.query, req.body);
    next();
  });
}

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Load UAE drug database with enhanced error handling
const drugDbPath = path.join(__dirname, '..', 'data', 'csv', 'UAE drug list.csv');
log.info('Looking for database at:', drugDbPath);
let uaeDrugs = [];
const uaeDrugsById = new Map(); // For fast O(1) lookups by ID

function loadUAEDrugs() {
  try {
    if (!fs.existsSync(drugDbPath)) {
      log.warn('UAE drug database file not found, using empty dataset');
      return { success: false, count: 0 };
    }

    let csvData = fs.readFileSync(drugDbPath, 'utf8');
    
    // Remove BOM if present
    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.slice(1);
    }

    // Validate CSV data
    if (!csvData.trim()) {
      log.error('UAE drug database file is empty');
      return { success: false, count: 0 };
    }

    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // Clean headers
    });

    if (parsed.errors.length > 0) {
      log.error('CSV parsing errors detected', parsed.errors);
      // Continue with partial data if errors are not critical
      if (parsed.errors.some(err => err.type === 'Delimiter')) {
        log.error('Critical CSV parsing error - delimiter issues');
        return { success: false, count: 0 };
      }
    }

    // Validate and process data
    const validDrugs = parsed.data.filter(drug => {
      return drug && drug['Package Name'] && drug['Package Name'].trim();
    });

    if (validDrugs.length === 0) {
      log.error('No valid drugs found in CSV file');
      return { success: false, count: 0 };
    }

    let idCounter = 1;
    uaeDrugs = validDrugs.map(drug => {
      const drugWithId = { ...drug, id: idCounter++ };
      uaeDrugsById.set(drugWithId.id.toString(), drugWithId);
      return drugWithId;
    });

    log.info(`Successfully loaded ${uaeDrugs.length} drugs from UAE database`);
    return { success: true, count: uaeDrugs.length };
    
  } catch (error) {
    log.error('Error loading UAE drug database', error);
    return { success: false, count: 0 };
  }
}

const uaeLoadResult = loadUAEDrugs();

// Load Daman formulary data with enhanced error handling
const formularyPath = path.join(__dirname, '..', 'data', 'json', 'daman-formulary.json');
let damanFormulary = { medications: [] };

function loadDamanFormulary() {
  try {
    if (!fs.existsSync(formularyPath)) {
      log.warn('Daman formulary file not found, using empty dataset');
      return { success: false, count: 0 };
    }

    const formularyData = fs.readFileSync(formularyPath, 'utf8');
    
    if (!formularyData.trim()) {
      log.error('Daman formulary file is empty');
      return { success: false, count: 0 };
    }

    const parsedData = JSON.parse(formularyData);
    
    // Validate structure
    if (!parsedData || typeof parsedData !== 'object') {
      log.error('Invalid Daman formulary data structure');
      return { success: false, count: 0 };
    }

    // Handle different possible structures
    if (Array.isArray(parsedData)) {
      damanFormulary = { medications: parsedData };
    } else if (parsedData.medications && Array.isArray(parsedData.medications)) {
      damanFormulary = parsedData;
    } else if (parsedData.data && Array.isArray(parsedData.data)) {
      damanFormulary = { medications: parsedData.data };
    } else {
      // Assume it's an object with medication data
      damanFormulary = { medications: Object.values(parsedData) };
    }

    const count = damanFormulary.medications.length;
    log.info(`Successfully loaded ${count} medications from Daman formulary`);
    return { success: true, count };
    
  } catch (error) {
    log.error('Error loading Daman formulary data', error);
    damanFormulary = { medications: [] };
    return { success: false, count: 0 };
  }
}

const formularyLoadResult = loadDamanFormulary();

// Load ICD-10 codes with better error handling
const icd10Path = path.join(__dirname, '..', 'data', 'json', 'icd10-data.json');
let icd10Codes = [];

try {
  if (fs.existsSync(icd10Path)) {
    const icd10Data = fs.readFileSync(icd10Path, 'utf8');
    const icd10DataObj = JSON.parse(icd10Data);
    // Convert the object structure to an array of codes
    icd10Codes = Object.values(icd10DataObj).flat();
    console.log(`Loaded ${icd10Codes.length} ICD-10 codes`);
  } else {
    console.warn('ICD-10 data file not found, using empty dataset');
  }
} catch (error) {
  console.error('Error loading ICD-10 codes:', error);
  // Continue with empty dataset
}

// API Routes

// Authentication routes
app.use('/api/auth', authRouter);

// External pharmaceutical APIs
app.use('/api/external', externalApisRouter);

// SNOMED Snowstorm proxy routes
app.use('/api/snomed', snomedRouter);

// NHS API integration routes
app.use('/api/nhs', nhsRouter);

// Free APIs - No key required
app.use('/api/openfda', openfdaRouter);
app.use('/api/rxnorm', rxnormRouter);

// Pregnancy categories API
app.get('/api/pregnancy-categories', pregnancyCategoriesHandler);

// Drug interactions API
app.get('/api/drug-interactions', drugInteractionsHandler);
app.get('/api/icd10/live', icd10ExternalHandler);

// Lightweight local Drug -> ICD-10 mapping
const DRUG_TO_ICD10_LOCAL = {
  metformin: [
    { icd10_code: 'E11.9', indication: 'Type 2 diabetes mellitus without complications' },
    { icd10_code: 'E11.65', indication: 'Type 2 diabetes mellitus with hyperglycemia' }
  ],
  insulin: [
    { icd10_code: 'E10.9', indication: 'Type 1 diabetes mellitus without complications' },
    { icd10_code: 'E11.9', indication: 'Type 2 diabetes mellitus without complications' }
  ],
  amlodipine: [
    { icd10_code: 'I10', indication: 'Essential (primary) hypertension' }
  ],
  atorvastatin: [
    { icd10_code: 'E78.5', indication: 'Hyperlipidemia, unspecified' },
    { icd10_code: 'E78.2', indication: 'Mixed hyperlipidemia' }
  ],
  omeprazole: [
    { icd10_code: 'K21.9', indication: 'Gastro-esophageal reflux disease without esophagitis' }
  ],
  pantoprazole: [
    { icd10_code: 'K21.9', indication: 'Gastro-esophageal reflux disease without esophagitis' }
  ],
  aspirin: [
    { icd10_code: 'I25.10', indication: 'Atherosclerotic heart disease of native coronary artery' }
  ],
  albuterol: [
    { icd10_code: 'J45.909', indication: 'Unspecified asthma, uncomplicated' }
  ],
  levothyroxine: [
    { icd10_code: 'E03.9', indication: 'Hypothyroidism, unspecified' }
  ],
  warfarin: [
    { icd10_code: 'I48.91', indication: 'Unspecified atrial fibrillation' }
  ],
};

// ICD-10 -> Drug (UAE) keyword mapping for basic suggestions
const ICD10_TO_DRUG_KEYWORDS = {
  E11: ['metformin', 'insulin', 'glimepiride', 'gliclazide', 'sitagliptin', 'empagliflozin', 'liraglutide', 'semaglutide', 'dulaglutide'],
  I10: ['amlodipine', 'lisinopril', 'losartan', 'bisoprolol', 'carvedilol'],
  K21: ['omeprazole', 'pantoprazole', 'esomeprazole'],
  J45: ['albuterol', 'salbutamol', 'montelukast', 'fluticasone'],
  E78: ['atorvastatin', 'simvastatin', 'rosuvastatin'],
};

// GET /api/icd10/live/drugs/:drugName/indications
app.get('/api/icd10/live/drugs/:drugName/indications', async (req, res) => {
  const { drugName } = req.params;
  const key = (drugName || '').toLowerCase();
  let collected = [];

  if (DRUG_TO_ICD10_LOCAL[key]) {
    collected = DRUG_TO_ICD10_LOCAL[key];
  } else {
    for (const [k, vals] of Object.entries(DRUG_TO_ICD10_LOCAL)) {
      if (k.includes(key) || key.includes(k)) {
        collected = collected.concat(vals);
      }
    }
  }

  // dedupe by icd10_code
  const uniqueByCode = new Map();
  collected.forEach((m) => {
    if (m.icd10_code && !uniqueByCode.has(m.icd10_code)) {
      uniqueByCode.set(m.icd10_code, m);
    }
  });

  res.json({ icd10_mappings: Array.from(uniqueByCode.values()).slice(0, 8) });
});

// GET /api/icd10/live/icd10/:icd10Code/drugs
app.get('/api/icd10/live/icd10/:icd10Code/drugs', async (req, res) => {
  const { icd10Code } = req.params;
  const code = (icd10Code || '').toUpperCase();
  const prefix = code.slice(0, 3);
  const keywords = ICD10_TO_DRUG_KEYWORDS[prefix] || [];

  if (!Array.isArray(uaeDrugs) || uaeDrugs.length === 0 || keywords.length === 0) {
    return res.json({ drugs: [] });
  }

  const drugs = uaeDrugs.filter(drug => {
    const name = (drug['Package Name'] || '').toLowerCase();
    const generic = (drug['Generic Name'] || '').toLowerCase();
    return keywords.some(k => name.includes(k) || generic.includes(k));
  }).slice(0, 20).map(drug => ({
    id: drug.id,
    name: drug['Package Name'],
    generic: drug['Generic Name'],
    strength: drug['Strength'],
    form: drug['Dosage Form']
  }));

  res.json({ drugs });
});
app.use('/api/icd10-enhanced', icd10EnhancedRouter);

// Enhanced health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Get comprehensive health status
    const healthStatus = await healthMonitor.getHealthStatus();
    
    // Add application-specific data
    healthStatus.application = {
      name: 'PharmGenius',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      dataLoaded: {
        uaeDrugs: {
          count: uaeDrugs.length,
          loaded: uaeLoadResult.success,
          status: uaeLoadResult.success ? 'ok' : 'failed'
        },
        icd10Codes: {
          count: icd10Codes.length,
          status: icd10Codes.length > 0 ? 'ok' : 'empty'
        },
        damanFormulary: {
          count: damanFormulary.medications.length,
          loaded: formularyLoadResult.success,
          status: formularyLoadResult.success ? 'ok' : 'failed'
        },
        mongoDb: {
          available: mongoDbAvailable,
          status: mongoDbAvailable ? 'connected' : 'offline'
        }
      }
    };

    // Determine HTTP status code based on health
    let statusCode = 200;
    if (healthStatus.status === 'critical') {
      statusCode = 503;
    }

    res.status(statusCode).json(healthStatus);
  } catch (error) {
    log.error('Health check endpoint error', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Daman coverage service
app.get('/api/daman-service/coverage', (req, res) => {
  const drugName = req.query.drug;
  
  if (!drugName) {
    return res.status(400).json({ error: 'Drug name is required' });
  }
  
  // Search in UAE database first
  const uaeDrug = uaeDrugs.find(drug => 
    (drug['Package Name'] && drug['Package Name'].toLowerCase().includes(drugName.toLowerCase())) ||
    (drug['Generic Name'] && drug['Generic Name'].toLowerCase().includes(drugName.toLowerCase()))
  );
  
  if (uaeDrug) {
    return res.json({
      name: uaeDrug['Package Name'],
      activeIngredient: uaeDrug['Generic Name'],
      dosageForm: uaeDrug['Dosage Form'],
      strength: uaeDrug['Strength'],
      thiqa: uaeDrug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
      basic: uaeDrug['Included In Basic Drug Formulary'] === 'Yes',
      enhanced: uaeDrug['Included In ABM 1 Drug Formulary'] === 'Yes' || uaeDrug['Included In ABM 7 Drug Formulary'] === 'Yes',
      priorAuthorization: false,
      price_public: uaeDrug['Package Price to Public'],
      manufacturer: uaeDrug['Manufacturer Name']
    });
  }
  
  // Fallback to Daman formulary
  const medication = damanFormulary.medications.find(med => 
    med.name.toLowerCase() === drugName.toLowerCase() || 
    med.activeIngredient.toLowerCase() === drugName.toLowerCase()
  );
  
  if (!medication) {
    return res.status(404).json({ error: 'Medication not found in formulary' });
  }
  
  return res.json(medication);
});

// Drug search API
app.get('/api/drug-service/search', async (req, res) => {
  const query = req.query.query || '';
  const category = req.query.category || '';
  const limit = parseInt(req.query.limit) || 20;
  
  let results = [];

  // Prefer MongoDB, then fallback to CSV
  if (mongoDbAvailable) {
    try {
      const drugsCollection = db.collection('drugs');
      const mongoQuery = { 'Status': 'Active' };
      if (query) {
        mongoQuery.$or = [
          { 'Package Name': { $regex: query, $options: 'i' } },
          { 'Generic Name': { $regex: query, $options: 'i' } }
        ];
      }
      if (category) {
        mongoQuery['Dosage Form'] = { $regex: category, $options: 'i' };
      }
      results = await drugsCollection.find(mongoQuery).limit(limit).toArray();
    } catch (error) {
      log.error('MongoDB search error', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
  } else {
    // Fallback to local file search
    results = uaeDrugs.filter(drug => {
      const matchesQuery = !query || 
        (drug['Package Name'] && drug['Package Name'].toLowerCase().includes(query.toLowerCase())) ||
        (drug['Generic Name'] && drug['Generic Name'].toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || 
        (drug['Dosage Form'] && drug['Dosage Form'].toLowerCase().includes(category.toLowerCase()));
      
      return matchesQuery && matchesCategory && drug['Status'] === 'Active';
    }).slice(0, limit);
  }
  
  const formattedResults = results.map(drug => ({
    id: drug.drugId || drug.id, // Use drugId from mongo or id from local
    drug_name: drug['Package Name'] || 'Unknown',
    generic_name: drug['Generic Name'] || 'Unknown',
    category: drug['Dosage Form'] || 'Medication',
    strength: drug['Strength'] || '',
    dosage_form: drug['Dosage Form'] || '',
    indications: `${drug['Package Name']} is available in the UAE market.`,
    contraindications: 'Please consult healthcare provider for contraindications.',
    side_effects: 'Please consult healthcare provider for side effects.',
    manufacturer: drug['Manufacturer Name'] || '',
    agent: drug['Agent Name'] || '',
    price_public: drug['Package Price to Public'] || '',
    thiqa_coverage: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
    basic_coverage: drug['Included In Basic Drug Formulary'] === 'Yes'
  }));
  
  res.json({
    results: formattedResults,
    total: formattedResults.length,
    query
  });
});

// Individual drug details API
app.get('/api/drug-service/drugs/:id', async (req, res) => {
  const { id } = req.params;
  let drug;

  if (mongoDbAvailable) {
    try {
      const drugsCollection = db.collection('drugs');
      // The mongo migration script creates `drugId` as a string
      drug = await drugsCollection.findOne({ drugId: id });
    } catch (error) {
      log.error('MongoDB findOne error', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
  } else {
    // Fallback to local file lookup
    drug = uaeDrugsById.get(id);
  }

  if (!drug) {
    return res.status(404).json({ error: 'Drug not found' });
  }

  res.json({
    id: drug.drugId || drug.id,
    drug_name: drug['Package Name'] || 'Unknown',
    generic_name: drug['Generic Name'] || 'Unknown',
    category: drug['Dosage Form'] || 'Medication',
    strength: drug['Strength'] || '',
    dosage_form: drug['Dosage Form'] || '',
    indications: `${drug['Package Name']} (${drug['Generic Name']}) is available in the UAE pharmaceutical market. This medication is manufactured by ${drug['Manufacturer Name'] || 'Unknown manufacturer'}.`,
    contraindications: 'Please consult your healthcare provider for specific contraindications and precautions.',
    side_effects: 'Please consult your healthcare provider for potential side effects and adverse reactions.',
    manufacturer: drug['Manufacturer Name'] || '',
    agent: drug['Agent Name'] || '',
    price_public: drug['Package Price to Public'] || '',
    price_pharmacy: drug['Package Price to Pharmacy'] || '',
    unit_price_public: drug['Unit Price to Public'] || '',
    thiqa_coverage: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
    basic_coverage: drug['Included In Basic Drug Formulary'] === 'Yes',
    abm1_coverage: drug['Included In ABM 1 Drug Formulary'] === 'Yes',
    abm7_coverage: drug['Included In ABM 7 Drug Formulary'] === 'Yes',
    status: drug['Status'] || '',
    icd10_codes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
});

// Drug categories API
app.get('/api/drug-service/categories', (req, res) => {
  const categories = [...new Set(uaeDrugs
    .filter(drug => drug['Dosage Form'] && drug['Status'] === 'Active')
    .map(drug => drug['Dosage Form'])
  )].sort();
  
  res.json({
    categories
  });
});

// ICD-10 codes API
app.get('/api/icd10/search', async (req, res) => {
  const query = req.query.q || '';
  const limit = parseInt(req.query.limit) || 20;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  const results = icd10Codes.filter(code => 
    code.code.toLowerCase().includes(query.toLowerCase()) ||
    code.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, limit);
  
  res.json({
    results,
    total: results.length,
    query
  });
});

// UAE drugs API (compatibility with existing API)
app.get('/api/uae-drugs', (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Query parameter required',
      details: 'Please provide at least 2 characters for search'
    });
  }

  try {
    if (uaeDrugs.length === 0) {
      return res.status(503).json({ 
        error: 'Drug database not available',
        details: 'Please try again later'
      });
    }

    const searchTerm = q.toLowerCase().trim();
    const filtered = uaeDrugs.filter(drug => {
      const packageName = drug['Package Name'] || '';
      const genericName = drug['Generic Name'] || '';
      const manufacturer = drug['Manufacturer Name'] || '';
      
      return packageName.toLowerCase().includes(searchTerm) ||
             genericName.toLowerCase().includes(searchTerm) ||
             manufacturer.toLowerCase().includes(searchTerm);
    }).slice(0, parseInt(req.query.limit) || 10).map(drug => ({
      name: drug['Package Name'] || 'Unknown',
      genericName: drug['Generic Name'] || 'Unknown',
      strength: drug['Strength'] || 'N/A',
      dosageForm: drug['Dosage Form'] || 'N/A',
      drugCode: drug['Agent Name'] || 'N/A',
      manufacturer: drug['Manufacturer Name'] || 'N/A',
      packageSize: drug['Package Size'] || 'N/A',
      dispenseMode: drug['Status'] === 'Active' ? 'Available' : 'Discontinued',
      packagePricePublic: drug['Package Price to Public'] || 'N/A',
      unitPricePublic: drug['Unit Price to Public'] || 'N/A',
      thiqa: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
      basic: drug['Included In Basic Drug Formulary'] === 'Yes',
      priorAuthorization: false,
      contraindications: 'Consult healthcare provider'
    }));
    
    res.json({
      results: filtered,
      total: filtered.length,
      query: q,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    log.error('UAE drugs API error', error);
    res.status(500).json({ 
      error: 'Failed to fetch drug data',
      details: 'Internal server error occurred'
    });
  }
});



// Get port from environment or use default
const PORT = process.env.PORT || 3001;

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  log.info(`PharmGenius server running on port ${PORT}`);
  log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  log.info(`Loaded ${uaeDrugs.length} drugs from UAE database`);
  log.info(`Loaded ${icd10Codes.length} ICD-10 codes`);
  log.info(`MongoDB: ${mongoDbAvailable ? 'Connected' : 'Offline'}`);
  log.info(`Security: Helmet ${process.env.HELMET_ENABLED !== 'false' ? 'Enabled' : 'Disabled'}`);
  log.info(`Rate Limiting: ${process.env.RATE_LIMIT_ENABLED !== 'false' ? 'Enabled' : 'Disabled'}`);
});