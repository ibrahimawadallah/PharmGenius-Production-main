@echo off
echo Starting MongoDB Migration...
echo.
echo This will migrate all data to MongoDB:
echo - UAE Drug List (CSV)
echo - Daman Formulary (JSON)
echo - ICD-10 Codes (JSON)
echo.
echo Make sure MongoDB is running on localhost:27017
echo.
pause
echo.
echo Running migration script...
"C:\Program Files\nodejs\node.exe" scripts/migration/migrateToMongoDB.js
echo.
if %errorlevel% equ 0 (
    echo ✅ Migration completed successfully!
) else (
    echo ❌ Migration failed with error code %errorlevel%
)
echo.
pause