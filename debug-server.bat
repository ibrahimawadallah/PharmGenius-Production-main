@echo off
echo Starting server with debug output...
node server/server.js > debug-output.txt 2>&1
echo Server process exited with code %ERRORLEVEL%
echo.
type debug-output.txt
del debug-output.txt
