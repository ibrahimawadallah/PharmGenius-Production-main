@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Repo root resolved relative to this script
set "SCRIPT_DIR=%~dp0"
set "REPO_ROOT=%SCRIPT_DIR%\.."
for %%A in ("%REPO_ROOT%") do set "REPO_ROOT=%%~fA"

set "TRASH_DIR=%SCRIPT_DIR%_trash_bat"
if not exist "%TRASH_DIR%" mkdir "%TRASH_DIR%"

set "APPLY=0"
if /I "%~1"=="apply" set "APPLY=1"

REM Excluded directories (case-insensitive substrings)
set "EXCL1=\scripts\_trash_bat\"
set "EXCL2=\scripts\batch\"
set "EXCL3=\snowstorm\"
set "EXCL4=\snowstorm_organized\"
set "EXCL5=\snowstorm-master\"
set "EXCL6=\node_modules\"

REM Keep-list of important .bat files by name
set "KEEP_LIST=start-dev.bat start-vite.bat start-snomed.bat start-snomed-simple.bat start-clean.bat fix-ports.bat kill-ports.bat quick-deploy.bat deploy.bat deploy-railway.bat deploy-to-railway.bat setup-java-path.bat install-java.bat check-env.bat check-node-install.bat check-node.bat run-with-output.bat"

echo ======================================================
echo .BAT Cleaner
echo - Repo root: %REPO_ROOT%
echo - Mode: %APPLY% (0=dry-run, 1=apply)
echo - Trash: %TRASH_DIR%
echo ======================================================
echo.

set "CANDIDATES=0"

REM Create unique session folder if applying
if "%APPLY%"=="1" (
  set "SESSION=session-%RANDOM%-%RANDOM%"
  set "SESSION_DIR=%TRASH_DIR%\!SESSION!"
  if not exist "!SESSION_DIR!" mkdir "!SESSION_DIR!"
  echo Moving files into: "!SESSION_DIR!"
  echo.
)

for /r "%REPO_ROOT%" %%F in (*.bat) do (
  set "FULL=%%~fF"
  set "DIR=%%~dpF"
  set "NAME=%%~nxF"
  set "SKIP=0"

  REM Exclude directories (use substring test; avoids pipe/echo issues)
  if not "!DIR:%EXCL1%=!"=="!DIR!" set "SKIP=1"
  if not "!DIR:%EXCL2%=!"=="!DIR!" set "SKIP=1"
  if not "!DIR:%EXCL3%=!"=="!DIR!" set "SKIP=1"
  if not "!DIR:%EXCL4%=!"=="!DIR!" set "SKIP=1"
  if not "!DIR:%EXCL5%=!"=="!DIR!" set "SKIP=1"
  if not "!DIR:%EXCL6%=!"=="!DIR!" set "SKIP=1"

  REM Exclude this running script itself
  if /I "!FULL!"=="%~f0" set "SKIP=1"

  REM Keep important names
  set "KEEP=0"
  for %%K in (%KEEP_LIST%) do (
    if /I "%%K"=="!NAME!" set "KEEP=1"
  )
  if "!KEEP!"=="1" set "SKIP=1"

  if "!SKIP!"=="0" (
    set /a CANDIDATES+=1
    if "!APPLY!"=="1" (
      echo Moving: !FULL!
      move /Y "!FULL!" "!SESSION_DIR!\!NAME!" >nul
    ) else (
      echo Candidate: !FULL!
    )
  )
)

echo.
if "%APPLY%"=="1" (
  echo Done. Total moved: !CANDIDATES!
  echo Files are in: !SESSION_DIR!
) else (
  echo Dry-run complete. Candidates found: !CANDIDATES!
  echo To apply, run:
  echo   scripts\cleanup-bat-files.bat apply
)

endlocal