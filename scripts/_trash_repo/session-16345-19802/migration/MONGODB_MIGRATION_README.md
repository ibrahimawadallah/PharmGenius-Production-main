# MongoDB Migration Script

## 🎯 Overview

The MongoDB migration script (`migrateToMongoDB.js`) provides a comprehensive solution for migrating PharmGenius data from local files to MongoDB. It handles multiple data sources and creates optimized database structures for production use.

## 📊 Data Sources Migrated

### 1. UAE Drugs (`UAE drug list.csv`)
- **Collection**: `drugs`
- **Source**: CSV file with UAE pharmaceutical data
- **Fields**: Package Name, Generic Name, Status, Dosage Form, etc.
- **Indexes**: drugId, Package Name, Generic Name, Status, Dosage Form, source

### 2. Daman Formulary (`public/daman-formulary.json`)
- **Collection**: `daman_formulary`
- **Source**: JSON file with Daman insurance formulary data
- **Fields**: drug_name, generic_name, category, coverage_tier, etc.
- **Indexes**: drug_name, generic_name, category, coverage_tier

### 3. ICD-10 Codes (`public/icd10-data.json`)
- **Collection**: `icd10_codes`
- **Source**: JSON file with drug-to-ICD-10 code mappings
- **Fields**: drug_name, code, description
- **Indexes**: drug_name, code, description

## 🚀 Features

### ✨ **Enhanced Functionality**
- **Multi-source migration** - Handles CSV and JSON data formats
- **Automatic indexing** - Creates optimized indexes for fast queries
- **Progress tracking** - Detailed logging with timestamps
- **Error handling** - Comprehensive error management
- **Migration reporting** - Summary report with statistics
- **Source tracking** - Identifies data origin for each record
- **Audit trails** - Migration timestamps for compliance

### 🔧 **Utility Functions**
- **Environment validation** - Checks for required configuration
- **File existence checks** - Gracefully handles missing files
- **Data transformation** - Converts between data formats
- **Batch processing** - Efficient bulk operations

## 📋 Prerequisites

### 1. MongoDB Setup
```bash
# Install MongoDB locally or use MongoDB Atlas
# Local installation: https://docs.mongodb.com/manual/installation/
# MongoDB Atlas: https://www.mongodb.com/cloud/atlas
```

### 2. Environment Configuration
Update your `.env` file with MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/pharmgenius
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pharmgenius
```

### 3. Required Dependencies
All dependencies are already included in `package.json`:
- `mongodb` - MongoDB driver
- `papaparse` - CSV parsing
- `dotenv` - Environment variables

## 🏃‍♂️ Usage

### Method 1: Using npm script (Recommended)
```bash
npm run migrate:mongo
```

### Method 2: Direct execution
```bash
node scripts/migrateToMongoDB.js
```

### Method 3: Test validation first
```bash
node scripts/testMigration.js
```

## 📊 Expected Output

```
[2024-01-01T12:00:00.000Z] 🔌 Connecting to MongoDB...
[2024-01-01T12:00:01.000Z] ✅ Connected to MongoDB successfully
🔧 Creating database indexes...
✅ All indexes created successfully.
🏥 Starting UAE drugs migration...
[2024-01-01T12:00:02.000Z] ✅ UAE drugs migration completed
   📊 {
     "total": 1500,
     "inserted": 1500
   }
💊 Starting Daman formulary migration...
[2024-01-01T12:00:03.000Z] ✅ Daman formulary migration completed
   📊 {
     "total": 800,
     "inserted": 800
   }
🏷️  Starting ICD-10 codes migration...
[2024-01-01T12:00:04.000Z] ✅ ICD-10 codes migration completed
   📊 {
     "total": 2000,
     "inserted": 2000
   }

📋 MIGRATION REPORT
==================
📊 Total records migrated: 4300

📈 Breakdown by collection:
   UAE Drugs: ✅ 1500 records
   Daman Formulary: ✅ 800 records
   ICD-10 Codes: ✅ 2000 records

🎉 Migration completed successfully!
[2024-01-01T12:00:05.000Z] 🔌 Disconnected from MongoDB
```

## 🗃️ Database Structure

### Collections Created:
1. **`drugs`** - UAE pharmaceutical data
2. **`daman_formulary`** - Insurance formulary data
3. **`icd10_codes`** - ICD-10 code mappings

### Indexes Created:
- **Performance indexes** for fast searching
- **Unique indexes** to prevent duplicates
- **Compound indexes** for complex queries

## 🔍 Verification

After migration, verify the data:

```javascript
// Connect to MongoDB and check collections
use pharmgenius;
db.drugs.countDocuments();
db.daman_formulary.countDocuments();
db.icd10_codes.countDocuments();

// Sample queries
db.drugs.findOne();
db.daman_formulary.findOne();
db.icd10_codes.findOne();
```

## 🚨 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify MONGODB_URI in .env file
   - Check network connectivity

2. **File Not Found Warnings**
   - Files will be skipped if not found
   - Check file paths and permissions
   - Ensure data files exist in correct locations

3. **Permission Errors**
   - Ensure MongoDB user has write permissions
   - Check file system permissions

4. **Memory Issues**
   - Large datasets may require increased Node.js memory
   - Use: `node --max-old-space-size=4096 scripts/migrateToMongoDB.js`

## 🔄 Re-running Migration

The script safely handles re-runs by:
- **Clearing existing data** before migration
- **Recreating indexes** if needed
- **Providing fresh migration timestamps**

## 📈 Performance Notes

- **Batch operations** for efficient data insertion
- **Optimized indexes** for fast queries
- **Memory-efficient** processing for large datasets
- **Progress logging** to monitor performance

## 🔐 Security Considerations

- **Environment variables** for sensitive configuration
- **No hardcoded credentials** in source code
- **Audit trails** with migration timestamps
- **Source tracking** for data lineage

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the migration logs for specific errors
3. Verify MongoDB connection and permissions
4. Ensure all required files are present

---

**Last Updated**: January 2024
**Version**: 2.0.0
**Compatibility**: Node.js 18+, MongoDB 4.4+