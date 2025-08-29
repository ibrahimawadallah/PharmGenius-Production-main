import { MongoClient } from 'mongodb';
import fs from 'fs';
import Papa from 'papaparse';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions
function validateEnvironment() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not defined in your .env file.');
    console.log('💡 Please add MONGODB_URI to your .env file with your MongoDB connection string.');
    process.exit(1);
  }
}

function logProgress(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(`   📊 ${JSON.stringify(data, null, 2)}`);
  }
}

// Migration functions
async function createIndexes(database) {
  console.log('🔧 Creating database indexes...');
  
  // Drugs collection indexes
  const drugsCollection = database.collection('drugs');
  await drugsCollection.createIndex({ drugId: 1 }, { unique: true });
  await drugsCollection.createIndex({ 'Package Name': 1 });
  await drugsCollection.createIndex({ 'Generic Name': 1 });
  await drugsCollection.createIndex({ 'Status': 1 });
  await drugsCollection.createIndex({ 'Dosage Form': 1 });
  await drugsCollection.createIndex({ 'source': 1 });
  
  // Daman formulary collection indexes
  const damanCollection = database.collection('daman_formulary');
  await damanCollection.createIndex({ 'drug_name': 1 });
  await damanCollection.createIndex({ 'generic_name': 1 });
  await damanCollection.createIndex({ 'category': 1 });
  await damanCollection.createIndex({ 'coverage_tier': 1 });
  
  // ICD-10 collection indexes
  const icd10Collection = database.collection('icd10_codes');
  await icd10Collection.createIndex({ 'drug_name': 1 });
  await icd10Collection.createIndex({ 'code': 1 });
  await icd10Collection.createIndex({ 'description': 1 });
  
  console.log('✅ All indexes created successfully.');
}

async function migrateUAEDrugs(database) {
  console.log('🏥 Starting UAE drugs migration...');
  
  const collection = database.collection('drugs');
  
  // Clear existing UAE drugs
  await collection.deleteMany({ source: 'uae_drugs' });
  
  // Read CSV file
  const drugDbPath = path.join(__dirname, '..', '..', 'data', 'csv', 'UAE drug list.csv');
  
  if (!fs.existsSync(drugDbPath)) {
    console.warn('⚠️  UAE drug list.csv not found, skipping UAE drugs migration.');
    return { migrated: 0, skipped: true };
  }
  
  const csvData = fs.readFileSync(drugDbPath, 'utf8').replace(/^\uFEFF/, '');
  
  // Parse CSV
  const parsed = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });
  
  if (parsed.errors.length > 0) {
    console.error('❌ Error parsing UAE drugs CSV:', parsed.errors);
    return { migrated: 0, errors: parsed.errors };
  }
  
  // Prepare data for MongoDB
  const drugs = parsed.data
    .filter(drug => drug['Package Name'])
    .map((drug, index) => ({
      drugId: `uae_${index + 1}`,
      source: 'uae_drugs',
      migrated_at: new Date(),
      ...drug
    }));
  
  if (drugs.length > 0) {
    const result = await collection.insertMany(drugs);
    logProgress(`✅ UAE drugs migration completed`, { 
      total: drugs.length, 
      inserted: result.insertedCount 
    });
    return { migrated: result.insertedCount };
  }
  
  return { migrated: 0 };
}

async function migrateDamanFormulary(database) {
  console.log('💊 Starting Daman formulary migration...');
  
  const collection = database.collection('daman_formulary');
  
  // Clear existing data
  await collection.deleteMany({});
  
  // Read JSON file
  const formularyPath = path.join(__dirname, '..', '..', 'data', 'json', 'daman-formulary.json');
  
  if (!fs.existsSync(formularyPath)) {
    console.warn('⚠️  daman-formulary.json not found, skipping Daman formulary migration.');
    return { migrated: 0, skipped: true };
  }
  
  try {
    const formularyData = JSON.parse(fs.readFileSync(formularyPath, 'utf8'));
    
    // Convert object to array if needed
    let formularyArray = [];
    if (Array.isArray(formularyData)) {
      formularyArray = formularyData;
    } else {
      // If it's an object, convert to array
      formularyArray = Object.entries(formularyData).map(([key, value]) => ({
        drug_name: key,
        ...value,
        migrated_at: new Date()
      }));
    }
    
    if (formularyArray.length > 0) {
      const result = await collection.insertMany(formularyArray);
      logProgress(`✅ Daman formulary migration completed`, { 
        total: formularyArray.length, 
        inserted: result.insertedCount 
      });
      return { migrated: result.insertedCount };
    }
    
    return { migrated: 0 };
  } catch (error) {
    console.error('❌ Error migrating Daman formulary:', error.message);
    return { migrated: 0, error: error.message };
  }
}

async function migrateICD10Codes(database) {
  console.log('🏷️  Starting ICD-10 codes migration...');
  
  const collection = database.collection('icd10_codes');
  
  // Clear existing data
  await collection.deleteMany({});
  
  // Read JSON file
  const icd10Path = path.join(__dirname, '..', '..', 'data', 'json', 'icd10-data.json');
  
  if (!fs.existsSync(icd10Path)) {
    console.warn('⚠️  icd10-data.json not found, skipping ICD-10 codes migration.');
    return { migrated: 0, skipped: true };
  }
  
  try {
    const icd10Data = JSON.parse(fs.readFileSync(icd10Path, 'utf8'));
    
    // Convert object structure to array
    const icd10Array = [];
    Object.entries(icd10Data).forEach(([drugName, codes]) => {
      if (Array.isArray(codes)) {
        codes.forEach(codeObj => {
          icd10Array.push({
            drug_name: drugName,
            code: codeObj.code,
            description: codeObj.description,
            migrated_at: new Date()
          });
        });
      }
    });
    
    if (icd10Array.length > 0) {
      const result = await collection.insertMany(icd10Array);
      logProgress(`✅ ICD-10 codes migration completed`, { 
        total: icd10Array.length, 
        inserted: result.insertedCount 
      });
      return { migrated: result.insertedCount };
    }
    
    return { migrated: 0 };
  } catch (error) {
    console.error('❌ Error migrating ICD-10 codes:', error.message);
    return { migrated: 0, error: error.message };
  }
}

async function generateMigrationReport(results) {
  console.log('\n📋 MIGRATION REPORT');
  console.log('==================');
  
  const totalMigrated = Object.values(results).reduce((sum, result) => {
    return sum + (result.migrated || 0);
  }, 0);
  
  console.log(`📊 Total records migrated: ${totalMigrated}`);
  console.log('\n📈 Breakdown by collection:');
  
  Object.entries(results).forEach(([collection, result]) => {
    if (result.skipped) {
      console.log(`   ${collection}: ⏭️  SKIPPED (file not found)`);
    } else if (result.error) {
      console.log(`   ${collection}: ❌ ERROR - ${result.error}`);
    } else {
      console.log(`   ${collection}: ✅ ${result.migrated} records`);
    }
  });
  
  console.log('\n🎉 Migration completed successfully!');
}

async function migrateToMongo() {
  validateEnvironment();
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    logProgress('🔌 Connecting to MongoDB...');
    await client.connect();
    logProgress('✅ Connected to MongoDB successfully');
    
    const database = client.db();
    
    // Create indexes
    await createIndexes(database);
    
    // Run migrations
    const results = {
      'UAE Drugs': await migrateUAEDrugs(database),
      'Daman Formulary': await migrateDamanFormulary(database),
      'ICD-10 Codes': await migrateICD10Codes(database)
    };
    
    // Generate report
    await generateMigrationReport(results);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.close();
    logProgress('🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrateToMongo().catch(console.error);