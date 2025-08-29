@echo off
echo === Starting GitHub Push Script ===
echo.

echo [1/8] Checking Git installation...
git --version
echo.

echo [2/8] Initializing Git repository...
rmdir /s /q .git
git init
echo.

echo [3/8] Adding all files to staging...
git add .
echo.

echo [4/8] Committing changes...
git commit -m "Initial commit with all project files"
echo.

echo [5/8] Setting up remote repository...
git remote add origin https://github.com/ibrahimawadallah/PharmGenius-Production-main.git
echo.

echo [6/8] Renaming branch to main...
git branch -M main
echo.

echo [7/8] Pulling remote changes...
git pull origin main --allow-unrelated-histories --rebase
echo.

echo [8/8] Pushing to GitHub...
git push -u origin main
echo.

echo === Script completed ===
pause
