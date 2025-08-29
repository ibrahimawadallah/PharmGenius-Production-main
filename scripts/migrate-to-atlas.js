import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import dotenv from 'dotenv';

dotenv.config();

const LOCAL_URI = 'mongodb://localhost:27017/pharmgenius';
const ATLAS_URI = process.env.MONGODB_URI;

async function migrateToAtlas() {
  if (!ATLAS_URI || ATLAS_URI.includes('<username>')) {
    console.error('❌ Please update MONGODB_URI in .env with your Atlas connection string');
    process.exit(1);
  }

  console.log('🚀 Starting migration to Atlas...');

  try {
    // Connect to Atlas
    const atlasClient = new MongoClient(ATLAS_URI);
    await atlasClient.connect();
    const atlasDb = atlasClient.db();
    
    console.log('✅ Connected to Atlas');

    // Load UAE drugs from CSV
    const csvPath = path.join(process.cwd(), 'server', 'UAE drug list.csv');
    if (fs.existsSync(csvPath)) {
      const csvData = fs.readFileSync(csvPath, 'utf8');
      const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      
      const drugs = parsed.data.map((drug, index) => ({
        drugId: (index + 1).toString(),
        ...drug
      }));

      await atlasDb.collection('drugs').deleteMany({});
      await atlasDb.collection('drugs').insertMany(drugs);
      console.log(`✅ Migrated ${drugs.length} drugs to Atlas`);
    }

    // Load ICD-10 codes
    const icd10Path = path.join(process.cwd(), 'server', 'public', 'icd10-data.json');
    if (fs.existsSync(icd10Path)) {
      const icd10Data = JSON.parse(fs.readFileSync(icd10Path, 'utf8'));
      
      await atlasDb.collection('icd10_codes').deleteMany({});
      await atlasDb.collection('icd10_codes').insertMany(icd10Data);
      console.log(`✅ Migrated ${icd10Data.length} ICD-10 codes to Atlas`);
    }

    // Load categories
    const categoriesPath = path.join(process.cwd(), 'database', 'categories.csv');
    if (fs.existsSync(categoriesPath)) {
      const csvData = fs.readFileSync(categoriesPath, 'utf8');
      const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      
      await atlasDb.collection('categories').deleteMany({});
      await atlasDb.collection('categories').insertMany(parsed.data);
      console.log(`✅ Migrated ${parsed.data.length} categories to Atlas`);
    }

    // Load enhanced ICD-10 data
    const icd10EnhancedPath = path.join(process.cwd(), 'data', 'json', 'icd10-data-enhanced.json');
    if (fs.existsSync(icd10EnhancedPath)) {
      const enhancedData = JSON.parse(fs.readFileSync(icd10EnhancedPath, 'utf8'));
      
      await atlasDb.collection('icd10_enhanced').deleteMany({});
      await atlasDb.collection('icd10_enhanced').insertOne(enhancedData);
      console.log(`✅ Migrated enhanced ICD-10 data to Atlas`);
    }

    await atlasClient.close();
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateToAtlas();