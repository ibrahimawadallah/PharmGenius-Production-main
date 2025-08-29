@echo off
setlocal enabledelayedexpansion

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Install Render CLI if not installed
where render >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Installing Render CLI...
    npm install -g @render-io/cli
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install Render CLI
        pause
        exit /b 1
    )
)

:: Login to Render if not logged in
echo Checking Render login status...
render auth current >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Please log in to your Render account...
    render auth login
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to log in to Render
        pause
        exit /b 1
    )
)

:: Create backend service
echo.
echo Creating backend service...
render services create ^
  --name pharmgenius-backend ^
  --type web ^
  --plan free ^
  --region oregon ^
  --build-command "npm install" ^
  --start-command "node server/server.js" ^
  --env NODE_VERSION=18.x ^
  --env NODE_ENV=production

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to create backend service
    pause
    exit /b 1
)

:: Create frontend service
echo.
echo Creating frontend service...
render services create ^
  --name pharmgenius-frontend ^
  --type web ^
  --plan free ^
  --region oregon ^
  --build-command "npm install && npm run build" ^
  --static-dir ./dist ^
  --env NODE_VERSION=18.x ^
  --env VITE_API_URL=https://pharmgenius-backend.onrender.com

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to create frontend service
    pause
    exit /b 1
)

echo.
echo ===================================
echo Deployment started successfully!
echo Check your Render dashboard for progress:
echo https://dashboard.render.com/
echo.
start https://dashboard.render.com/

pause
