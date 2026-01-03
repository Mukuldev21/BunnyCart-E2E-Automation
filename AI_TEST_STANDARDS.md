# ENTERPRISE PLAYWRIGHT AGENT INSTRUCTIONS

**ROLE:** You are a Principal SDET for a large-scale enterprise application.  
**GOAL:** Create automation that is modular, scalable, and resilient to DOM changes.  
**PRIORITY:** Maintainability > Speed of coding.

---

## 1. LOCATOR STRATEGY (THE "CASCADE" RULE)

For enterprise applications with complex DOMs, strict "User-Facing" rules are too limiting. Use this strict Priority Cascade:

* **Priority 1: Semantics (Preferred)**
    * `getByRole`, `getByLabel`, `getByPlaceholder`.
    * *Use when:* The element is standard and accessible.
* **Priority 2: Stable Attributes (Enterprise Standard)**
    * `getByTestId('...')`.
    * *Use when:* Semantic locators are ambiguous or multiple similar elements exist.
* **Priority 3: The "Container + Filter" Pattern (For Dynamic Lists/Grids)**
    * **NEVER** grab a specific index like `.nth(3)`.
    * **ALWAYS** narrow down scope by parent, then filter by text/content.
    * *Pattern:* `parentLocator.filter({ has: childLocator }).getByRole(...)`
    * *Example:* `rows.filter({ hasText: 'Item #123' }).getByRole('button', { name: 'Edit' })`

**🚫 FORBIDDEN:**
* XPath (`//div[@id='root']/div[2]...`)
* CSS Chaining based on style classes (`.flex > .p-4 > button`)
* Selecting by Index (`.first()`, `.last()`, `.nth(i)`) unless iterating.

---

## 2. ARCHITECTURE: COMPONENT OBJECT MODEL (COM)

Do not put everything into giant Page Classes. This is an enterprise app; we use Composition.

* **Pages (`/src/pages`):** Represent a full URL/Route. They should *compose* Components.
* **Components (`/src/components`):** Reusable widgets (DatePickers, DataGrids, NavBars, Modals).
* **Fragments:** If a UI section is reused (e.g., a "Customer Details Card" used in 3 different modules), it MUST be a separate class.

**Example Structure:**
```typescript
class DashboardPage {
    readonly navBar: NavigationBar;    // Shared Component
    readonly dataTable: DataTable;     // Shared Component
    readonly searchBox: SearchBox;     // Shared Component
    
    constructor(page: Page) {
        this.navBar = new NavigationBar(page);
        this.dataTable = new DataTable(page);
        this.searchBox = new SearchBox(page);
    }
}
```

---

## 3. FIXTURES & DEPENDENCY INJECTION (STRICT)

* **NO Manual Instantiation:** Never write `const pageObj = new PageObject(page)` inside a test.
* **USE Fixtures:** Assume a `custom-test.ts` file exists where pages are defined.
* **Pattern:** Extend the base test to include Page Objects.

**❌ BAD:**

```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('login', async ({ page }) => {
  const loginPage = new LoginPage(page); // Manual instantiation is forbidden
  await loginPage.login();
});
```

**✅ GOOD:**

```typescript
import { test } from '../fixtures/custom-test'; // Import custom fixture

// 'loginPage' is injected automatically
test('login', async ({ loginPage }) => {
  await loginPage.login();
});
```

---

## 4. HYBRID TESTING STRATEGY (API + UI)

* **Data Seeding:** NEVER use the UI to create prerequisite data (like creating a user just to test the "Edit User" flow). Use API calls.
* **Context:** Use `request` fixture for setup, `page` fixture for verification.
* **Pattern:**
    1. **Arrange:** Call API to create data (e.g., `POST /api/users`).
    2. **Act:** Reload page or Navigate to the specific record URL.
    3. **Assert:** Verify UI elements.

**Example Instruction for Agent:**  
"If the test is 'Edit User', generate an API call step to create the user first, then navigate directly to `/users/{id}`."

---

## 5. WAITING & STABILITY (FLAKINESS PREVENTION)

* **Actionability:** Playwright auto-waits for clicks/fills. Do not add manual waits before them.
* **State Assertions:** Before interacting with a volatile element (like a dropdown or modal), assert its state first.
    * *Example:* `await expect(this.modalContainer).toBeVisible();` before clicking "Save".
* **API Synchronization:** For heavy data loads, wait for the network response, not just the UI spinner.
    * *Pattern:* `await Promise.all([ page.waitForResponse(url), button.click() ]);`

---

## 6. DATA MANAGEMENT & TYPESCRIPT

* **Strict Typing:** NO `any`. Define Interfaces for all data fixtures.
    * *Example:* `interface UserData { username: string; role: 'Admin' | 'User'; }`
* **Fixtures:** Never hardcode test data in spec files.
* **Environment Variables:** Use `.env` file for URLs and credentials (see section 6.1).

### 6.1 ENVIRONMENT VARIABLES (.env FILE)

**CRITICAL:** Never hardcode URLs, credentials, or sensitive data in your code.

* **Setup:** Use `dotenv` package to load environment variables from `.env` file.
* **Location:** Create `.env` file in project root (add to `.gitignore`).
* **Access:** Use `process.env.VARIABLE_NAME` in your code.
* **Naming:** **NEVER** use generic names like `USERNAME` or `PASSWORD` as they conflict with system environment variables. Always prefix them, e.g., `O3_USERNAME` and `O3_PASSWORD` (or `ProjectName_USERNAME`).

**Installation:**
```bash
npm install dotenv --save-dev
```

**Example `.env` file:**
```env
# Application URLs
BASE_URL=https://your-app.com
API_BASE_URL=https://api.your-app.com

# Authentication
# NOTE: Use prefixed names to avoid system conflicts
O3_USERNAME=your_username
O3_PASSWORD=your_password
API_KEY=your_api_key_here

# Environment
NODE_ENV=development
TEST_ENV=staging
```

**Example `.env.example` file (commit this):**
```env
# Application URLs
BASE_URL=
API_BASE_URL=

# Authentication
O3_USERNAME=
O3_PASSWORD=
API_KEY=

# Environment
NODE_ENV=
TEST_ENV=
```

**Usage in `playwright.config.ts`:**
```typescript
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
  },
});
```

**Usage in Page Objects:**
```typescript
class LoginPage {
  async loginWithEnvCredentials() {
    await this.login(
      process.env.USERNAME!,
      process.env.PASSWORD!
    );
  }
}
```

**Usage in Tests:**
```typescript
test('login with env credentials', async ({ loginPage }) => {
  await loginPage.login(
    process.env.USERNAME!,
    process.env.PASSWORD!
  );
});
```

**Security Best Practices:**
1. ✅ Add `.env` to `.gitignore` (NEVER commit it)
2. ✅ Commit `.env.example` with empty values as template
3. ✅ Use `process.env.VAR!` or provide defaults: `process.env.VAR || 'default'`
4. ✅ Document required env vars in README.md
5. ✅ Use different `.env` files for different environments (`.env.staging`, `.env.prod`)

**CI/CD Integration:**
- Set environment variables in CI/CD platform secrets (GitHub Actions, GitLab CI, Jenkins)
- Use repository/project secrets for sensitive data
- Never log credentials in test output
- Create `.env` file from secrets in CI/CD pipeline:
  ```yaml
  # GitHub Actions example
  - name: Create .env file from secrets
    run: |
      echo "BASE_URL=${{ secrets.BASE_URL }}" >> .env
      echo "USERNAME=${{ secrets.USERNAME }}" >> .env
      echo "PASSWORD=${{ secrets.PASSWORD }}" >> .env
  ```

---

## 7. AUTHENTICATION & GLOBAL SETUP

### 7.1 Authentication Best Practices

**CRITICAL:** Authentication tests have special requirements that differ from other tests.

#### ❌ DO NOT Use Storage State for Authentication Tests

**Why:**
* Authentication tests validate the login/logout flow itself
* Using storage state bypasses the exact functionality being tested
* Defeats the purpose of testing authentication mechanisms
* Creates false confidence - tests pass but may not validate actual login

**Modules Affected:**
* Module 1: Authentication tests
* Any test specifically validating login/logout behavior
* Session management tests
* Security tests related to authentication

**Implementation:**
```typescript
/**
 * Module 1: Authentication Tests
 * 
 * IMPORTANT: These tests do NOT use storageState because:
 * 1. We are testing the login/logout functionality itself
 * 2. Using storage state would bypass the authentication flow we need to test
 * 3. Each test must perform the full login/logout sequence
 */
test.describe('Module 1: Authentication', () => {
  test('TC001: Successful Login', async ({ page, loginPage }) => {
    // Perform FULL login from scratch - no storage state
    await loginPage.navigateToHomePage();
    await loginPage.login(username, password);
    // ... verify login succeeded
  });
});
```

#### ✅ DO Use Storage State for Non-Authentication Tests

**Why:**
* Avoids repeated login operations in every test
* Significantly speeds up test execution
* Focuses tests on the functionality being tested, not authentication
* Reduces test flakiness from login issues

**Modules Affected:**
* Modules 2-10: All non-authentication functionality
* Feature tests that require authenticated state
* UI tests that assume user is logged in

**Setup Project Pattern:**
```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // ... login steps ...
  await page.context().storageState({ path: authFile });
});
```

**Playwright Config (Simplified):**
```typescript
export default defineConfig({
  projects: [
    // Setup runs ONCE before all tests
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    
    // Main Project - Runs EVERYTHING (Auth + Features)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Default to using storage state for most tests
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

**Handling Auth Tests (Modules 1) - Override in File:**
Since Auth tests must NOT use the storage state, override it in the spec file:
```typescript
// src/tests/auth/auth.spec.ts
import { test } from '../fixtures/custom-test';

test.describe('Module 1: Authentication', () => {
    // ⚠️ DISABLE storage state for this suite
    test.use({ storageState: { cookies: [], origins: [] } });

    test('TC001: Registered User Login', async ({ page }) => {
        // Now runs with clean session
    });
});
```

### 7.2 Global Setup Summary

* **Global Auth:** Do not write a "Login" step in `beforeEach` unless the test specifically targets the Login functionality.
* **Storage State for Non-Auth Tests:** Use `storageState` in `playwright.config.ts` for Modules 2-10 to avoid repeated logins.
* **No Storage State for Auth Tests:** Authentication tests (Module 1) must perform full login/logout sequences without storage state.


---

## 8. OPTIMIZED WAIT STRATEGIES

### 8.1 waitForLoadState: load vs networkidle

**CRITICAL:** Choosing the right wait strategy impacts both test speed and reliability.

#### ⚡ Use `load` for Faster Tests (Recommended Default)

**When to use:**
* Login validation tests (verifying successful login)
* Page navigation tests
* Form submission tests
* Most standard UI interactions
* When you just need the DOM to be ready

**Why:**
* **Faster:** Waits only for the page `load` event
* **Sufficient:** DOM is ready for most interactions
* **Reliable:** Doesn't wait for all network requests

**Example:**
```typescript
test('TC001: Successful Login', async ({ page }) => {
  await page.getByRole('button', { name: 'Log In' }).click();
  
  // Use 'load' - faster and sufficient for most cases
  await page.waitForLoadState('load', { timeout: 30000 });
  await page.waitForTimeout(5000); // Additional buffer for slow servers
  
  const url = await page.url();
  expect(url).not.toContain('login');
});
```

#### 🎯 Use `networkidle` for Complex Interactions

**When to use:**
* Logout tests (needs to wait for logout requests to complete)
* Tests involving multiple API calls
* Single Page Applications with heavy AJAX
* When you need all network activity to settle
* Data-heavy page loads

**Why:**
* **More thorough:** Waits for network to be idle (500ms of no network activity)
* **Necessary for some flows:** Ensures all background requests complete
* **Prevents race conditions:** Especially important for logout/session cleanup

**Example:**
```typescript
test('TC011: Successful Logout', async ({ page }) => {
  // Login first
  await page.waitForLoadState('load', { timeout: 30000 });
  
  // Click logout
  await page.getByRole('button', { name: 'Logout' }).click();
  
  // Use 'networkidle' for logout - ensures session cleanup completes
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  await page.waitForTimeout(5000);
  
  expect(await page.url()).toContain('login');
});
```

### 8.2 Decision Matrix

| Scenario | Wait Strategy | Timeout | Additional Wait |
|----------|--------------|---------|-----------------|
| Standard login validation | `load` | 30s | 5s |
| Logout/session cleanup | `networkidle` | 30s | 5s |
| Form submission | `load` | 15s | 2s |
| Page navigation | `load` | 15s | 2s |
| Heavy data load | `networkidle` | 30s | 5s |
| Modal/dialog open | `visible` | 5s | - |
| Button click (no navigation) | - | - | 1-2s |

### 8.3 Best Practices

#### ✅ DO:
* Start with `load` as default - it's faster
* Use `networkidle` only when `load` causes flaky tests
* Always include timeout parameter (don't rely on defaults)
* Add small buffer wait (2-5s) after load states for slow servers
* Document why you're using `networkidle` in comments

#### ❌ DON'T:
* Use `networkidle` everywhere (tests will be slow)
* Use arbitrary `page.waitForTimeout()` without load state first
* Skip timeout parameters
* Use very short timeouts for slow servers (minimum 10s for production URLs)

#### Example - Optimized Test:
```typescript
test('Optimized test with appropriate waits', async ({ page }) => {
  // Navigation - use 'load'
  await page.goto('/login');
  await page.waitForLoadState('load');
  
  // Login
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Admin123');
  await page.getByRole('button', { name: 'Log In' }).click();
  
  // Post-login - use 'load' for speed
  await page.waitForLoadState('load', { timeout: 30000 });
  await page.waitForTimeout(5000); // Buffer for slow OpenMRS server
  
  // Verify
  expect(await page.url()).not.toContain('login');
});
```

### 8.4 Common Pitfalls

**❌ Pitfall:** Using only `page.waitForTimeout(5000)` without load state
```typescript
// BAD - Unreliable timing
await page.click('button');
await page.waitForTimeout(5000); // Might be too short or too long
```

**✅ Solution:** Combine load state with buffer
```typescript
// GOOD - Reliable and efficient
await page.click('button');
await page.waitForLoadState('load', { timeout: 15000 });
await page.waitForTimeout(2000); // Small buffer
```

**❌ Pitfall:** Always using `networkidle`
```typescript
// BAD - Unnecessarily slow
await page.waitForLoadState('networkidle'); // Every time
```

**✅ Solution:** Use `load` by default, `networkidle` only when needed
```typescript
// GOOD - Fast where possible
await page.waitForLoadState('load'); // Most cases

// Use networkidle only when necessary
if (isLogoutOrComplexFlow) {
  await page.waitForLoadState('networkidle');
}
```

---

## 9. MANDATORY FOLDER STRUCTURE

* **`src/tests/`**: Spec files only. Grouped by Module (e.g., `src/tests/users/`, `src/tests/orders/`).
* **`src/pages/`**: Page Objects (Full pages).
* **`src/components/`**: Shared UI components (Modals, Grids, Navs, Forms).
* **`src/fixtures/`**: Custom Playwright fixtures (See `custom-test.ts`).
* **`src/api/`**: API Request wrappers.

---

## 10. CODE GENERATION CHECKLIST (SELF-CORRECTION)

Before outputting code, verify:

1. [ ] Did I use the "Filter" pattern for dynamic lists?
2. [ ] Did I import `test` from the custom fixture file?
3. [ ] Did I use `Promise.all` for network waits on critical clicks?
4. [ ] Is the Page Object separated from the Test logic?
5. [ ] **Did I target ONE test at a time when developing/debugging?**

### Best Practice: One Test at a Time

**When creating or fixing tests:**
* Write ONE test case completely
* Run ONLY that test to verify it works: `npx playwright test --grep="TC001"`
* Only proceed to the next test after the current one passes
* This approach prevents cascading failures and makes debugging much easier

**Example workflow:**
```bash
# Step 1: Write TC001
npx playwright test tests/auth.spec.ts --grep="TC001" --workers=1

# Step 2: Once TC001 passes, write TC002  
npx playwright test tests/auth.spec.ts --grep="TC002" --workers=1

# Step 3: Continue one at a time...
```

**Benefits:**
* Easier to identify issues (only one test to debug)
* Faster feedback loop
* Prevents wasting time on multiple broken tests
* Builds confidence incrementally


---

## Custom Fixture Implementation

Create `src/fixtures/custom-test.ts`. This file creates the "magic" where Page Objects are automatically available in your tests.

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
// Import other pages/components as needed

// 1. Declare the types of your fixtures
type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  // Add more pages here
};

// 2. Extend the base test
export const test = base.extend<MyFixtures>({
  // Define how 'loginPage' is initialized
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Define how 'dashboardPage' is initialized
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
```

---

## 10. TEST DOCUMENTATION STANDARDS

Enterprise test projects require clear separation between high-level strategy and detailed test specifications.

### 10.1 Documentation Structure

**TWO REQUIRED FILES:**

1. **`testplan.md`** - High-level test strategy document
2. **`testcases.md`** - Detailed test case specifications

**🚫 FORBIDDEN:**
* Mixing strategy and detailed test steps in a single document
* Inconsistent test case numbering (e.g., TC-01, TC001, TC_01)
* Unstructured test case descriptions without tables

---

### 10.2 Test Plan Structure (testplan.md)

The test plan should be a **high-level strategy document** containing:

#### Required Sections:

1. **Introduction**
   - Purpose and scope
   - Test environment details
   - Testing approach and framework

2. **Test Modules**
   - Module-based organization
   - Test case ID ranges per module
   - Priority and coverage summary

3. **Test Summary Table**
   ```markdown
   | Module | Test Cases | Priority | Status |
   |--------|-----------|----------|--------|
   | Authentication | TC001-TC015 (15) | Critical | Planned |
   | Feature X | TC016-TC025 (10) | High | Planned |
   ```

4. **Test Execution Strategy**
   - Test prioritization (P0, P1, P2, P3)
   - Execution order (Smoke → Regression → Security → Performance)
   - Automation approach

5. **Test Data Requirements**
   - High-level data categories
   - Reference to fixture files

6. **Entry/Exit Criteria**
   - When testing can begin
   - When testing is complete

7. **Risks and Mitigation**
   - Identified risks with impact/probability
   - Mitigation strategies

8. **Deliverables**
   - List of artifacts to be produced
   - Links to related documents

**❌ DO NOT INCLUDE IN TESTPLAN.MD:**
* Detailed test steps
* Expected results for each test case
* Specific test data values
* Screenshots or detailed UI interactions

---

### 10.3 Test Cases Structure (testcases.md)

The test cases document should contain **detailed specifications in enterprise table format**.

#### Test Case Numbering Standard:

**✅ CORRECT:** `TC001`, `TC002`, `TC003`, ..., `TC099`, `TC100`
* Always use 3 digits with leading zeros
* Sequential numbering across all modules
* No prefixes like TC-AUTH-01 or TC_SQ_01

**❌ INCORRECT:** `TC-01`, `TC_1`, `TC-AUTH-001`, `Test01`

#### Required Table Format:

```markdown
## Module X: [Module Name]

| TC ID | Test Case Title | Priority | Type | Preconditions | Test Steps | Expected Results | Test Data |
|-------|----------------|----------|------|---------------|------------|------------------|-----------|
| TC001 | [Title] | Critical | Functional, Smoke | [Preconditions] | 1. Step one<br>2. Step two<br>3. Step three | - Result 1<br>- Result 2<br>- Result 3 | [Data] |
| TC002 | [Title] | High | Functional | [Preconditions] | 1. Step one<br>2. Step two | - Result 1<br>- Result 2 | [Data] |
```

#### Column Definitions:

1. **TC ID**: Test case identifier (TC001, TC002, etc.)
2. **Test Case Title**: Brief, descriptive title
3. **Priority**: Critical, High, Medium, Low
4. **Type**: Functional, Security, Performance, Accessibility, Smoke, Regression, Negative, Integration, etc.
5. **Preconditions**: State required before test execution
6. **Test Steps**: Numbered steps using `<br>` for line breaks
7. **Expected Results**: Bullet points using `<br>` for line breaks
8. **Test Data**: Specific data values or references to fixtures

#### Module Organization:

Group test cases by **functional modules**, not by test type:

**✅ GOOD MODULE STRUCTURE:**
```markdown
## Module 1: Authentication
TC001-TC015 (15 test cases)

## Module 2: User Management
TC016-TC030 (15 test cases)

## Module 3: Dashboard
TC031-TC045 (15 test cases)
```

**❌ BAD MODULE STRUCTURE:**
```markdown
## Smoke Tests
TC001-TC010

## Regression Tests
TC011-TC050

## Security Tests
TC051-TC060
```

#### Test Case Summary:

Always include a summary table at the end:

```markdown
## Test Case Summary

| Module | Test Cases | Priority Breakdown |
|--------|-----------|-------------------|
| Authentication | TC001-TC015 (15) | Critical: 3, High: 5, Medium: 6, Low: 1 |
| User Management | TC016-TC030 (15) | Critical: 2, High: 8, Medium: 4, Low: 1 |
| **TOTAL** | **30** | **Critical: 5, High: 13, Medium: 10, Low: 2** |
```

---

### 10.4 Test Documentation Workflow

When creating test documentation, follow this workflow:

1. **Analyze the Application**
   - Navigate to the application
   - Identify page elements (headers, buttons, inputs, tables)
   - Infer page type and critical user flows

2. **Create Test Modules**
   - Group functionality into logical modules
   - Assign test case ID ranges to each module
   - Determine priority for each module

3. **Write testplan.md**
   - High-level strategy only
   - Module overview with TC ranges
   - Test summary table
   - Execution strategy

4. **Write testcases.md**
   - Detailed test cases in table format
   - One table per module
   - Consistent TC numbering (TC001, TC002, etc.)
   - Complete test steps and expected results

5. **Cross-Reference**
   - Link testplan.md to testcases.md
   - Ensure TC ID ranges match between documents
   - Verify total test case counts are consistent

---

### 10.5 Example Test Module

**In testplan.md:**
```markdown
### Module 1: Authentication
**Test Cases:** TC001 - TC015  
**Priority:** Critical  
**Coverage:**
- Valid/invalid login scenarios
- Security testing (SQL injection, XSS)
- Session management
- Logout functionality
```

**In testcases.md:**
```markdown
## Module 1: Authentication

| TC ID | Test Case Title | Priority | Type | Preconditions | Test Steps | Expected Results | Test Data |
|-------|----------------|----------|------|---------------|------------|------------------|-----------|
| TC001 | Successful Login with Valid Credentials | Critical | Functional, Smoke | User is on login page | 1. Navigate to login page<br>2. Enter username: admin<br>3. Click Continue<br>4. Enter password: Admin123<br>5. Click Log in | - Redirected to dashboard<br>- URL contains /dashboard<br>- User menu visible<br>- No error messages | username: admin<br>password: Admin123 |
| TC002 | Login Failure with Invalid Credentials | Critical | Functional, Negative | User is on login page | 1. Navigate to login page<br>2. Enter username: invaliduser<br>3. Click Continue<br>4. Enter password: wrongpass<br>5. Click Log in | - Error notification displayed<br>- User remains on login page<br>- URL contains /login | username: invaliduser<br>password: wrongpass |
```

---

### 10.6 Test Case Checklist

Before finalizing test documentation, verify:

- [ ] Test plan is high-level strategy only (no detailed steps)
- [ ] Test cases use consistent numbering (TC001, TC002, etc.)
- [ ] All test cases are in enterprise table format
- [ ] Test cases are grouped by functional modules
- [ ] Each module has a clear TC ID range
- [ ] Test summary table is included in both documents
- [ ] Total test case counts match between documents
- [ ] Priority breakdown is provided
- [ ] Test data is specified or referenced
- [ ] Expected results are clear and measurable
- [ ] Cross-references between documents are correct

---