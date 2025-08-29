import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// MongoDB connection
let mongoClient, db;
let mongoDbAvailable = false;

async function initializeMongoDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not provided, running in local file mode.');
      return false;
    }

    mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db();
    await db.command({ ping: 1 });
    mongoDbAvailable = true;
    console.log('MongoDB initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize MongoDB', error);
    mongoDbAvailable = false;
    return false;
  }
}

const mongoInitialized = await initializeMongoDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Load UAE drug database
const drugDbPath = path.join(__dirname, 'server', 'UAE drug list.csv');
let uaeDrugs = [];

function loadUAEDrugs() {
  try {
    if (!fs.existsSync(drugDbPath)) {
      console.warn('UAE drug database file not found');
      return { success: false, count: 0 };
    }

    let csvData = fs.readFileSync(drugDbPath, 'utf8');
    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.slice(1);
    }

    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    const validDrugs = parsed.data.filter(drug => 
      drug && drug['Package Name'] && drug['Package Name'].trim()
    );

    let idCounter = 1;
    uaeDrugs = validDrugs.map(drug => ({ ...drug, id: idCounter++ }));

    console.log(`Successfully loaded ${uaeDrugs.length} drugs from UAE database`);
    return { success: true, count: uaeDrugs.length };
  } catch (error) {
    console.error('Error loading UAE drug database', error);
    return { success: false, count: 0 };
  }
}

const uaeLoadResult = loadUAEDrugs();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoDbAvailable ? 'connected' : 'offline',
    uaeDrugs: uaeLoadResult.count,
    timestamp: new Date().toISOString()
  });
});

// SNOMED health check - Disabled (Java not installed)
app.get('/api/snomed/health', async (req, res) => {
  res.status(503).json({
    success: false,
    error: 'SNOMED service disabled - Java not installed',
    message: 'Install Java 11+ to enable SNOMED features'
  });
});

// Drug search API
app.get('/api/drug-service/search', async (req, res) => {
  const query = req.query.query || '';
  const limit = parseInt(req.query.limit) || 20;
  
  let results = [];

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
      results = await drugsCollection.find(mongoQuery).limit(limit).toArray();
    } catch (error) {
      console.error('MongoDB search error', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
  } else {
    results = uaeDrugs.filter(drug => {
      const matchesQuery = !query || 
        (drug['Package Name'] && drug['Package Name'].toLowerCase().includes(query.toLowerCase())) ||
        (drug['Generic Name'] && drug['Generic Name'].toLowerCase().includes(query.toLowerCase()));
      
      return matchesQuery && drug['Status'] === 'Active';
    }).slice(0, limit);
  }
  
  const formattedResults = results.map(drug => ({
    id: drug.drugId || drug.id,
    drug_name: drug['Package Name'] || 'Unknown',
    generic_name: drug['Generic Name'] || 'Unknown',
    manufacturer: drug['Manufacturer Name'] || '',
    strength: drug['Strength'] || '',
    dosage_form: drug['Dosage Form'] || ''
  }));
  
  res.json({
    results: formattedResults,
    total: formattedResults.length,
    query
  });
});

// Catch-all for frontend
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'App not built' });
    }
  } catch (error) {
    res.status(404).json({ error: 'Page not found' });
  }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`PharmGenius server running on port ${PORT}`);
  console.log(`MongoDB: ${mongoDbAvailable ? 'Connected' : 'Offline'}`);
  console.log(`Loaded ${uaeDrugs.length} drugs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});