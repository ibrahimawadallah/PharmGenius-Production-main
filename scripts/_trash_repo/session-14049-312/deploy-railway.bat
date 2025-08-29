@echo off
echo ===== Deploying to Railway =====
echo.

echo 1. Installing Railway CLI if needed...
railway --version >nul 2>&1 || npm install -g @railway/cli

echo.
echo 2. Logging in to Railway...
railway login

if %errorlevel% neq 0 (
    echo ERROR: Failed to login to Railway
    echo Please make sure you have a Railway account
    pause
    exit /b 1
)

echo.
echo 3. Starting deployment...
railway up

echo.
echo ===== Deployment Complete =====
echo Check your Railway dashboard: https://railway.app/dashboard
pause
