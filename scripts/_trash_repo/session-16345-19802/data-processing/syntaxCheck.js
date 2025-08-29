// Simple syntax check for migration script
console.log('🔍 Checking migration script syntax...');

try {
  // Try to import the migration script to check for syntax errors
  import('./migrateToMongoDB.js')
    .then(() => {
      console.log('✅ Migration script syntax is valid');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Syntax error in migration script:', error.message);
      process.exit(1);
    });
} catch (error) {
  console.error('❌ Error checking syntax:', error.message);
  process.exit(1);
}