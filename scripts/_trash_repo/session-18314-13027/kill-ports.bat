@echo off
echo Killing processes on ports 3001 and 3002...

for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    echo Killing process %%a on port 3001
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| find ":3002" ^| find "LISTENING"') do (
    echo Killing process %%a on port 3002
    taskkill /f /pid %%a >nul 2>&1
)

:: Also kill processes on common Vite ports
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    echo Killing process %%a on port 5173
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5174" ^| find "LISTENING"') do (
    echo Killing process %%a on port 5174
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5175" ^| find "LISTENING"') do (
    echo Killing process %%a on port 5175
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5176" ^| find "LISTENING"') do (
    echo Killing process %%a on port 5176
    taskkill /f /pid %%a >nul 2>&1
)

echo Done!
pause