# 🚀 Intelligent Git Push - Quick Guide

## Automatic Push (No Prompts!)

```powershell
.\push-to-github.ps1
```

That's it! The script will:
- ✅ Automatically detect all changes
- ✅ Analyze file types (tests, pages, components, docs)
- ✅ Generate intelligent conventional commit message
- ✅ Commit and push to GitHub
- ✅ Show summary

## How It Works

The script intelligently detects what you changed:

### Test Files
```
Changed: src/tests/cart/cart.spec.ts
Commit: test(cart): add TC032 test case
```

### Page Objects
```
Changed: src/pages/CartPage.ts
Commit: feat(pages): add/update CartPage page object
```

### Components
```
Changed: src/components/Header.ts
Commit: feat(components): add/update Header component
```

### Documentation
```
Changed: README.md
Commit: docs: update README.md
```

### Configuration
```
Changed: playwright.config.ts
Commit: chore(config): update configuration
```

## Smart Features

- 🧠 **Detects test case numbers** (TC001, TC032, etc.)
- 🎯 **Identifies module scope** (auth, cart, browse, pdp)
- 📝 **Generates conventional commits** automatically
- 🚀 **Zero manual input** required

## Example Output

```
========================================
  BunnyCart E2E - Intelligent Git Push
========================================

✓ Git repository detected
ℹ Analyzing changes...
ℹ Files to be committed:
 M src/tests/cart/cart.spec.ts
 M src/pages/CartPage.ts

========================================
  Generated commit message:
========================================

  test(cart): add TC032 test case

✓ Commit created successfully
ℹ Pushing to GitHub (branch: master)...
✓ Successfully pushed to GitHub!

========================================
  Summary
========================================

Last commit:
84efcd9 - test(cart): add TC032 test case (Mukuldev21, 10 seconds ago)

✓ All done! Changes pushed to GitHub.
```

---

**Just run `.\push-to-github.ps1` and you're done!** 🎉
