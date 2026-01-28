#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Verify Git configuration for BunnyCart E2E Automation project.

.DESCRIPTION
    This script verifies that Git is properly configured with the correct
    username, email, and remote repository settings.
#>

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Git Configuration Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Git installation
Write-Host "Checking Git installation..." -ForegroundColor Yellow
$gitVersion = git --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Git installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Git is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if in a Git repository
Write-Host "`nChecking Git repository..." -ForegroundColor Yellow
$gitDir = git rev-parse --git-dir 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Git repository detected" -ForegroundColor Green
} else {
    Write-Host "✗ Not a Git repository" -ForegroundColor Red
    exit 1
}

# Check Git username
Write-Host "`nChecking Git username..." -ForegroundColor Yellow
$username = git config user.name
if ($username) {
    Write-Host "✓ Username: $username" -ForegroundColor Green
    if ($username -ne "Mukuldev21") {
        Write-Host "  ⚠ Expected: Mukuldev21" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Username not configured" -ForegroundColor Red
    Write-Host "  Run: git config user.name 'Mukuldev21'" -ForegroundColor Yellow
}

# Check Git email
Write-Host "`nChecking Git email..." -ForegroundColor Yellow
$email = git config user.email
if ($email) {
    Write-Host "✓ Email: $email" -ForegroundColor Green
    if ($email -ne "mukul.com12@gmail.com") {
        Write-Host "  ⚠ Expected: mukul.com12@gmail.com" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Email not configured" -ForegroundColor Red
    Write-Host "  Run: git config user.email 'mukul.com12@gmail.com'" -ForegroundColor Yellow
}

# Check remote repository
Write-Host "`nChecking remote repository..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null
if ($remote) {
    Write-Host "✓ Remote URL: $remote" -ForegroundColor Green
    if ($remote -ne "https://github.com/Mukuldev21/BunnyCart-E2E-Automation.git") {
        Write-Host "  ⚠ Expected: https://github.com/Mukuldev21/BunnyCart-E2E-Automation.git" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Remote repository not configured" -ForegroundColor Red
    Write-Host "  Run: git remote add origin https://github.com/Mukuldev21/BunnyCart-E2E-Automation.git" -ForegroundColor Yellow
}

# Check current branch
Write-Host "`nChecking current branch..." -ForegroundColor Yellow
$branch = git rev-parse --abbrev-ref HEAD 2>$null
if ($branch) {
    Write-Host "✓ Current branch: $branch" -ForegroundColor Green
} else {
    Write-Host "✗ Could not determine current branch" -ForegroundColor Red
}

# Check for uncommitted changes
Write-Host "`nChecking for uncommitted changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✓ Working directory clean" -ForegroundColor Green
} else {
    Write-Host "⚠ Uncommitted changes detected:" -ForegroundColor Yellow
    git status --short
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($username -eq "Mukuldev21" -and $email -eq "mukul.com12@gmail.com" -and $remote -eq "https://github.com/Mukuldev21/BunnyCart-E2E-Automation.git") {
    Write-Host "✓ All configurations are correct!" -ForegroundColor Green
    Write-Host "`nYou can now use the push-to-github.ps1 script:" -ForegroundColor Cyan
    Write-Host "  .\push-to-github.ps1" -ForegroundColor White
} else {
    Write-Host "⚠ Some configurations need attention" -ForegroundColor Yellow
    Write-Host "`nPlease review the warnings above and fix any issues." -ForegroundColor Yellow
}

Write-Host ""
