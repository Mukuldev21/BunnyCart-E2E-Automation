# Push to GitHub Script - Usage Guide

## Overview

The `push-to-github.ps1` script automates the process of committing and pushing code changes to GitHub while following the conventional commit standards defined in `docs/githubpush_instructions.md`.

## Quick Start

### Basic Usage (Interactive Mode)

Simply run the script without any parameters for an interactive experience:

```powershell
.\push-to-github.ps1
```

The script will:
1. ✓ Check for changes in your repository
2. ✓ Prompt you to select commit type (feat, fix, test, etc.)
3. ✓ Ask for scope (auth, cart, pages, etc.)
4. ✓ Request commit message
5. ✓ Show files to be committed
6. ✓ Stage all changes
7. ✓ Create commit with conventional format
8. ✓ Ask for confirmation before pushing
9. ✓ Push to GitHub

### Advanced Usage (Command-line Parameters)

For faster workflow, provide parameters directly:

```powershell
# Example 1: Add a new test case
.\push-to-github.ps1 -Type "test" -Scope "cart" -Message "add TC032 mini-cart hover test"

# Example 2: Fix a bug
.\push-to-github.ps1 -Type "fix" -Scope "pages" -Message "correct locator in CartPage"

# Example 3: Update documentation
.\push-to-github.ps1 -Type "docs" -Message "update README with new test cases"

# Example 4: Auto-push without confirmation
.\push-to-github.ps1 -Type "feat" -Scope "auth" -Message "add login validation" -AutoPush
```

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `-Type` | No | Commit type | `feat`, `fix`, `test`, `docs`, `chore`, `refactor`, `style`, `perf` |
| `-Scope` | No | Commit scope | `auth`, `cart`, `browse`, `pages`, `components`, `fixtures` |
| `-Message` | No | Commit message | `add TC032 mini-cart hover test` |
| `-SkipTests` | No | Skip running tests (not recommended) | `-SkipTests` |
| `-AutoPush` | No | Auto-push without confirmation | `-AutoPush` |

## Commit Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature or test case | `feat(cart): add TC032 mini-cart hover test` |
| `fix` | Bug fix or test correction | `fix(pages): correct locator in CartPage` |
| `test` | Adding or updating tests | `test(auth): add TC001 login test` |
| `docs` | Documentation changes | `docs: update README with setup instructions` |
| `chore` | Build, dependencies, config | `chore: add dotenv package` |
| `refactor` | Code restructuring | `refactor(pages): extract Header component` |
| `style` | Code formatting | `style(components): format Header.ts` |
| `perf` | Performance improvements | `perf(tests): optimize wait strategies` |

## Common Scopes

- `auth` - Authentication module
- `cart` - Shopping cart module
- `browse` - Browse/Category module
- `pdp` - Product Details Page
- `pages` - Page objects
- `components` - Shared components
- `fixtures` - Test fixtures
- `config` - Configuration files

## Examples

### Example 1: Adding a New Test Case

```powershell
# Interactive mode
.\push-to-github.ps1

# Select: 3 (test)
# Scope: cart
# Message: add TC033 cart quantity update test
```

**Result:** `test(cart): add TC033 cart quantity update test`

### Example 2: Fixing a Bug

```powershell
.\push-to-github.ps1 -Type "fix" -Scope "pages" -Message "correct wait strategy in ProductDetailsPage"
```

**Result:** `fix(pages): correct wait strategy in ProductDetailsPage`

### Example 3: Updating Documentation

```powershell
.\push-to-github.ps1 -Type "docs" -Message "add test execution guide"
```

**Result:** `docs: add test execution guide`

### Example 4: Quick Commit and Push

```powershell
.\push-to-github.ps1 -Type "feat" -Scope "browse" -Message "add TC025 breadcrumb navigation test" -AutoPush
```

**Result:** Commits and pushes immediately without confirmation

## Features

### ✓ Automatic Change Detection
- Detects all modified, new, and deleted files
- Shows git status before committing
- Warns if no changes are detected

### ✓ Conventional Commit Format
- Enforces `type(scope): message` format
- Validates commit types
- Ensures meaningful commit messages

### ✓ Interactive Prompts
- Guided selection of commit type
- Suggestions for common scopes
- Examples for commit messages

### ✓ Safety Checks
- Confirms before committing
- Confirms before pushing
- Shows summary of changes

### ✓ Color-Coded Output
- ✓ Green for success
- ℹ Cyan for information
- ⚠ Yellow for warnings
- ✗ Red for errors

### ✓ Test Integration (Optional)
- Can run tests before committing
- Warns if tests fail
- Can skip tests with `-SkipTests` flag

## Workflow Integration

### Daily Development Workflow

1. **Make changes** to your code
2. **Run the script**:
   ```powershell
   .\push-to-github.ps1
   ```
3. **Follow prompts** to create conventional commit
4. **Confirm** and push to GitHub

### Quick Commits

For experienced users who know the commit details:

```powershell
# Add new test
.\push-to-github.ps1 -Type "test" -Scope "cart" -Message "add TC034 remove from cart test" -AutoPush

# Fix bug
.\push-to-github.ps1 -Type "fix" -Scope "fixtures" -Message "correct page fixture initialization" -AutoPush
```

## Troubleshooting

### "Not a git repository"
**Solution:** Run the script from the project root directory where `.git` folder exists.

### "No changes detected"
**Solution:** Make sure you have modified, added, or deleted files before running the script.

### "Failed to push to remote"
**Solution:** 
- Check your internet connection
- Ensure you have push permissions
- Try pulling changes first: `git pull origin main`
- Check if you need to authenticate

### "Some tests failed"
**Solution:**
- Fix the failing tests before committing
- Or use `-SkipTests` flag (not recommended)

## Best Practices

1. ✅ **Commit frequently** - After each logical change
2. ✅ **Use meaningful messages** - Describe what changed and why
3. ✅ **Follow conventions** - Use correct type and scope
4. ✅ **Test before commit** - Ensure code works
5. ✅ **Review changes** - Check git status before confirming

## Comparison with Manual Git Commands

### Manual Way (Multiple Commands)
```powershell
git status
git add -A
git commit -m "test(cart): add TC032 mini-cart hover test"
git push origin main
```

### Automated Way (Single Command)
```powershell
.\push-to-github.ps1 -Type "test" -Scope "cart" -Message "add TC032 mini-cart hover test" -AutoPush
```

## Tips

- 💡 Use **Tab completion** for file paths in PowerShell
- 💡 Create **aliases** for frequently used commands
- 💡 Use **-AutoPush** for trusted changes to skip confirmation
- 💡 Keep **commit messages concise** but descriptive
- 💡 Use **scope** to organize commits by module

## Setting Up an Alias (Optional)

Add to your PowerShell profile for quick access:

```powershell
# Open profile
notepad $PROFILE

# Add alias
Set-Alias -Name gitpush -Value "C:\Users\mukul\Downloads\BunnyCart_E2E\bunnycart\push-to-github.ps1"

# Usage
gitpush -Type "test" -Scope "cart" -Message "add new test"
```

## Support

For issues or questions:
1. Check `docs/githubpush_instructions.md` for commit guidelines
2. Review this usage guide
3. Check git status: `git status`
4. Check git log: `git log --oneline -5`

---

**Happy Coding! 🚀**
