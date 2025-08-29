@echo off
setlocal

REM Configure these if needed:
set PROJECT_NAME=ai-medical-career-platform
REM set SCOPE=your-vercel-username-or-team

where vercel >nul 2>nul
if errorlevel 1 (
  echo [Error] Vercel CLI not found. Install with: npm i -g vercel
  exit /b 1
)

echo.
echo [1/2] Linking this folder to your Vercel project...
if defined SCOPE (
  vercel link --yes --project %PROJECT_NAME% --scope %SCOPE%
) else (
  vercel link --yes --project %PROJECT_NAME%
)
if errorlevel 1 (
  echo [Info] Falling back to interactive linking...
  vercel link
  if errorlevel 1 (
    echo [Error] Failed to link project.
    exit /b 1
  )
)

echo.
echo [2/2] Deploying to production...
vercel --prod --yes
if errorlevel 1 (
  echo [Error] Deployment failed.
  exit /b 1
)

echo.
echo [Done] Deployed. Open your app:
echo https://ai-medical-career-platform-c19jldqu8-ibrahims-projects-d7ee9352.vercel.app
endlocal
echo ===== Quick Deployment =====
echo.

:: Add all changes
echo 1. Adding changes to git...
git add .

:: Commit with timestamp
set timestamp=%date% %time%
git commit -m "Deploy: %timestamp%"

:: Push to main branch
echo.
echo 2. Pushing to main branch...
git push origin main

:: Deploy to Railway
echo.
echo 3. Deploying to Railway...
railway up

echo.
echo ===== Deployment Complete =====
echo Check your Railway dashboard for status: https://railway.app/dashboard
pause
