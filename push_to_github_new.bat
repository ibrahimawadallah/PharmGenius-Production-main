@echo off
echo === Pushing to GitHub ===
echo.

echo [1/6] Initializing Git repository...
rmdir /s /q .git
call git init

echo [2/6] Adding all files...
call git add .

echo [3/6] Making initial commit...
call git commit -m "Initial commit with all project files"

echo [4/6] Setting up remote repository...
call git remote add origin https://github.com/ibrahimawadallah/PharmGenius-Production-main.git

echo [5/6] Renaming branch to main...
call git branch -M main

echo [6/6] Pushing to GitHub...
call git push -f -u origin main

echo.
echo === Push completed ===
pause
