@echo off
echo ===== Starting Deployment Process =====
echo.

:: Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo 1. Checking Git status...
git status
if %errorlevel% neq 0 (
    echo ERROR: Not a git repository or git command failed
    pause
    exit /b 1
)

echo.
echo 2. Adding all changes...
git add .

if %errorlevel% neq 0 (
    echo ERROR: Failed to add files to git
    pause
    exit /b 1
)

set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" (
    set commit_message="Deploy: Automated deployment %date% %time%"
)

echo.
echo 3. Committing changes with message: %commit_message%
git commit -m %commit_message%

if %errorlevel% neq 0 (
    echo WARNING: No changes to commit or commit failed
    echo Continuing with deployment...
)

echo.
echo 4. Pushing to remote repository...
git push origin main

if %errorlevel% neq 0 (
    echo ERROR: Failed to push to remote repository
    echo Please check your git remote and credentials
    pause
    exit /b 1
)

echo.
echo 5. Checking if Railway CLI is installed...
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Railway CLI not found. Installing...
    npm install -g @railway/cli
)

echo.
echo 6. Logging in to Railway...
railway login

if %errorlevel% neq 0 (
    echo ERROR: Failed to login to Railway
    echo Please make sure you have a Railway account and are logged in
    pause
    exit /b 1
)

echo.
echo 7. Deploying to Railway...
echo This might take a few minutes...
railway up

if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    echo Check the error messages above for details
    pause
    exit /b 1
)

echo.
echo ===== Deployment Completed Successfully =====
echo.
echo Your application is now live on Railway!
echo You can check the deployment status at: https://railway.app/dashboard

pause
