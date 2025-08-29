@echo off
echo === Final Push to GitHub ===
echo.

echo [1/6] Checking current branch...
git branch --show-current
echo.

echo [2/6] Adding all changes...
git add .
echo.

echo [3/6] Committing changes...
git commit -m "Update project files"
echo.

echo [4/6] Pulling latest changes...
git pull origin main --rebase
echo.

echo [5/6] Pushing to GitHub...
git push -u origin main
echo.

if %errorlevel% equ 0 (
    echo [6/6] Push successful! Check your repository at:
    echo https://github.com/ibrahimawadallah/PharmGenius-Production-main
) else (
    echo [6/6] Push failed. Please check the error messages above.
)

echo.
echo === Script completed ===
pause
