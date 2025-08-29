@echo off
echo Testing Node.js installation...
node -v > test-node-output.txt 2>&1
type test-node-output.txt
del test-node-output.txt
