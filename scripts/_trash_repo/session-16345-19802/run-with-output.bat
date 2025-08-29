@echo off
echo Running Node.js test...
node node-test.js > output.txt 2>&1
type output.txt
del output.txt
pause
