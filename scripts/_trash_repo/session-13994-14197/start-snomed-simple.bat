@echo off
set "PATH=%PATH%;C:\Program Files\Microsoft\jdk-17.0.16.8-hotspot\bin"

echo Starting SNOMED Snowstorm on port 8080...
java -Xms1g -Xmx2g -jar snowstorm.jar --server.port=8080

pause