@echo off
echo === Environment Check ===
echo.
echo [System Info]
systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type"
echo.
echo [Node.js]
where node 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not in PATH
) else (
  node --version 2>nul
  if %ERRORLEVEL% NEQ 0 (
    echo Node.js found but not working
  )
)
echo.
echo [Python]
where python 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Python is not in PATH
) else (
  python --version 2>nul
  if %ERRORLEVEL% NEQ 0 (
    echo Python found but not working
  )
)
echo.
echo [Environment Variables]
echo NODE_ENV=%NODE_ENV%
echo PATH=%PATH%
echo.
pause
