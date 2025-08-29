@echo off
echo Starting Vite Development Server...

echo Checking if port 5173 is available...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo Port 5173 is in use, killing process...
    for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
)

echo Starting Vite on port 5173...
start "Vite Dev Server" cmd /k "npm run dev"

echo Waiting for Vite to start...
timeout /t 5 /nobreak >nul

echo Testing Vite server...
curl http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Vite server is running on http://localhost:5173
) else (
    echo ❌ Vite server failed to start
)

pause