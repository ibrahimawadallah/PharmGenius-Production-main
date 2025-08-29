# PharmGenius Project Structure Enhancement Plan

## 🎯 Current Issues
- Root directory cluttered with multiple documentation files
- Data files scattered in different locations
- Batch files mixed with source code
- No clear separation of concerns

## 🚀 Enhanced Structure

```
PharmGenius/
├── 📁 config/                    # Configuration files
│   ├── .env.example
│   ├── vercel.json
│   ├── railway.json
│   ├── render.yaml
│   └── Dockerfile
├── 📁 data/                      # All data files
│   ├── csv/
│   │   └── UAE drug list.csv
│   ├── json/
│   │   ├── daman-formulary.json
│   │   ├── icd10-data.json
│   │   ├── icd10-data-enhanced.json
│   │   ├── icd10-data-fast.json
│   │   └── test-drugs.json
│   └── README.md
├── 📁 docs/                      # All documentation
│   ├── deployment/
│   │   ├── DEPLOYMENT.md
│   │   ├── DEPLOYMENT_ENV_SETUP.md
│   │   ├── RAILWAY_DEPLOYMENT_GUIDE.md
│   │   └── README_DEPLOYMENT.md
│   ├── architecture/
│   │   ├── HEALTHCARE_SYSTEM_ARCHITECTURE.md
│   │   └── PHARMAAPP_SUMMARY.md
│   ├── DATA_SCALE_SUMMARY.md
│   ├── PRODUCTION_FIXES.md
│   ├── PROJECT_SUMMARY.md
│   ├── RUN_INSTRUCTIONS.md
│   └── VITE_CONFIG_FOR_ROOT_APP.md
├── 📁 scripts/                   # All scripts and utilities
│   ├── migration/
│   │   ├── migrateToMongoDB.js
│   │   ├── migrateToCosmosDB.js
│   │   ├── diagnostics.js
│   │   ├── testMigration.js
│   │   └── MONGODB_MIGRATION_README.md
│   ├── data-processing/
│   │   ├── processICD10Codes.js
│   │   ├── processICD10Fast.js
│   │   ├── processICD10FastCJS.cjs
│   │   └── testICD10APIs.js
│   ├── batch/
│   │   ├── start.bat
│   │   ├── build.bat
│   │   ├── test.bat
│   │   ├── check-mongodb.bat
│   │   └── migrate-mongodb.bat
│   └── syntaxCheck.js
├── 📁 src/                       # Source code
│   ├── components/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── theme.js
├── 📁 server/                    # Backend code
│   ├── api/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── server-fallback.js
│   └── startup-check.js
├── 📁 public/                    # Static assets
│   ├── favicon.svg
│   └── uae-drug-list.json
├── 📁 tests/                     # Test files
│   └── test-app.html
├── .dockerignore
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 📋 Implementation Steps

### Phase 1: Create New Directory Structure
1. Create main directories: config/, data/, docs/, scripts/, server/, tests/
2. Create subdirectories for better organization

### Phase 2: Move Files to Appropriate Locations
1. Move configuration files to config/
2. Organize data files in data/ with subdirectories
3. Consolidate documentation in docs/
4. Organize scripts by purpose
5. Restructure server code

### Phase 3: Update References
1. Update import paths in source files
2. Update batch file paths
3. Update configuration references
4. Update documentation links

### Phase 4: Clean Up Root Directory
1. Keep only essential files in root
2. Remove duplicate files
3. Update README with new structure

## 🎯 Benefits
- ✅ Clear separation of concerns
- ✅ Easier navigation and maintenance
- ✅ Professional project structure
- ✅ Better scalability
- ✅ Improved developer experience
- ✅ Easier onboarding for new developers