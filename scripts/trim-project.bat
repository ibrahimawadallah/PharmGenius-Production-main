@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Resolve repo root
set "SCRIPT_DIR=%~dp0"
for %%A in ("%SCRIPT_DIR%\..") do set "REPO_ROOT=%%~fA"

REM Trash destination
set "TRASH_DIR=%SCRIPT_DIR%_trash_repo"
if not exist "%TRASH_DIR%" mkdir "%TRASH_DIR%"

REM Args
set "APPLY=0"
set "MODE=normal"
if /I "%~1"=="apply" set "APPLY=1"
if /I "%~1"=="aggressive" set "MODE=aggressive"
if /I "%~2"=="apply" set "APPLY=1"

echo ======================================================
echo Project Trimmer
echo - Repo root: %REPO_ROOT%
echo - Mode: %MODE%  (normal/aggressive)
echo - Apply: %APPLY% (0=dry-run, 1=apply)
echo - Trash: %TRASH_DIR%
echo ======================================================
echo.

REM Lists to trim (relative paths from repo root)

REM Normal mode: strongly safe removals
set "DIRS_NORMAL=docs snowstorm snowstorm_organized snowstorm-master"
set "FILES_NORMAL=snowstorm.jar start-snomed.bat start-snomed-simple.bat test-snomed.js SNOMED_SETUP.md"

REM Aggressive mode: include additional helpers you may not need
set "DIRS_AGGR=%DIRS_NORMAL% scripts\batch .github .copilot .cursor .superdesign pharmacy-tools scripts\data-processing scripts\migration data\csv data\json database api"
set "FILES_AGGR=%FILES_NORMAL% deploy.bat deploy-railway.bat deploy-to-railway.bat deploy.ps1 quick-deploy.bat railway.json config\railway.json Procfile .railwayignore RAILWAY_DEPLOY.md DEPLOYMENT_README.md SERVICES_README.md MONGODB_SETUP.md PORT_MAPPING.md PRODUCTION_REPORT.md FINAL_CHECKLIST.md STRUCTURE_ENHANCEMENT_PLAN.md STRUCTURE_ENHANCEMENT_SUMMARY.md TROUBLESHOOTING.md ATLAS_MIGRATION.md PRODUCTION_READINESS_CHECKLIST.md .dockerignore vercel.json config\render.yaml config\Dockerfile .env.example env.example config\.env.example check-env.bat check-node.bat check-node-install.bat fix-ports.bat kill-ports.bat start-dev.bat start-vite.bat start-clean.bat install-java.bat setup-java-path.bat run-with-output.bat scripts\cleanup-bat-files.bat pharmacy_tools_hub_api_bridge_next_js_shadcn_ui.jsx migrate-sqlite-safe.js migrate-sqlite-to-atlas.js migrate-to-atlas.js processICD10FastCJS.cjs scripts\pharmacy-tools-init.ps1 seed.js"
REM Also remove alternative server variants and CSV dumps (use wildcard for spaces)
set "FILES_AGGR=%FILES_AGGR% server\server-railway.js server\server-simple.js server\server-fallback.js server\startup-check.js server\*.csv"

if /I "%MODE%"=="aggressive" (
  set "DIRS=%DIRS_AGGR%"
  set "FILES=%FILES_AGGR%"
) else (
  set "DIRS=%DIRS_NORMAL%"
  set "FILES=%FILES_NORMAL%"
)

set "COUNT_DIRS=0"
set "COUNT_FILES=0"

if "%APPLY%"=="1" (
  set "SESSION=session-%RANDOM%-%RANDOM%"
  set "SESSION_DIR=%TRASH_DIR%\!SESSION!"
  if not exist "!SESSION_DIR!" mkdir "!SESSION_DIR!"
  echo Moving items into: "!SESSION_DIR!"
  echo.
)

REM Process directories
for %%D in (%DIRS%) do (
  set "SRC=%REPO_ROOT%\%%D"
  if exist "!SRC!\" (
    if "%APPLY%"=="1" (
      echo Moving DIR: "!SRC!"
      move /Y "!SRC!" "!SESSION_DIR!\">nul
    ) else (
      echo Candidate DIR: "!SRC!"
    )
    set /a COUNT_DIRS+=1
  )
)

REM Process files
for %%F in (%FILES%) do (
  set "SRC=%REPO_ROOT%\%%F"
  if exist "!SRC!" (
    if "%APPLY%"=="1" (
      echo Moving FILE: "!SRC!"
      move /Y "!SRC!" "!SESSION_DIR!\">nul
    ) else (
      echo Candidate FILE: "!SRC!"
    )
    set /a COUNT_FILES+=1
  )
)

echo.
if "%APPLY%"=="1" (
  echo Done. Dirs moved: !COUNT_DIRS!  Files moved: !COUNT_FILES!
  echo Items are in: !SESSION_DIR!
) else (
  echo Dry-run complete. Dirs: !COUNT_DIRS!  Files: !COUNT_FILES!
  echo To apply normal mode:
  echo   scripts\trim-project.bat apply
  echo To apply aggressive mode:
  echo   scripts\trim-project.bat aggressive apply
)

endlocal