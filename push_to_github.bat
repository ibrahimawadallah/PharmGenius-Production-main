@echo off

echo Initializing Git repository...
git init

echo Adding all files to staging...
git add .

echo Committing changes...
git commit -m "Initial commit with project files"

echo Adding remote repository...
git remote add origin https://github.com/ibrahimawadallah/PharmGenius-Production-main.git

echo Renaming branch to main...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo Done!
pause
