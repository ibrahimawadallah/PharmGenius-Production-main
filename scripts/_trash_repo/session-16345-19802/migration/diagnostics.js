import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 MongoDB Migration Diagnostics');
console.log('================================');
console.log();

// Check environment variables
console.log('1. Environment Variables:');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log();

// Check data files
console.log('2. Data Files:');
const dataFiles = [
  { name: 'UAE drug list.csv', path: path.join(__dirname, '..', '..', 'data', 'csv', 'UAE drug list.csv') },
  { name: 'daman-formulary.json', path: path.join(__dirname, '..', '..', 'data', 'json', 'daman-formulary.json') },
  { name: 'icd10-data.json', path: path.join(__dirname, '..', '..', 'data', 'json', 'icd10-data.json') }
];

dataFiles.forEach(file => {
  const exists = fs.existsSync(file.path);
  console.log(`   ${file.name}: ${exists ? '✅ Found' : '❌ Missing'}`);
  if (exists) {
    const stats = fs.statSync(file.path);
    console.log(`      Size: ${(stats.size / 1024).toFixed(2)} KB`);
  }
});
console.log();

// Check dependencies
console.log('3. Dependencies:');
try {
  await import('mongodb');
  console.log('   mongodb: ✅ Available');
} catch (error) {
  console.log('   mongodb: ❌ Not available');
}

try {
  await import('papaparse');
  console.log('   papaparse: ✅ Available');
} catch (error) {
  console.log('   papaparse: ❌ Not available');
}
console.log();

// Test MongoDB connection
console.log('4. MongoDB Connection:');
if (process.env.MONGODB_URI) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('   Connection: ✅ Successful');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log(`   Collections: ${collections.length} found`);
    
    await client.close();
  } catch (error) {
    console.log('   Connection: ❌ Failed');
    console.log(`   Error: ${error.message}`);
  }
} else {
  console.log('   Connection: ❌ Cannot test (MONGODB_URI not set)');
}
console.log();

// Check migration script
console.log('5. Migration Script:');
const migrationScript = path.join(__dirname, 'migrateToMongoDB.js');
const scriptExists = fs.existsSync(migrationScript);
console.log(`   migrateToMongoDB.js: ${scriptExists ? '✅ Found' : '❌ Missing'}`);
console.log();

console.log('Diagnostics complete!');
console.log('If all checks pass, you can run the migration with:');
console.log('npm run migrate:mongo');