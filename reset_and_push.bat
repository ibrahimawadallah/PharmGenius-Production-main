@echo off
echo === Resetting and Pushing to GitHub ===
echo.

echo [1/5] Fetching latest changes from remote...
git fetch origin
echo.

echo [2/5] Resetting to remote main branch...
git reset --hard origin/main
echo.

echo [3/5] Pulling latest changes...
git pull origin main
echo.

echo [4/5] Adding all local changes...
git add .
echo.

echo [5/5] Committing and force pushing...
git commit -m "Update project files"
git push -f origin main
echo.

echo === Script completed ===
pause
