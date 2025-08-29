@echo off
echo === Starting GitHub Push Script ===
echo.

echo [1/7] Checking Git installation...
git --version
echo.

echo [2/7] Initializing Git repository...
git init
echo.

echo [3/7] Adding all files to staging...
git add .
echo.

echo [4/7] Committing changes...
git commit -m "Initial commit with all project files"
echo.

echo [5/7] Setting up remote repository...
git remote add origin https://github.com/ibrahimawadallah/PharmGenius-Production-main.git
echo.

echo [6/7] Renaming branch to main...
git branch -M main
echo.

echo [7/7] Pushing to GitHub...
git push -u origin main
echo.

echo === Script completed ===
pause
