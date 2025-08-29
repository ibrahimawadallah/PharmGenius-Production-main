@echo off
setlocal enabledelayedexpansion

:: Set colors
set RED=91
set GREEN=92
set YELLOW=93
set BLUE=94
set NC=0

echo [1/4] Checking system requirements...
where node >nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/4] Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [3/4] Building frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)

echo [4/4] Deployment package ready!
echo.
echo ===== DEPLOYMENT INSTRUCTIONS =====
echo 1. Go to https://dashboard.render.com/
echo 2. Click 'New' -> 'Web Service'
echo 3. Connect your GitHub/GitLab repo or upload manually
echo 4. Configure settings:
echo    - Name: pharmgenius
echo    - Region: Choose closest to you
echo    - Build Command: npm install
echo    - Start Command: node server/server.js
echo 5. Add these environment variables:
echo    - NODE_ENV=production
    - PORT=10000
    - MONGODB_URI=your_mongodb_uri
    - JWT_SECRET=your_jwt_secret
echo 6. Click 'Create Web Service'

start https://dashboard.render.com/
pause
