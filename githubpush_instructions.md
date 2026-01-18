# GIT COMMIT & PUSH STRATEGY

**PHILOSOPHY:** Granular, atomic commits with meaningful messages following conventional commit standards.

---

## 🎯 CORE PRINCIPLES

1. **Atomic Commits:** One logical change per commit
2. **Meaningful Messages:** Clear, descriptive commit messages following conventions
3. **Granular Changes:** Commit frequently, not in bulk
4. **User Approval:** Wait for approval before pushing to remote

---

## 📋 CONVENTIONAL COMMIT FORMAT

Use the following format for ALL commit messages:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Commit Types

| Type | Usage | Example |
|------|-------|---------|
| `feat` | New feature or test case | `feat(auth): add TC001 login test` |
| `fix` | Bug fix or test correction | `fix(auth): correct password locator in TC001` |
| `refactor` | Code restructuring (no behavior change) | `refactor(pages): extract Header component from LoginPage` |
| `test` | Adding or updating tests | `test(auth): add TC002 invalid login test` |
| `docs` | Documentation changes | `docs: update README with setup instructions` |
| `chore` | Build, dependencies, config | `chore: add dotenv package` |
| `style` | Code formatting (no logic change) | `style(components): format Header.ts` |
| `perf` | Performance improvements | `perf(tests): optimize wait strategies` |

### Scope Examples

- `auth` - Authentication module
- `users` - User management module
- `components` - Shared components
- `pages` - Page objects
- `fixtures` - Test fixtures
- `config` - Configuration files

---

## ✅ GRANULAR COMMIT WORKFLOW

### Rule: Commit After Each Logical Unit

**Logical Units:**
- ✅ One component file
- ✅ One page object file
- ✅ One test case (TC###)
- ✅ One fixture update
- ✅ One configuration change
- ✅ One documentation file

**❌ NOT Logical Units:**
- ❌ Multiple components in one commit
- ❌ Multiple test cases in one commit
- ❌ Entire module in one commit

---

## 📝 COMMIT MESSAGE EXAMPLES

### ✅ GOOD - Specific and Descriptive

```bash
# Adding a new component
git add src/components/Header.ts
git commit -m "feat(components): add Header component with logout functionality"

# Adding a page object
git add src/pages/LoginPage.ts
git commit -m "feat(pages): add LoginPage with login method and locators"

# Adding a test case
git add src/tests/auth/auth.spec.ts
git commit -m "test(auth): add TC001 successful login test"

# Updating fixtures
git add src/fixtures/custom-test.ts
git commit -m "feat(fixtures): add loginPage fixture for dependency injection"

# Fixing a test
git add src/tests/auth/auth.spec.ts
git commit -m "fix(auth): correct username locator in TC001"

# Refactoring
git add src/pages/LoginPage.ts
git commit -m "refactor(pages): extract wait logic to separate method in LoginPage"

# Documentation
git add README.md
git commit -m "docs: add test execution commands to README"

# Configuration
git add playwright.config.ts
git commit -m "chore(config): add storage state configuration for auth"
```

### ❌ BAD - Vague or Bulk

```bash
# Too vague
git commit -m "update files"
git commit -m "fix bugs"
git commit -m "add tests"

# Too broad (multiple changes)
git commit -m "add all components and pages"
git commit -m "implement entire auth module"
git commit -m "fix all tests"

# Not following convention
git commit -m "Added login page"
git commit -m "fixed stuff"
git commit -m "WIP"
```

---

## 🔄 STEP-BY-STEP WORKFLOW

### Scenario 1: Adding a New Component

```bash
# 1. Create the component file
# (Code: src/components/Header.ts)

# 2. Stage ONLY this file
git add src/components/Header.ts

# 3. Commit with meaningful message
git commit -m "feat(components): add Header component with user menu and logout"

# 4. WAIT for user approval before pushing
# User will review the commit

# 5. Push after approval
git push origin main
```

### Scenario 2: Adding a Test Case

```bash
# 1. Implement TC001 in auth.spec.ts
# (Code: src/tests/auth/auth.spec.ts)

# 2. Stage the test file
git add src/tests/auth/auth.spec.ts

# 3. Commit with TC ID in message
git commit -m "test(auth): add TC001 successful login with valid credentials"

# 4. Verify test passes
npx playwright test --grep="TC001"

# 5. WAIT for approval, then push
git push origin main
```

### Scenario 3: Multiple Related Files (Component + Page)

**If files are tightly coupled (e.g., creating Header component and updating LoginPage to use it):**

```bash
# Option A: Separate commits (PREFERRED)
git add src/components/Header.ts
git commit -m "feat(components): add Header component"

git add src/pages/LoginPage.ts
git commit -m "refactor(pages): integrate Header component in LoginPage"

# Option B: Single commit (only if truly inseparable)
git add src/components/Header.ts src/pages/LoginPage.ts
git commit -m "feat(components,pages): add Header component and integrate in LoginPage"
```

### Scenario 4: Fixing a Bug in Existing Test

```bash
# 1. Fix the locator in TC001
# (Code: src/tests/auth/auth.spec.ts)

# 2. Stage the file
git add src/tests/auth/auth.spec.ts

# 3. Commit with 'fix' type
git commit -m "fix(auth): correct password input locator in TC001"

# 4. Verify fix works
npx playwright test --grep="TC001"

# 5. Push after approval
git push origin main
```

---

## 📊 COMMIT GRANULARITY GUIDE

### Module Implementation Example

**Scenario:** Implementing Authentication Module (TC001-TC005)

**❌ BAD - One Bulk Commit:**
```bash
# Implement everything
git add src/components/ src/pages/ src/tests/ src/fixtures/
git commit -m "add authentication module"
git push
```

**✅ GOOD - Granular Commits:**
```bash
# 1. Header component
git add src/components/Header.ts
git commit -m "feat(components): add Header component with logout"
git push origin main

# 2. Login page
git add src/pages/LoginPage.ts
git commit -m "feat(pages): add LoginPage with login method"
git push origin main

# 3. Update fixtures
git add src/fixtures/custom-test.ts
git commit -m "feat(fixtures): add loginPage fixture"
git push origin main

# 4. First test case
git add src/tests/auth/auth.spec.ts
git commit -m "test(auth): add TC001 successful login test"
git push origin main

# 5. Second test case
git add src/tests/auth/auth.spec.ts
git commit -m "test(auth): add TC002 invalid credentials test"
git push origin main

# ... continue for each test case
```

**Benefits:**
- ✅ Easy to review each change
- ✅ Easy to revert specific changes
- ✅ Clear history of what was added when
- ✅ Easier to track progress

---

## 🚫 ANTI-PATTERNS TO AVOID

### ❌ DON'T: Batch Commits

```bash
# BAD - Accumulating changes
git add src/components/Header.ts
git add src/components/Footer.ts
git add src/components/Navbar.ts
git commit -m "add components"
```

### ✅ DO: Individual Commits

```bash
# GOOD - One at a time
git add src/components/Header.ts
git commit -m "feat(components): add Header component"

git add src/components/Footer.ts
git commit -m "feat(components): add Footer component"

git add src/components/Navbar.ts
git commit -m "feat(components): add Navbar component"
```

### ❌ DON'T: Vague Messages

```bash
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
git commit -m "WIP"
```

### ✅ DO: Descriptive Messages

```bash
git commit -m "feat(auth): add TC003 empty fields validation test"
git commit -m "fix(pages): correct wait strategy in LoginPage.login()"
git commit -m "refactor(components): extract modal logic to separate method"
```

### ❌ DON'T: Commit Broken Code

```bash
# BAD - Test is failing
git add src/tests/auth/auth.spec.ts
git commit -m "test(auth): add TC001 (WIP - not working yet)"
```

### ✅ DO: Commit Working Code

```bash
# GOOD - Test passes
npx playwright test --grep="TC001"  # Verify it works
git add src/tests/auth/auth.spec.ts
git commit -m "test(auth): add TC001 successful login test"
```

---

## 📋 COMMIT CHECKLIST

Before committing, verify:

- [ ] **Atomic:** Does this commit contain only ONE logical change?
- [ ] **Complete:** Is this change complete and working?
- [ ] **Tested:** Have I verified this change works (run the test)?
- [ ] **Meaningful:** Does the commit message clearly describe what changed?
- [ ] **Convention:** Does the message follow `<type>(<scope>): <subject>` format?
- [ ] **Staged:** Have I staged ONLY the files for this logical change?

---

## 🔄 PUSH STRATEGY

### When to Push

**After each commit** (with user approval):

```bash
# 1. Make change
# 2. Commit
git commit -m "feat(pages): add DashboardPage"

# 3. WAIT for user approval
# User reviews the commit

# 4. Push after approval
git push origin main
```

### Approval Workflow

**AI Agent should:**
1. Make the commit
2. Show the commit message to user
3. Ask: "Commit created. Ready to push?"
4. Wait for user confirmation
5. Execute `git push origin main` after approval

---

## 📚 QUICK REFERENCE

### Common Commit Patterns

```bash
# New test case
git commit -m "test(<module>): add TC### <test description>"

# New component
git commit -m "feat(components): add <ComponentName> with <functionality>"

# New page object
git commit -m "feat(pages): add <PageName> with <methods>"

# Update fixture
git commit -m "feat(fixtures): add <pageName> fixture"

# Fix test
git commit -m "fix(<module>): correct <issue> in TC###"

# Refactor
git commit -m "refactor(<scope>): <what was refactored>"

# Documentation
git commit -m "docs: <what was documented>"

# Configuration
git commit -m "chore(config): <what was configured>"
```

---

## 🎯 SUMMARY

**Remember:**
1. ✅ **Commit frequently** - after each logical unit
2. ✅ **Use conventional format** - `type(scope): subject`
3. ✅ **Be specific** - describe what changed and why
4. ✅ **Wait for approval** - before pushing to remote
5. ✅ **Verify first** - ensure code works before committing

**Goal:** Clean, readable git history that tells the story of the project's development.