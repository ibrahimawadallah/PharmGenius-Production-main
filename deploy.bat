@echo off
setlocal enabledelayedexpansion

echo ===================================
echo  PharmGenius Deployment to Render
echo ===================================
echo.

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

:: Main deployment process
echo.
echo Starting deployment to Render...
echo.

:: Deploy using render.yaml
echo Deploying services defined in render.yaml...
render services create --file render.yaml

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Deployment failed. Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ===================================
echo Deployment started successfully!
echo Check your Render dashboard for deployment progress.
echo.
start https://dashboard.render.com/

) else (
    echo.
    echo Deployment completed successfully!
    echo.
    echo Important: Make sure to set up the following environment variables in Vercel:
    echo - VITE_API_URL: Your backend API URL
)

pause
goto :eof

:set_api_url
echo.
echo === Set Backend API URL ===
echo.
set /p api_url="Enter your backend API URL (e.g., https://your-backend.vercel.app): "

if not exist vercel.json (
    echo vercel.json not found. Creating a new one...
    (
        echo {
        echo   "version": 2,
        echo   "builds": [
        echo     {
        echo       "src": "package.json",
        echo       "use": "@vercel/static-build",
        echo       "config": {
        echo         "distDir": "dist"
        echo       }
        echo     }
        echo   ],
        echo   "routes": [
        echo     {
        echo       "src": "/(.*)",
        echo       "dest": "/index.html"
        echo     }
        echo   ]
        echo }
    ) > vercel.json
)

:: Update the VITE_API_URL in vercel.json
powershell -Command "(Get-Content vercel.json) -replace '\"VITE_API_URL\": \".*?\"', '\"VITE_API_URL\": \"%api_url%\"' | Set-Content vercel.json"

echo.
echo API URL has been updated in vercel.json
echo.

pause
goto :eof

:end
echo.
echo Deployment process completed!
echo Don't forget to update the VITE_API_URL in your Vercel project settings
echo to point to your Railway backend URL after deployment.
pause
