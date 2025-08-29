import { MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const ATLAS_URI = process.env.MONGODB_URI;

async function checkSQLiteDependencies() {
  try {
    await import('sqlite3');
    await import('sqlite');
    return true;
  } catch (error) {
    console.log('⚠️  SQLite dependencies not found. Install with: npm install sqlite3 sqlite');
    return false;
  }
}

async function migrateSQLiteToAtlas() {
  console.log('🚀 Starting SQLite to Atlas migration...');

  // Check if SQLite dependencies are available
  const hasDepencies = await checkSQLiteDependencies();
  if (!hasDepencies) {
    console.log('❌ Cannot proceed without SQLite dependencies');
    process.exit(1);
  }

  // Check if database files exist
  const drugsDbPath = path.join(process.cwd(), 'database', 'drugs.db');
  const medicalDbPath = path.join(process.cwd(), 'database', 'medical_data.db');

  if (!fs.existsSync(drugsDbPath) && !fs.existsSync(medicalDbPath)) {
    console.log('⚠️  No SQLite database files found to migrate');
    process.exit(0);
  }

  try {
    const { default: sqlite3 } = await import('sqlite3');
    const { open } = await import('sqlite');

    // Connect to Atlas
    const atlasClient = new MongoClient(ATLAS_URI);
    await atlasClient.connect();
    const atlasDb = atlasClient.db();
    console.log('✅ Connected to Atlas');

    // Migrate drugs.db if it exists
    if (fs.existsSync(drugsDbPath)) {
      const drugsDb = await open({
        filename: drugsDbPath,
        driver: sqlite3.Database
      });

      const tables = await drugsDb.all("SELECT name FROM sqlite_master WHERE type='table'");
      
      for (const table of tables) {
        const tableName = table.name;
        const rows = await drugsDb.all(`SELECT * FROM ${tableName}`);
        
        if (rows.length > 0) {
          await atlasDb.collection(`sqlite_${tableName}`).deleteMany({});
          await atlasDb.collection(`sqlite_${tableName}`).insertMany(rows);
          console.log(`✅ Migrated ${rows.length} records from ${tableName} table`);
        }
      }

      await drugsDb.close();
    }

    // Migrate medical_data.db if it exists
    if (fs.existsSync(medicalDbPath)) {
      const medicalDb = await open({
        filename: medicalDbPath,
        driver: sqlite3.Database
      });

      const medicalTables = await medicalDb.all("SELECT name FROM sqlite_master WHERE type='table'");
      
      for (const table of medicalTables) {
        const tableName = table.name;
        const rows = await medicalDb.all(`SELECT * FROM ${tableName}`);
        
        if (rows.length > 0) {
          await atlasDb.collection(`medical_${tableName}`).deleteMany({});
          await atlasDb.collection(`medical_${tableName}`).insertMany(rows);
          console.log(`✅ Migrated ${rows.length} records from medical_${tableName}`);
        }
      }

      await medicalDb.close();
    }

    await atlasClient.close();
    console.log('🎉 SQLite migration completed!');

  } catch (error) {
    console.error('❌ SQLite migration failed:', error.message);
    process.exit(1);
  }
}

migrateSQLiteToAtlas();