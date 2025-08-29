@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo ===== PHARMGENIUS DEPLOYMENT =====
echo.

:: 1. Check for Git changes
echo 1. Checking Git status...
git status
if %errorlevel% neq 0 (
    echo ERROR: Git command failed. Make sure Git is installed and this is a git repository.
    pause
    exit /b 1
)

:: 2. Add and commit changes
echo.
echo 2. Adding and committing changes...
git add .

git diff-index --quiet HEAD --
if !errorlevel! equ 0 (
    echo No changes to commit.
) else (
    set timestamp=%date% %time%
    git commit -m "Deploy: %timestamp%"
    
    if !errorlevel! neq 0 (
        echo WARNING: Commit failed, continuing with deployment...
    )
)

:: 3. Push to remote
echo.
echo 3. Pushing to remote repository...
git push origin main
if !errorlevel! neq 0 (
    echo ERROR: Failed to push to remote repository
    echo Please check your git remote and credentials
    pause
    exit /b 1
)

:: 4. Deploy to Railway
echo.
echo 4. Deploying to Railway...
railway --version >nul 2>&1
if !errorlevel! neq 0 (
    echo Installing Railway CLI...
    npm install -g @railway/cli
)

echo.
echo 5. Starting Railway deployment...
railway up

:: 5. Show deployment status
echo.
echo ===== DEPLOYMENT COMPLETE =====
echo.
echo Next steps:
echo 1. Check deployment status: https://railway.app/dashboard
echo 2. View logs in the Railway dashboard
echo 3. Set up custom domain if needed

pause
