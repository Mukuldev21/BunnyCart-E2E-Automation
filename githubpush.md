# Git Push Strategy: Atomic Commits & Immediate Pushes

This document defines the **STRICT** operating procedure for pushing code. The goal is extreme granularity: every distinct piece of functionality must be its own commit, and every commit must be pushed immediately to the remote.

## 🚫 Anti-Patterns
*   **Batch Push**: Accumulating multiple commits before pushing.
*   **Bulk Commit**: Combining multiple components (e.g., Header AND Footer) in one commit.
*   **"WIP" Commits**: Committing broken or incomplete code.

## ✅ The Golden Rule: "One Thing, One Commit, One Push"

For every single file or closely related logical unit (e.g., a component and its test):
1.  **Stage** only that file.
2.  **Commit** with a descriptive message.
3.  **Push** immediately.

---

## Execution Workflow

### 1. Configuration & Documentation (Atomic)
**Scenario:** You updated `packaging.json` and `README.md`.
**Action:** Commit and push them separately if they are unrelated changes, or together if they are part of a specific detailed setup.

```bash
git add package.json
git commit -m "chore: Update dependencies"
git push origin master
```

### 2. Core Components (Per-Component)
**Scenario:** You created `Header.ts` and `Footer.ts`.
**Action:** **DO NOT** commit them together.

**Step A: Header**
```bash
git add src/components/Header.ts
git commit -m "feat(components): Add Header component"
git push origin master
```

**Step B: Footer**
```bash
git add src/components/Footer.ts
git commit -m "feat(components): Add Footer component"
git push origin master
```

### 3. Page Objects (Per-Page)
**Scenario:** You created `LoginPage.ts` and `RegisterPage.ts`.
**Action:** Separate commits and pushes.

**Step A: Login Page**
```bash
git add src/pages/LoginPage.ts
git commit -m "feat(pages): Add Login Page Object"
git push origin master
```

**Step B: Register Page**
```bash
git add src/pages/RegisterPage.ts
git commit -m "feat(pages): Add Register Page Object"
git push origin master
```

### 4. Fixtures & Utilities (Atomic)
**Scenario:** Adding a new fixture.

```bash
git add src/fixtures/custom-test.ts
git commit -m "feat(fixtures): Add auth fixture"
git push origin master
```

### 5. Test Specifications (Per-Test File)
**Scenario:** Adding tests for Auth and Checkout.

**Step A: Auth Tests**
```bash
git add src/tests/auth/auth.spec.ts
git commit -m "test(auth): Add TC001-TC005"
git push origin master
```

**Step B: Checkout Tests**
```bash
git add src/tests/checkout/cart.spec.ts
git commit -m "test(checkout): Add Cart validation tests"
git push origin master
```

## Summary Checklist

- [ ] **Atomic**: Did I commit only *one* logical unit?
- [ ] **Granular**: Are distinct components separated?
- [ ] **Immediate**: Did I run `git push` immediately after `git commit`?
