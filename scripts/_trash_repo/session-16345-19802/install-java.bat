@echo off
echo Installing Java using winget...

echo Checking if winget is available...
winget --version >nul 2>&1
if %errorlevel% neq 0 (
    echo winget not available. Please install Java manually from:
    echo https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

echo Installing OpenJDK 17...
winget install Microsoft.OpenJDK.17

echo Installation complete. Restarting command prompt...
echo Please run: setup-java-path.bat
pause