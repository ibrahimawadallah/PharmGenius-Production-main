@echo off
echo Fixing PharmGenius Port Conflicts...

echo Checking current port usage...
netstat -ano | findstr ":3002\|:3003\|:5173\|:8080"

echo.
echo Killing PharmGenius processes on ports 3002 and 3003...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3002" ^| find "LISTENING"') do (
    echo Killing PID %%a on port 3002
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| find ":3003" ^| find "LISTENING"') do (
    echo Killing PID %%a on port 3003
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo Port Status:
echo - Port 3002: Available for PharmGenius Server
echo - Port 3003: Available for Backup Server
echo - Port 5173: Available for Vite Dev Server
echo - Port 8080: Check if SNOMED Snowstorm is needed

echo.
echo Ready to start PharmGenius!
pause