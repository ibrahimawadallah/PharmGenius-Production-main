@echo off
echo MongoDB Migration Diagnostics
echo =============================
echo.
echo This will check:
echo - Environment variables
echo - Required data files
echo - Dependencies
echo - MongoDB connection
echo - Migration script syntax
echo.
"C:\Program Files\nodejs\node.exe" scripts/migration/diagnostics.js
echo.
pause