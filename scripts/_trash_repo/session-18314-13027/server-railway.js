import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Handle SPA - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// MongoDB connection
let db, mongoDbAvailable = false;

async function initializeMongoDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not provided');
      return false;
    }

    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db();
    await db.command({ ping: 1 });
    mongoDbAvailable = true;
    console.log('MongoDB initialized successfully');
    return true;
  } catch (error) {
    console.error('MongoDB failed:', error.message);
    mongoDbAvailable = false;
    return false;
  }
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      mongodb: mongoDbAvailable ? 'connected' : 'offline',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Drug search API
app.get('/api/drug-service/search', async (req, res) => {
  try {
    if (!mongoDbAvailable) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const { query = '', limit = 20 } = req.query;
    const drugsCollection = db.collection('drugs');
    
    const mongoQuery = query ? {
      $or: [
        { 'Package Name': { $regex: query, $options: 'i' } },
        { 'Generic Name': { $regex: query, $options: 'i' } }
      ]
    } : {};

    const results = await drugsCollection.find(mongoQuery).limit(parseInt(limit)).toArray();
    
    res.json({
      results: results.map(drug => ({
        id: drug.drugId || drug._id,
        drug_name: drug['Package Name'] || 'Unknown',
        generic_name: drug['Generic Name'] || 'Unknown',
        manufacturer: drug['Manufacturer Name'] || '',
        strength: drug['Strength'] || '',
        dosage_form: drug['Dosage Form'] || ''
      })),
      total: results.length,
      query
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Individual drug details
app.get('/api/drug-service/drugs/:id', async (req, res) => {
  try {
    if (!mongoDbAvailable) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const { id } = req.params;
    const drugsCollection = db.collection('drugs');
    const drug = await drugsCollection.findOne({ drugId: id });

    if (!drug) {
      return res.status(404).json({ error: 'Drug not found' });
    }

    res.json({
      id: drug.drugId || drug._id,
      drug_name: drug['Package Name'] || 'Unknown',
      generic_name: drug['Generic Name'] || 'Unknown',
      manufacturer: drug['Manufacturer Name'] || '',
      strength: drug['Strength'] || '',
      dosage_form: drug['Dosage Form'] || '',
      price_public: drug['Package Price to Public'] || ''
    });
  } catch (error) {
    console.error('Drug details error:', error);
    res.status(500).json({ error: 'Failed to get drug details' });
  }
});

// Catch-all for frontend
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    res.sendFile(indexPath);
  } catch (error) {
    res.status(404).send('App not found');
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Handle graceful shutdown
function setupGracefulShutdown(server) {
  const shutdown = async (signal) => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    
    try {
      // Close server
      await new Promise((resolve) => server.close(resolve));
      console.log('HTTP server closed');
      
      // Close MongoDB connection if it exists
      if (mongoDbAvailable && db) {
        await db.client.close();
        console.log('MongoDB connection closed');
      }
      
      console.log('Shutdown complete');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };

  // Handle signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });
}

// Initialize and start server
async function startServer() {
  try {
    await initializeMongoDB();
    
    // Start the server
    const server = app.listen(PORT, '0.0.0.0', () => {
      const host = server.address().address;
      const port = server.address().port;
      console.log(`PharmGenius server running at http://${host}:${port}`);
      console.log('MongoDB:', mongoDbAvailable ? 'Connected' : 'Not connected');
      
      // Signal that the server is ready (for Railway health checks)
      process.send?.('ready');
    });
    
    // Setup graceful shutdown
    setupGracefulShutdown(server);
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);