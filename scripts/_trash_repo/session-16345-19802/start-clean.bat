@echo off
echo Starting PharmGenius with clean ports...

echo Step 1: Killing any processes on ports 3001 and 3002...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    echo Killing process %%a on port 3001
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| find ":3002" ^| find "LISTENING"') do (
    echo Killing process %%a on port 3002
    taskkill /f /pid %%a >nul 2>&1
)

echo Step 2: Starting the server...
npm start

pause