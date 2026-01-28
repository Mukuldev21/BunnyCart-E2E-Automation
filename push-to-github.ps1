#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Atomic Git commit and push automation for BunnyCart E2E project.

.DESCRIPTION
    Automatically analyzes code changes, creates ATOMIC commits (one logical unit per commit)
    following conventional commit standards, and pushes to GitHub.

.EXAMPLE
    .\push-to-github.ps1
#>

# ============================================
# HELPER FUNCTIONS
# ============================================

function Write-ColorMessage {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    switch ($Type) {
        "Success" { Write-Host "✓ $Message" -ForegroundColor Green }
        "Info"    { Write-Host "ℹ $Message" -ForegroundColor Cyan }
        "Warning" { Write-Host "⚠ $Message" -ForegroundColor Yellow }
        "Error"   { Write-Host "✗ $Message" -ForegroundColor Red }
        "Header"  { 
            Write-Host "`n========================================" -ForegroundColor Magenta
            Write-Host "  $Message" -ForegroundColor Magenta
            Write-Host "========================================`n" -ForegroundColor Magenta
        }
    }
}

# ============================================
# GIT VALIDATION
# ============================================

function Test-GitRepository {
    $gitDir = git rev-parse --git-dir 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-ColorMessage "Not a git repository!" "Error"
        exit 1
    }
    Write-ColorMessage "Git repository detected" "Success"
}

function Test-RepositoryConfiguration {
    Write-ColorMessage "Verifying repository configuration..." "Info"
    
    $expectedRepo = "https://github.com/Mukuldev21/BunnyCart-E2E-Automation.git"
    $currentRepo = git remote get-url origin 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorMessage "No remote repository configured!" "Error"
        exit 1
    }
    
    if ($currentRepo -ne $expectedRepo) {
        Write-ColorMessage "Repository mismatch!" "Warning"
        Write-Host "  Current:  $currentRepo" -ForegroundColor Yellow
        Write-Host "  Expected: $expectedRepo" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Continue anyway? (y/N): " -ForegroundColor Yellow -NoNewline
        $confirm = Read-Host
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-ColorMessage "Push cancelled" "Warning"
            exit 0
        }
    }
    else {
        Write-ColorMessage "Repository verified: $currentRepo" "Success"
    }
    
    $branch = git rev-parse --abbrev-ref HEAD
    Write-ColorMessage "Current branch: $branch" "Info"
    
    git fetch origin --quiet 2>$null
    $remoteBranch = git rev-parse --verify "origin/$branch" 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorMessage "Branch exists on remote" "Success"
    }
    else {
        Write-ColorMessage "New branch - will be created on remote" "Warning"
    }
    
    return $branch
}

function Invoke-DryRun {
    param([string]$Branch)
    
    Write-ColorMessage "Performing dry-run check..." "Info"
    git push --dry-run origin $Branch 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorMessage "Dry-run successful - ready to push" "Success"
        return $true
    }
    else {
        Write-ColorMessage "Dry-run failed - check credentials/network" "Error"
        return $false
    }
}

# ============================================
# FILE ANALYSIS & GROUPING
# ============================================

function Get-ChangedFiles {
    $status = git status --porcelain
    
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-ColorMessage "No changes detected. Nothing to commit." "Warning"
        exit 0
    }
    
    $files = @()
    foreach ($line in $status -split "`n") {
        if ($line.Trim()) {
            $filePath = $line.Substring(3).Trim()
            $files += $filePath
        }
    }
    
    return $files
}

function Get-AtomicCommitGroups {
    param([array]$Files)
    
    Write-ColorMessage "Grouping files into atomic commits..." "Info"
    
    $commitGroups = @()
    
    foreach ($file in $Files) {
        $group = @{
            Files = @($file)
            Type = ""
            Scope = ""
            Message = ""
        }
        
        # Categorize and generate commit message for each file
        if ($file -match '\.spec\.ts$') {
            # Test file
            $group.Type = "test"
            
            # Extract scope from path
            if ($file -match '/auth/') { $group.Scope = "auth" }
            elseif ($file -match '/cart/') { $group.Scope = "cart" }
            elseif ($file -match '/browse/') { $group.Scope = "browse" }
            elseif ($file -match '/pdp/') { $group.Scope = "pdp" }
            elseif ($file -match '/checkout/') { $group.Scope = "checkout" }
            else { $group.Scope = "tests" }
            
            # Extract TC numbers
            $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
            if ($content -match 'TC\d+') {
                $tcNumbers = @()
                $matches = [regex]::Matches($content, 'TC(\d+)')
                foreach ($match in $matches) {
                    $tcNumbers += $match.Groups[1].Value
                }
                $uniqueTCs = $tcNumbers | Select-Object -Unique | Sort-Object
                
                if ($uniqueTCs.Count -eq 1) {
                    $group.Message = "add TC$($uniqueTCs[0]) test case"
                }
                else {
                    $tcList = ($uniqueTCs | ForEach-Object { "TC$_" }) -join ", "
                    $group.Message = "add test cases: $tcList"
                }
            }
            else {
                $fileName = Split-Path $file -Leaf
                $group.Message = "update $fileName"
            }
        }
        elseif ($file -match 'Page\.ts$') {
            # Page object
            $group.Type = "feat"
            $group.Scope = "pages"
            $fileName = Split-Path $file -LeafBase
            $group.Message = "add $fileName page object"
        }
        elseif ($file -match 'Component\.ts$|/components/') {
            # Component
            $group.Type = "feat"
            $group.Scope = "components"
            $fileName = Split-Path $file -LeafBase
            $group.Message = "add $fileName component"
        }
        elseif ($file -match '/fixtures/') {
            # Fixture
            $group.Type = "feat"
            $group.Scope = "fixtures"
            $fileName = Split-Path $file -Leaf
            $group.Message = "update $fileName"
        }
        elseif ($file -match 'playwright\.config|package\.json|tsconfig') {
            # Config
            $group.Type = "chore"
            $group.Scope = "config"
            $fileName = Split-Path $file -Leaf
            $group.Message = "update $fileName"
        }
        elseif ($file -match '\.env$') {
            # Environment
            $group.Type = "chore"
            $group.Scope = "config"
            $group.Message = "update environment variables"
        }
        elseif ($file -match '\.md$') {
            # Documentation
            $group.Type = "docs"
            $fileName = Split-Path $file -Leaf
            $group.Message = "update $fileName"
        }
        elseif ($file -match '\.ps1$|\.sh$') {
            # Scripts
            $group.Type = "chore"
            $group.Scope = "scripts"
            $fileName = Split-Path $file -Leaf
            $group.Message = "update $fileName"
        }
        else {
            # Other
            $group.Type = "chore"
            $fileName = Split-Path $file -Leaf
            $group.Message = "update $fileName"
        }
        
        $commitGroups += $group
    }
    
    return $commitGroups
}

function Get-CommitMessage {
    param($Group)
    
    if ($Group.Scope) {
        return "$($Group.Type)($($Group.Scope)): $($Group.Message)"
    }
    else {
        return "$($Group.Type): $($Group.Message)"
    }
}

# ============================================
# GIT OPERATIONS
# ============================================

function Invoke-AtomicCommit {
    param(
        [string]$FilePath,
        [string]$Message
    )
    
    Write-Host "  → Staging: $FilePath" -ForegroundColor Gray
    git add $FilePath
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorMessage "Failed to stage $FilePath" "Error"
        return $false
    }
    
    Write-Host "  → Committing: $Message" -ForegroundColor Gray
    git commit -m "$Message" --quiet
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorMessage "Failed to create commit" "Error"
        return $false
    }
    
    Write-ColorMessage "Committed: $Message" "Success"
    return $true
}

function Invoke-GitPush {
    param([string]$Branch)
    
    Write-ColorMessage "Pushing all commits to GitHub (branch: $Branch)..." "Info"
    git push origin $Branch
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorMessage "Failed to push to remote" "Error"
        Write-ColorMessage "Try: git pull origin $Branch" "Warning"
        exit 1
    }
    
    Write-ColorMessage "Successfully pushed to GitHub!" "Success"
}

# ============================================
# MAIN EXECUTION
# ============================================

Write-ColorMessage "BunnyCart E2E - Atomic Git Push" "Header"

# Step 1: Validate Git repository
Test-GitRepository

# Step 2: Verify repository configuration
$currentBranch = Test-RepositoryConfiguration

# Step 3: Get changed files
$changedFiles = Get-ChangedFiles

# Step 4: Show all changes
Write-ColorMessage "Files detected:" "Info"
git status --short
Write-Host ""

# Step 5: Group files into atomic commits
$commitGroups = Get-AtomicCommitGroups -Files $changedFiles

# Step 6: Show commit plan
Write-ColorMessage "Atomic Commit Plan ($($commitGroups.Count) commits):" "Header"
$commitNumber = 1
foreach ($group in $commitGroups) {
    $msg = Get-CommitMessage -Group $group
    Write-Host "  $commitNumber. " -NoNewline -ForegroundColor Yellow
    Write-Host "$msg" -ForegroundColor White
    foreach ($file in $group.Files) {
        Write-Host "     - $file" -ForegroundColor Gray
    }
    $commitNumber++
}
Write-Host ""

# Step 7: Perform dry-run check
$dryRunSuccess = Invoke-DryRun -Branch $currentBranch

if (-not $dryRunSuccess) {
    Write-ColorMessage "Dry-run failed. Please check your setup." "Error"
    exit 1
}

Write-Host ""

# Step 8: Create atomic commits
Write-ColorMessage "Creating Atomic Commits" "Header"
$successCount = 0

foreach ($group in $commitGroups) {
    $msg = Get-CommitMessage -Group $group
    
    foreach ($file in $group.Files) {
        $success = Invoke-AtomicCommit -FilePath $file -Message $msg
        if ($success) {
            $successCount++
        }
        else {
            Write-ColorMessage "Stopping due to commit failure" "Error"
            exit 1
        }
    }
}

Write-Host ""
Write-ColorMessage "Created $successCount atomic commit(s)" "Success"
Write-Host ""

# Step 9: Push all commits
Invoke-GitPush -Branch $currentBranch

# Step 10: Summary
Write-ColorMessage "Summary" "Header"
Write-Host "Repository: " -NoNewline -ForegroundColor Cyan
Write-Host "https://github.com/Mukuldev21/BunnyCart-E2E-Automation.git" -ForegroundColor White
Write-Host "Branch: " -NoNewline -ForegroundColor Cyan
Write-Host "$currentBranch" -ForegroundColor White
Write-Host "Commits pushed: " -NoNewline -ForegroundColor Cyan
Write-Host "$successCount" -ForegroundColor White
Write-Host ""
Write-Host "Last $([Math]::Min(5, $successCount)) commit(s):" -ForegroundColor Cyan
git log -$([Math]::Min(5, $successCount)) --pretty=format:"%h - %s (%ar)" --abbrev-commit
Write-Host "`n"

Write-ColorMessage "All done! Atomic commits pushed to GitHub." "Success"
