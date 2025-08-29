@echo off
echo Setting up Java PATH...

echo Searching for Java installation...
for /d %%i in ("C:\Program Files\Java\*") do (
    if exist "%%i\bin\java.exe" (
        echo Found Java at: %%i
        set "JAVA_HOME=%%i"
        set "PATH=%PATH%;%%i\bin"
        goto :found
    )
)

for /d %%i in ("C:\Program Files\Eclipse Adoptium\*") do (
    if exist "%%i\bin\java.exe" (
        echo Found Java at: %%i
        set "JAVA_HOME=%%i"
        set "PATH=%PATH%;%%i\bin"
        goto :found
    )
)

echo Java not found. Please install Java and restart command prompt.
pause
exit /b 1

:found
echo Java setup complete!
echo JAVA_HOME=%JAVA_HOME%
java -version
pause