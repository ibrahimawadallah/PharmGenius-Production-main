@echo off
setlocal enabledelayedexpansion

echo ======================================================
echo PharmGenius Cleanup Utility (safe by default)
echo - Default: remove build artifacts and caches only
echo - Deep: also remove ALL node_modules folders
echo Usage: cleanup.bat [deep]
echo ======================================================
echo.

REM Detect if deep cleanup is requested
set DEEP=0
if /I "%~1"=="deep" set DEEP=1

REM List of common build/cache directories to remove at repo root
set ROOT_DIRS=dist build .next out .vite .turbo .cache .parcel-cache coverage

echo [1/5] Cleaning root-level build/cache directories...
for %%D in (%ROOT_DIRS%) do (
  if exist "%%D" (
    echo   - Removing "%%D"
    rmdir /s /q "%%D"
  )
)

echo [2/5] Cleaning build/cache folders recursively across subfolders...
for /r %%F in (.) do (
  if exist "%%F\.vite" rmdir /s /q "%%F\.vite"
  if exist "%%F\.turbo" rmdir /s /q "%%F\.turbo"
  if exist "%%F\.cache" rmdir /s /q "%%F\.cache"
  if exist "%%F\.parcel-cache" rmdir /s /q "%%F\.parcel-cache"
  if exist "%%F\coverage" rmdir /s /q "%%F\coverage"
  if exist "%%F\dist" rmdir /s /q "%%F\dist"
  if exist "%%F\build" rmdir /s /q "%%F\build"
  if exist "%%F\out" rmdir /s /q "%%F\out"
  if exist "%%F\.next" rmdir /s /q "%%F\.next"
)

echo [3/5] Cleaning Java/Maven target directories (e.g., snowstorm modules)...
for /d /r %%T in (target) do (
  if exist "%%T" (
    echo   - Removing "%%T"
    rmdir /s /q "%%T"
  )
)

echo [4/5] Removing common log and OS junk files...
forfiles /S /M "*.log" /C "cmd /c echo   - Deleting @path & del /f /q @path" >nul 2>&1
forfiles /S /M "npm-debug.log*" /C "cmd /c echo   - Deleting @path & del /f /q @path" >nul 2>&1
forfiles /S /M "yarn-error.log*" /C "cmd /c echo   - Deleting @path & del /f /q @path" >nul 2>&1
forfiles /S /M "pnpm-debug.log*" /C "cmd /c echo   - Deleting @path & del /f /q @path" >nul 2>&1
forfiles /S /M ".DS_Store" /C "cmd /c echo   - Deleting @path & del /f /q @path" >nul 2>&1
forfiles /S /M "Thumbs.db" /C "cmd /c echo   - Deleting @path & del /f /q @path" >nul 2>&1
forfiles /S /M ".eslintcache" /C "cmd /c echo   - Deleting @path & del /f /q @path" >nul 2>&1

if "%DEEP%"=="1" (
  echo [5/5] Deep clean enabled: removing ALL node_modules folders...
  for /d /r %%N in (node_modules) do (
    if exist "%%N" (
      echo   - Removing "%%N"
      rmdir /s /q "%%N"
    )
  )
) else (
  echo [5/5] Skipping deep clean. To remove node_modules as well, run:
  echo        scripts\cleanup.bat deep
)

echo.
echo Cleanup complete.
endlocal