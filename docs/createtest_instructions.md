# INSTRUCTIONS FOR CREATING TESTS

This document enables AI agents to create high-quality, maintainable Playwright tests that adhere to the project's strict `AI_TEST_STANDARDS.md`.

---

## 📋 TEST CASE CONFIGURATION

> [!IMPORTANT]
> **Specify which test case to implement.** Create ONE test at a time for easier debugging and faster feedback.

### Test Case to Implement

| Property | Value | Notes |
|----------|-------|-------|
| **Test Case ID** | `TC036| From testcases.md |
| **Reference** | `testcases.md` |

**Example:**
```markdown
- Test Case ID: TC001
- Test Case Title: Successful Login with Valid Credentials
- Module: Authentication
- Priority: Critical
- Reference: testcases.md, Line 15
```

---

## 🎯 WORKFLOW: ONE TEST AT A TIME

> [!CAUTION]
> **NEVER implement multiple tests simultaneously.** This leads to cascading failures and difficult debugging.

**Correct Approach:**
1. ✅ Implement TC001
2. ✅ Run ONLY TC001: `npx playwright test --grep="TC001"`
3. ✅ Fix any issues with TC001
4. ✅ Verify TC001 passes
5. ✅ Move to TC002

**Incorrect Approach:**
1. ❌ Implement TC001, TC002, TC003 all at once
2. ❌ Run all tests together
3. ❌ Multiple tests fail, hard to debug

---

## 1. PRE-REQUISITES (CRITICAL)

Before writing a single line of code:

### Step 1.1: Read Standards
**Action:** Review `AI_TEST_STANDARDS.md` completely.

**Focus on:**
- Section 1: Locator Strategy (Cascade Rule)
- Section 2: Component Object Model (COM)
- Section 3: Fixtures & Dependency Injection
- Section 7: Authentication & Storage State
- Section 8: Wait Strategies

### Step 1.2: Read Test Case Specification
**Action:** Locate the test case in `testcases.md` using the Test Case ID from configuration above.

**Extract:**
- Preconditions
- Test Steps (numbered list)
- Expected Results (bullet points)
- Test Data

### Step 1.3: Analyze UI Requirements
**Action:** Identify the Pages and Components involved in the test.

**Questions to answer:**
- Which pages will the test navigate to?
- What UI components are needed (buttons, forms, tables)?
- Are there shared components (Header, Navbar, Modal)?
- What locators will be needed?

---

## 2. UPDATE COMPONENT OBJECT MODEL (COM)

> [!NOTE]
> Do not write monolithic Page Objects. Use Composition.

### Step 2.1: Check Existing Components

**Action:** Review `src/components/` and `src/pages/` to see what already exists.

**Checklist:**
- [ ] Does a Header component exist?
- [ ] Does a Navbar component exist?
- [ ] Does a Modal component exist?
- [ ] Does the required Page Object exist?

### Step 2.2: Create/Update Components

**When to create a component:** For reusable UI widgets (Headers, NavBars, Tables, Modals).

**Location:** `src/components/`

**Code Style:**
```typescript
import { Page, Locator } from '@playwright/test';

export class Header {
    readonly page: Page;
    readonly logoutButton: Locator;
    readonly userMenu: Locator;

    constructor(page: Page) {
        this.page = page;
        // Use Cascade Rule: getByRole > getByTestId > Container + Filter
        this.userMenu = page.getByRole('button', { name: 'User Menu' });
        this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    }

    async logout() {
        await this.userMenu.click();
        await this.logoutButton.click();
    }
}
```

**Locator Strategy (Cascade Rule):**
1. **Priority 1:** `getByRole`, `getByLabel`, `getByPlaceholder` (Semantic)
2. **Priority 2:** `getByTestId` (Stable Attributes)
3. **Priority 3:** `Container + Filter` (Dynamic Lists)
4. **FORBIDDEN:** XPath, CSS chaining, `.nth()` index selection

### Step 2.3: Create/Update Page Objects

**When to create a page:** For a specific URL or Route.

**Location:** `src/pages/`

**Code Style:**
```typescript
import { Page, Locator } from '@playwright/test';
import { Header } from '../components/Header'; // Import Component

export class LoginPage {
    readonly page: Page;
    readonly header: Header; // Compose Component
    
    // Page-specific locators
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page); // Instantiate Component
        
        // Use semantic locators
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Log In' });
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        
        // Wait for navigation (use 'load' for speed, 'networkidle' for logout/complex flows)
        await this.page.waitForLoadState('load', { timeout: 30000 });
        await this.page.waitForTimeout(5000); // Buffer for slow servers
    }
}
```

**Best Practices:**
- ✅ Pages compose Components (don't duplicate)
- ✅ Use semantic locators (getByRole)
- ✅ Include wait strategies (see AI_TEST_STANDARDS.md Section 8)
- ✅ Methods should represent user actions

---

## 3. UPDATE FIXTURES (DEPENDENCY INJECTION)

> [!CAUTION]
> **NEVER instantiate Page Objects manually** in a test file (e.g., `new LoginPage(page)`). You MUST use the fixture system.

### Step 3.1: Update `src/fixtures/custom-test.ts`

**Actions:**
1. Import your new Page Object
2. Add it to the `MyFixtures` type definition
3. Initialize it in the `test.extend()` block

**Example:**

```typescript
// src/fixtures/custom-test.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // [NEW IMPORT]
import { DashboardPage } from '../pages/DashboardPage';

// 1. Declare the types of your fixtures
type MyFixtures = {
  loginPage: LoginPage; // [NEW TYPE]
  dashboardPage: DashboardPage;
};

// 2. Extend the base test
export const test = base.extend<MyFixtures>({
  // [NEW INITIALIZATION]
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
```

---

## 4. CREATE THE TEST SPEC

**Location:** `src/tests/<module>/<feature>.spec.ts`

### Step 4.1: Create Test File Structure

**File naming:** Use lowercase with hyphens (e.g., `auth.spec.ts`, `user-management.spec.ts`)

**Basic structure:**

```typescript
import { test, expect } from '../../fixtures/custom-test'; // MUST import from custom-test

test.describe('Module X: [Module Name]', () => {
  // If this is an authentication test, disable storage state
  // test.use({ storageState: { cookies: [], origins: [] } });

  test('TC###: [Test Case Title]', async ({ loginPage, dashboardPage }) => {
    // Test implementation
  });
});
```

### Step 4.2: Implement the Test Case

**Follow the AAA Pattern:**

```typescript
test('TC001: Successful Login with Valid Credentials', async ({ page, loginPage }) => {
  // ARRANGE - Setup preconditions
  await page.goto('/login');
  
  // ACT - Perform the action
  await loginPage.login('admin', 'Admin123');
  
  // ASSERT - Verify expected results
  const url = await page.url();
  expect(url).not.toContain('login');
  expect(url).toContain('dashboard');
});
```

**Best Practices:**
- ✅ Use descriptive test names with TC ID
- ✅ Import from `custom-test` (not `@playwright/test`)
- ✅ Use injected fixtures (no manual instantiation)
- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Use appropriate wait strategies (see AI_TEST_STANDARDS.md Section 8)
- ✅ Add comments for clarity

### Step 4.3: Add Console Logging

**Action:** Add clear console logs for debugging visibility.

**Required Logs:**
1. Test Start: `console.log('TC###: Starting test...');`
2. Key Actions: `console.log('TC###: Navigating to...');`
3. Assertions: `console.log('TC###: Verifying...');`
4. Test End: `console.log('TC###: Test completed successfully.');`

**Example:**
```typescript
test('TC001: ...', async ({ page }) => {
    console.log('TC001: Starting test - Verify Homepage');
    
    await page.goto('/');
    console.log('TC001: Navigated to homepage');

    const title = await page.title();
    console.log(`TC001: Page title is "${title}"`);
    
    expect(title).toContain('Littmann');
    console.log('TC001: Test completed successfully');
});
```

### Step 4.4: Handle Authentication Tests

**For Module 1: Authentication tests:**

```typescript
test.describe('Module 1: Authentication', () => {
  // ⚠️ DISABLE storage state for auth tests
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC001: Successful Login', async ({ page, loginPage }) => {
    // Perform FULL login from scratch
    await page.goto('/login');
    await loginPage.login('admin', 'Admin123');
    
    // Verify login succeeded
    expect(await page.url()).not.toContain('login');
  });
});
```

**For Modules 2-10: Non-authentication tests:**

```typescript
test.describe('Module 2: User Management', () => {
  // Storage state is used by default (from playwright.config.ts)
  // User is already logged in

  test('TC016: Create New User', async ({ userManagementPage }) => {
    // User is already authenticated
    await userManagementPage.navigateToUserManagement();
    // ... rest of test
  });
});
```

**Reference:** AI_TEST_STANDARDS.md Section 7 for authentication patterns

---

## 5. VERIFY THE TEST (ONE AT A TIME)

> [!IMPORTANT]
> **Run ONLY the test you just created.** Do not run the entire suite yet.

### Step 5.1: Run Single Test

**Command:**
```bash
# Run only the specific test case
npx playwright test --grep="TC001" --workers=1

# Or run with UI mode for debugging
npx playwright test --grep="TC001" --ui
```

### Step 5.2: Fix Issues

**If the test fails:**
1. Read the error message carefully
2. Check locators (use Playwright Inspector: `npx playwright test --debug`)
3. Verify wait strategies
4. Check test data
5. Review page object methods

### Step 5.3: Verify Test Passes

**Success criteria:**
- [ ] Test runs without errors
- [ ] All assertions pass
- [ ] Test completes in reasonable time
- [ ] No flakiness (run 3 times to verify)

**Command to run multiple times:**
```bash
npx playwright test --grep="TC001" --repeat-each=3
```

---

## 6. MOVE TO NEXT TEST

**Only after current test passes:**

1. ✅ Update Test Case Configuration (top of this document)
2. ✅ Specify next TC ID (e.g., TC002)
3. ✅ Repeat workflow from Step 1

**Progress tracking:**
```markdown
## Test Implementation Progress

- [x] TC001: Verify homepage loads successfully ✅
- [x] TC002: Verify Products menu navigation ✅
- [x] TC003: Verify "All Products" page load ✅
```

---

## 7. SUMMARY CHECKLIST

Before marking a test as complete, verify:

- [ ] Test Case Configuration filled in (TC ID, Title, Module)
- [ ] AI_TEST_STANDARDS.md reviewed
- [ ] Test case specification read from testcases.md
- [ ] Required components created/updated in `src/components/`
- [ ] Required page objects created/updated in `src/pages/`
- [ ] Fixtures registered in `src/fixtures/custom-test.ts`
- [ ] Test spec created in `src/tests/<module>/`
- [ ] Test uses injected fixtures (no `new Page(...)`)
- [ ] Locators follow Cascade Rule (Semantics first)
- [ ] Wait strategies implemented correctly
- [ ] Test runs successfully with `--grep="TC###"`
- [ ] Test passes consistently (no flakiness)

---

## 8. COMMON PITFALLS TO AVOID

### ❌ DON'T: Implement Multiple Tests at Once
```typescript
// BAD - All tests at once
test('TC001: Login', async () => { /* ... */ });
test('TC002: Logout', async () => { /* ... */ });
test('TC003: Invalid Login', async () => { /* ... */ });
// Run all → Multiple failures → Hard to debug
```

### ✅ DO: Implement One Test at a Time
```typescript
// GOOD - One test
test('TC001: Login', async () => { /* ... */ });
// Run TC001 → Fix → Verify → Then move to TC002
```

### ❌ DON'T: Manual Page Object Instantiation
```typescript
// BAD
test('TC001', async ({ page }) => {
  const loginPage = new LoginPage(page); // FORBIDDEN
});
```

### ✅ DO: Use Fixtures
```typescript
// GOOD
test('TC001', async ({ loginPage }) => {
  // loginPage is injected automatically
});
```

### ❌ DON'T: Use XPath or CSS Selectors
```typescript
// BAD
page.locator('//div[@class="login-form"]/input[1]')
page.locator('.flex > .p-4 > button')
```

### ✅ DO: Use Semantic Locators
```typescript
// GOOD
page.getByRole('textbox', { name: 'Username' })
page.getByRole('button', { name: 'Log In' })
```

---

## 9. REFERENCE DOCUMENTS

**Always consult:**
- **`AI_TEST_STANDARDS.md`** - Comprehensive standards and best practices
- **`testcases.md`** - Detailed test case specifications
- **`blueprint.md`** - Overall workflow and phases

---

**Remember:** One test at a time. Quality > Speed. Fix immediately, don't accumulate failures.