# PharmGenius Production Deployment Script
# For Hospital Deployment

[CmdletBinding()]
param (
    # Switch to run in non-interactive mode (e.g., for CI/CD pipelines)
    [Switch]$NonInteractive
)

# A helper function to run each step with standardized logging and error handling.
function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [scriptblock]$ScriptBlock
    )
    Write-Host "➡️  $Name" -ForegroundColor Yellow
    try {
        & $ScriptBlock
        Write-Host "✅  $Name completed successfully." -ForegroundColor Green
    }
    catch {
        Write-Host "❌  $Name failed." -ForegroundColor Red
        # Write the specific error message that caused the failure.
        Write-Error $_.Exception.Message
        # Exit the script immediately on failure.
        exit 1
    }
}

# Stop the script on the first error. This makes error handling much more reliable.
$ErrorActionPreference = 'Stop'

Write-Host "🏥 PharmGenius Production Deployment Script" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check Node.js version
Invoke-Step -Name "Checking Node.js version (18+ required)" -ScriptBlock {
    $nodeVersionOutput = node --version
    Write-Host "   Found Node.js version: $nodeVersionOutput"
    $majorVersion = ($nodeVersionOutput -replace 'v', '').Split('.')[0]
    if ([int]$majorVersion -lt 18) {
        throw "Node.js version 18 or higher is required. Please upgrade."
    }
}

# Check npm
Invoke-Step -Name "Checking npm version" -ScriptBlock {
    $npmVersion = npm --version
    Write-Host "   Found npm version: $npmVersion"
}

# Install dependencies
Invoke-Step -Name "Installing dependencies" -ScriptBlock {
    npm install
}

# Build application
Invoke-Step -Name "Building application" -ScriptBlock {
    npm run build
}

# Check MongoDB connection
Write-Host "➡️  Checking database connection..." -ForegroundColor Yellow
try {
    # We allow this to fail without exiting the script
    npm run check:mongo --silent
    Write-Host "✅  MongoDB connection successful" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  MongoDB connection failed. The application will run in file-only mode." -ForegroundColor Yellow
}

# Run health check
Invoke-Step -Name "Running application health check" -ScriptBlock {
    npm run validate
}

Write-Host "🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure MongoDB connection in .env file is correct (if needed)." -ForegroundColor White
Write-Host "2. Run: npm start" -ForegroundColor White
Write-Host "3. Access: http://localhost:3000" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Green

# Offer to start the server
if (-not $NonInteractive) {
    Write-Host "🚀 Starting deployment..." -ForegroundColor Green
    npm start
}
else {
    Write-Host "🚀 Non-interactive mode: Starting server..." -ForegroundColor Cyan
    npm start
}