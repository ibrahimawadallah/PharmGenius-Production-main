@echo off
echo Testing Node.js installation...
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not in the system PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed at:
where node
echo.

echo Node.js version:
node --version
echo.

echo Creating a test file...
echo console.log('Test successful!'); > test.js

if not exist test.js (
    echo ERROR: Could not create test file
    pause
    exit /b 1
)

echo Running test file...
node test.js

del test.js

echo.
echo Node.js installation appears to be working correctly.
pause
