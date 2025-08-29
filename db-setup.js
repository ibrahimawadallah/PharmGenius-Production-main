const { MongoClient } = require('mongodb');
require('dotenv').config();

async function setupDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not set in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });
  
  try {
    // 1. Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // 2. Create indexes
    console.log('🔄 Creating indexes...');
    try {
      await Promise.all([
        db.collection('users').createIndex({ email: 1 }, { unique: true }),
        db.collection('drugs').createIndex({ name: "text", description: "text" }),
        db.collection('patients').createIndex({ patientId: 1 }, { unique: true }),
        db.collection('prescriptions').createIndex({ patientId: 1, date: -1 })
      ]);
      console.log('✅ Indexes created successfully');
    } catch (indexError) {
      console.error('❌ Error creating indexes:', indexError.message);
    }
    
    // 3. Test connection with operations
    console.log('🧪 Testing database operations...');
    try {
      const collections = await db.listCollections().toArray();
      console.log('📦 Collections:', collections.length > 0 
        ? collections.map(c => c.name).join(', ')
        : 'No collections found');
    } catch (collectionError) {
      console.error('❌ Error listing collections:', collectionError.message);
    }
    
    console.log('\n🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (error.message.includes('bad auth')) {
      console.error('⚠️  Authentication failed. Please check your MongoDB credentials.');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('⚠️  Could not connect to MongoDB. Please check your connection string and network.');
    }
  } finally {
    await client.close();
    process.exit(0);
  }
}

// Run the setup
setupDatabase();
