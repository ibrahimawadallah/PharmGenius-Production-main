@echo off
echo === Checking Git Configuration and Pushing to GitHub ===
echo.

echo [1/6] Checking Git version...
git --version
echo.

echo [2/6] Checking Git configuration...
git config --list
echo.

echo [3/6] Checking remote repository...
git remote -v
echo.

echo [4/6] Checking branch information...
git branch -a
echo.

echo [5/6] Attempting to push to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo [6/6] Force pushing to GitHub...
    git push -f origin main
) else (
    echo.
    echo [6/6] Push successful!
)

echo.
echo === Script completed ===
pause
