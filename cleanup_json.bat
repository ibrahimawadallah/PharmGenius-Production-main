@echo off
echo Removing unnecessary JSON configuration files...
echo.

:: Remove Vercel configuration files
del /q "vercel.json" 2>nul
del /q "vercel-minimal.json" 2>nul

echo.
echo Cleanup complete! The following essential files were kept:
echo - package.json
echo - package-lock.json
echo - components.json
echo.
echo Note: Node modules and data JSON files were not removed.
pause
