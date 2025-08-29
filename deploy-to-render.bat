@echo off
echo ===================================
echo  Deploying PharmGenius to Render
echo ===================================
echo.

echo [1/5] Checking prerequisites...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

echo [2/5] Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [3/5] Building frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)

echo [4/5] Creating deployment package...
if not exist deploy mkdir deploy
xcopy /E /I /Y dist\* deploy\ >nul
xcopy /E /I /Y server\* deploy\server\ >nul
copy package.json deploy\ >nul
copy package-lock.json deploy\ >nul

:deploy
    echo [5/5] Deploying to Render...
    echo.
    echo Please follow these steps to complete deployment:
    echo 1. Go to https://dashboard.render.com/
    echo 2. Click 'New' and select 'Web Service'
    echo 3. Connect your GitHub/GitLab repository or upload the 'deploy' folder
    echo 4. Configure the following settings:
    echo    - Name: pharmgenius
    - Region: Choose the one closest to your users
    - Branch: main
    - Build Command: npm install
    - Start Command: node server/server.js
    - Publish Directory: (leave empty for full-stack)
    echo 5. Add environment variables if needed
    echo 6. Click 'Create Web Service'
    echo.
    echo Your application will be deployed automatically!
    echo.
    start https://dashboard.render.com/
    pause
