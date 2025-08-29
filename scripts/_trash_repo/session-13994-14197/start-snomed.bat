@echo off
echo Starting SNOMED Snowstorm Server...

echo Checking if Java is installed...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 11 or higher
    pause
    exit /b 1
)

echo Checking if SNOMED Snowstorm is available...
if not exist "snowstorm.jar" (
    echo ERROR: snowstorm.jar not found
    echo Please download SNOMED Snowstorm from:
    echo https://github.com/IHTSDO/snowstorm/releases
    pause
    exit /b 1
)

echo Starting SNOMED Snowstorm on port 8080...
start "SNOMED Snowstorm" java -Xms2g -Xmx4g -jar snowstorm.jar --server.port=8080

echo Waiting for SNOMED to start...
timeout /t 10 /nobreak >nul

echo Testing SNOMED health...
node test-snomed.js

pause