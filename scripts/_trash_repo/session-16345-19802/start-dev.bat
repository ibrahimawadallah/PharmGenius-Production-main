@echo off
echo Starting PharmGenius Development Environment...

echo Step 1: Fixing ports...
call fix-ports.bat

echo Step 2: Starting Vite Dev Server on port 5173...
start "Vite Dev Server" cmd /k "npm run dev"

echo Step 3: Waiting 3 seconds for Vite to start...
timeout /t 3 /nobreak >nul

echo Step 4: Starting PharmGenius Server on port 3002...
start "PharmGenius Server" cmd /k "npm start"

echo.
echo Development servers starting:
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:3002
echo - Health:   http://localhost:3002/api/health

pause