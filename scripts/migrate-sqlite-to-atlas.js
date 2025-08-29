import { MongoClient } from 'mongodb';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ATLAS_URI = process.env.MONGODB_URI;

async function migrateSQLiteToAtlas() {
  console.log('🚀 Starting SQLite to Atlas migration...');

  try {
    // Connect to Atlas
    const atlasClient = new MongoClient(ATLAS_URI);
    await atlasClient.connect();
    const atlasDb = atlasClient.db();
    console.log('✅ Connected to Atlas');

    // Migrate drugs.db
    const drugsDbPath = path.join(process.cwd(), 'database', 'drugs.db');
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

    // Migrate medical_data.db
    const medicalDbPath = path.join(process.cwd(), 'database', 'medical_data.db');
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
    await atlasClient.close();
    console.log('🎉 SQLite migration completed!');

  } catch (error) {
    console.error('❌ SQLite migration failed:', error.message);
    process.exit(1);
  }
}

migrateSQLiteToAtlas();