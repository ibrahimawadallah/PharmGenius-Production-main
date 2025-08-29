@echo off
setlocal enabledelayedexpansion

echo ===================================
echo  PharmGenius Deployment Assistant
echo ===================================
echo.

:menu
cls
echo [1] Deploy Frontend + Backend (Vercel)
echo [2] Deploy Backend (Railway)
echo [3] Exit
echo.
set /p choice="Choose an option (1-4): "

echo.

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto railway
if "%choice%"=="3" goto end

echo Invalid choice. Please try again.
pause
goto menu

:vercel
echo === Deploying Full Stack to Vercel ===

echo This will deploy both frontend and backend to Vercel.
echo Note: For production, consider using Railway for backend.
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install it first.
    pause
    exit /b 1
)

:: Install Vercel CLI if not installed
where vercel >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

:: Login to Vercel
echo Please log in to Vercel...
vercel login

:: Create vercel.json for full-stack deployment
(
echo {
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" },
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server/api/$1" },
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
) > vercel.json

:: Deploy to Vercel
echo Deploying to Vercel...
vercel --prod --confirm --name pharmgenius-ai

echo.
echo Frontend deployment initiated!
echo After deployment, update VITE_API_URL in Vercel project settings.
pause
goto end

:railway
echo === Deploying to Railway ===

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install it first.
    pause
    exit /b 1
)

:: Install Railway CLI if not installed
where railway >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing Railway CLI...
    npm install -g @railway/cli
)

:: Login to Railway
echo Please log in to Railway...
railway login

:: Create new project
echo Creating new Railway project...
railway init

:: Add environment variables
echo Adding environment variables...
railway add -v NODE_ENV=production
railway add -v MONGODB_URI=your_mongodb_uri
railway add -v JWT_SECRET=your_jwt_secret

:: Deploy
echo Deploying to Railway...
railway up

echo.
echo Backend deployment initiated!
echo Note your backend URL and update VITE_API_URL in Vercel.
pause
goto end

:both
call :vercel
call :railway
goto end

:end
echo.
echo Deployment process completed!
echo Don't forget to update the VITE_API_URL in your Vercel project settings
echo to point to your Railway backend URL after deployment.
pause
