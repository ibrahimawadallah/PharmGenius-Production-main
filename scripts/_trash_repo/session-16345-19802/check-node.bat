@echo off
echo Checking Node.js installation...
echo.

echo [1/4] Checking Node.js version...
where node
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not in the system PATH
    exit /b 1
)

node --version
if %errorlevel% neq 0 (
    echo ERROR: Failed to get Node.js version
    exit /b 1
)

echo.
echo [2/4] Checking npm version...
npm --version
if %errorlevel% neq 0 (
    echo WARNING: npm is not working correctly
)

echo.
echo [3/4] Checking Node.js installation directory...
where node

for /f "tokens=*" %%a in ('where node') do (
    echo Node.js found at: %%~dpa
    dir "%%~dpanode.exe"
)

echo.
echo [4/4] Testing Node.js execution...
echo console.log('Node.js test successful!'); > test.js
node test.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute Node.js script
    del test.js
    exit /b 1
)
del test.js

echo.
echo Test completed successfully!
pause
