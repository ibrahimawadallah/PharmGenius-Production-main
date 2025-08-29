@echo off
echo ===================================
echo  Simple Deployment Setup
===================================
echo.

echo [1/3] Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [2/3] Building frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)

echo [3/3] Deployment package ready!
echo.
echo ===== NEXT STEPS =====
echo 1. Go to https://dashboard.render.com/
echo 2. Click 'New' -> 'Web Service'
echo 3. Connect your GitHub/GitLab repo or upload manually
echo 4. Configure settings:
echo    - Name: pharmgenius
echo    - Region: Choose closest to you
echo    - Build Command: npm install
echo    - Start Command: node server/server.js
echo 5. Add environment variables if needed
echo 6. Click 'Create Web Service'
echo.
start https://dashboard.render.com/
pause
