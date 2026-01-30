# 🤖 AI AGENT BLUEPRINT: ENTERPRISE TEST AUTOMATION

**OPTIMIZED FOR:** Google Antigravity (Advanced AI Agent)  
**FRAMEWORK:** Playwright + TypeScript  
**APPROACH:** Incremental, Artifact-Based, Browser-Powered

---

## 📋 APPLICATION CONFIGURATION

> [!IMPORTANT]
> **Specify the application URL before starting.** The AI agent will use this for exploration and testing.

**Application URL:** `https://www.bunnycart.com`

---

## 🎯 AGENT CAPABILITIES OVERVIEW

As Google Antigravity, you have powerful capabilities that should be leveraged:

* **Browser Automation:** Use `browser_subagent` tool to explore applications, capture screenshots, and record interactions
* **Parallel Execution:** Create multiple files simultaneously when there are no dependencies
* **Artifact System:** Create structured documentation in the artifact directory for user review
* **Incremental Generation:** Generate code module-by-module to avoid token limits
* **Visual Proof:** Capture screenshots and recordings to demonstrate test execution

---

## 📋 WORKFLOW PHILOSOPHY

**CRITICAL PRINCIPLES:**

1. **Explore First, Code Later:** Never write tests without thoroughly understanding the application
2. **Incremental Everything:** Generate one module at a time, one test at a time
3. **User Checkpoints:** Stop and ask for confirmation at key decision points
4. **Artifact-Centric:** Document all plans and progress in artifacts for transparency
5. **Visual Validation:** Use browser recordings and screenshots as proof of work
6. **Parallel When Safe:** Create multiple files simultaneously if no dependencies exist

---

## 📅 PHASE 1: DISCOVERY & ANALYSIS (Browser-Powered)

**Goal:** Deeply understand the Application Under Test (AUT) through automated exploration.

### Step 1.1: Browser-Based Application Exploration

> [!NOTE]
> Use the **Application URL** from the [Project Configuration](#-project-configuration) section above.

**Use the `browser_subagent` tool to:**

1. **Navigate the Application:**
   ```
   Task: "Open [APPLICATION_URL from config], explore all navigation menus, click through major sections,
   capture screenshots of each page, and return a summary of all discovered pages and features."
   ```

2. **Capture Visual Documentation:**
   - Take screenshots of key pages (login, dashboard, main features)
   - Record user workflows (login flow, CRUD operations)
   - Note dynamic elements, modals, popups

3. **Identify UI Elements:**
   - Headers, navigation bars, sidebars
   - Forms, buttons, inputs, dropdowns
   - Tables, grids, lists
   - Modals, dialogs, notifications

### Step 1.2: Application Structure Mapping

Create a structured map of the application (can be in artifact or notes):

```markdown
## Application: [Name]

### Authentication
- Login page: /login
- Logout: Header dropdown
- Session timeout: 30 minutes

### Main Navigation
- Dashboard: /dashboard (landing page)
- [Feature 1]: /feature1 (list, create, edit, delete)
- [Feature 2]: /feature2 (specific workflows)
- Settings: /settings (user preferences, admin)

### Key Workflows
1. Login → Dashboard → [Core Action] → Logout
2. [Feature-specific workflow]

### Dynamic Elements
- Modals: Confirmation dialogs, forms
- Notifications: Toast messages, alerts
- Loading states: Spinners, skeleton screens
```

### Step 1.3: Module Discovery (Application-Specific)

> [!IMPORTANT]
> **DO NOT use predefined module templates.** Discover modules based on ACTUAL application structure.

**Process:**

1. **Identify Functional Areas** from exploration
2. **Group Related Features** into logical modules
3. **Estimate Test Case Counts** per module (see AI_TEST_STANDARDS.md Section 11.3)
4. **Prioritize Modules** (Critical → High → Medium → Low)

**Example Output:**

```markdown
## Discovered Modules

- Module 1: Authentication & Session Management (15 test cases) - Critical
- Module 2: Patient Registration & Search (14 test cases) - Critical
- Module 3: Appointment Scheduling (12 test cases) - High
- Module 4: Clinical Visits & Forms (10 test cases) - High
- Module 5: Reports & Analytics (8 test cases) - Medium
```

### Step 1.4: Architecture Planning (Component Object Model)

**Identify:**

* **Global Components:** Header, Navbar, Sidebar, Footer (reused across pages)
* **Shared Components:** Modals, DataTables, DatePickers, SearchBoxes
* **Page Objects:** Full page representations (LoginPage, DashboardPage, etc.)

**Output:** Mental model or document for COM structure

---

## 📝 PHASE 2: TEST PLANNING (Incremental & Artifact-Based)

**Goal:** Create comprehensive test documentation WITHOUT writing code yet.

### Step 2.1: Create Test Plan Artifact

**File:** `testplan.md` (high-level strategy document)

**Content:**
- Introduction and scope
- Test modules with TC ID ranges
- Test summary table
- Execution strategy
- Entry/Exit criteria
- Risks and mitigation

**Reference:** AI_TEST_STANDARDS.md Section 10.2 for structure

### Step 2.2: Generate Test Cases (Module-by-Module)

> [!CAUTION]
> **NEVER generate all test cases at once.** This WILL exceed token limits.

**Incremental Workflow:**

1. **Generate Module 1 ONLY** in `testcases.md`
   - Use enterprise table format (see AI_TEST_STANDARDS.md Section 10.3)
   - Include: TC ID, Title, Priority, Type, Preconditions, Steps, Expected Results, Test Data

2. **STOP and ask user:**
   ```
   ✅ Module 1: Authentication (TC001-TC015) generated successfully.
   
   Next modules to generate:
   - Module 2: [Name] (X test cases)
   - Module 3: [Name] (X test cases)
   
   Which module should I generate next? (or type 'all' to continue with remaining modules)
   ```

3. **Generate next module** after user confirmation
   - Read existing `testcases.md` to find last TC ID
   - Append new module (do NOT regenerate entire file)
   - Continue sequential numbering

4. **Repeat** until all modules complete

5. **Finalize** with test case summary table

**Reference:** AI_TEST_STANDARDS.md Section 11.2-11.3 for detailed workflow

---

## 💻 PHASE 3: IMPLEMENTATION (Parallel & Efficient)

**Goal:** Write clean, maintainable Playwright code following strict standards.

### Step 3.1: Read Standards (CRITICAL)

**Before writing ANY code:**
- Read `AI_TEST_STANDARDS.md` completely
- Pay special attention to:
  - Locator Strategy (Section 1)
  - Component Object Model (Section 2)
  - Fixtures & Dependency Injection (Section 3)
  - Authentication & Storage State (Section 7)
  - Wait Strategies (Section 8)

### Step 3.2: Setup Project Structure (Parallel Creation)

**Create folders and base files simultaneously:**

```typescript
// Create in parallel (no dependencies):
- src/components/
- src/pages/
- src/tests/
- src/fixtures/custom-test.ts
- src/api/ (if needed)
- playwright.config.ts
- .env.example
```

### Step 3.3: Create BasePage Foundation (MANDATORY)

**CRITICAL:** Before implementing any Page Objects or Components, create the `BasePage` class.

**File:** `src/pages/BasePage.ts`

**Why BasePage First:**
- Provides optimized utilities for all pages
- Ensures consistent wait strategies (30-40% faster tests)
- Centralizes timeout configuration
- Eliminates redundant code across pages

**Implementation:**

1. **Create BasePage with:**
   - Optimized navigation methods (default to `domcontentloaded`)
   - Smart wait utilities (`waitForElement`, `waitForElementHidden`)
   - Reusable action methods (`click`, `fill`, `selectOption`, `getText`)
   - Assertion helpers (`verifyVisible`, `verifyHidden`, `verifyText`, `verifyURL`)
   - Centralized timeouts (`DEFAULT_TIMEOUT`, `SHORT_TIMEOUT`, `LONG_TIMEOUT`)

2. **Reference:** See AI_TEST_STANDARDS.md Section 2.1 for complete BasePage implementation

**Example BasePage.ts (Minimal):**

```typescript
import { type Page, type Locator, expect } from '@playwright/test';

export class BasePage {
    protected readonly page: Page;
    protected readonly DEFAULT_TIMEOUT = 10000;
    protected readonly SHORT_TIMEOUT = 5000;
    protected readonly LONG_TIMEOUT = 30000;

    constructor(page: Page) {
        this.page = page;
    }

    // Optimized navigation (domcontentloaded is 2-3s faster than 'load')
    async navigateTo(url: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded') {
        await this.page.goto(url, { waitUntil });
    }

    // Smart waits
    async waitForElement(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    // Reusable actions
    async click(locator: Locator, options?: { timeout?: number }) {
        await locator.click({ timeout: options?.timeout || this.DEFAULT_TIMEOUT });
    }

    async fill(locator: Locator, value: string, timeout: number = this.DEFAULT_TIMEOUT) {
        await locator.fill(value, { timeout });
    }

    async selectOption(locator: Locator, value: string | string[], timeout: number = this.DEFAULT_TIMEOUT) {
        await locator.selectOption(value, { timeout });
    }

    // Assertion helpers
    async verifyVisible(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT) {
        await expect(locator).toBeVisible({ timeout });
    }

    async verifyText(locator: Locator, text: string | RegExp, timeout: number = this.DEFAULT_TIMEOUT) {
        await expect(locator).toContainText(text, { timeout });
    }

    async verifyURL(pattern: string | RegExp, timeout: number = this.DEFAULT_TIMEOUT) {
        await expect(this.page).toHaveURL(pattern, { timeout });
    }

    // Utility methods
    async getCurrentURL(): Promise<string> {
        return this.page.url();
    }

    async wait(ms: number) {
        await this.page.waitForTimeout(ms);
    }
}
```

**Performance Impact:**
- Direct navigation: 3-5s saved per test
- Element-based waits: 2-3s saved per test
- Optimized timeouts: 1-2s saved per test
- **Total: 30-40% faster test execution**

### Step 3.4: Implement Component Object Model (Bottom-Up)

**Order of Implementation:**

1. **Shared Components First** (can be created in parallel):
   - `src/components/Header.ts` (extends BasePage)
   - `src/components/Navbar.ts` (extends BasePage)
   - `src/components/Modal.ts` (extends BasePage)
   - `src/components/DataTable.ts` (extends BasePage)

2. **Page Objects Second** (compose components):
   - `src/pages/LoginPage.ts` (extends BasePage, uses Header if applicable)
   - `src/pages/DashboardPage.ts` (extends BasePage, uses Header, Navbar, etc.)
   - `src/pages/[Feature]Page.ts` (extends BasePage)

3. **Update Fixtures** (`src/fixtures/custom-test.ts`):
   - Import all page objects
   - Add to `MyFixtures` type
   - Initialize in `test.extend()`

**Example Page Object extending BasePage:**

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        super(page);  // MUST call BasePage constructor
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
    }

    async navigateToLogin() {
        // Use BasePage's optimized navigateTo
        await this.navigateTo('/login');
    }

    async login(email: string, password: string) {
        // Use BasePage's fill and click methods
        await this.fill(this.emailInput, email);
        await this.fill(this.passwordInput, password);
        await this.click(this.signInButton);
    }

    async verifyLoginSuccess() {
        // Use BasePage's verifyURL
        await this.verifyURL(/.*dashboard/, this.DEFAULT_TIMEOUT);
    }
}
```

**Reference:** AI_TEST_STANDARDS.md Section 2 for COM architecture

### Step 3.5: Implement Tests (One Module at a Time)

**Module-by-Module Approach:**

1. **Select Module 1** (e.g., Authentication)

2. **Create test file:** `src/tests/auth/auth.spec.ts`

3. **Implement ONE test at a time:**
   ```bash
   # Write TC001
   # Run ONLY TC001: npx playwright test --grep="TC001"
   # Fix if needed
   # Move to TC002 only after TC001 passes
   ```

4. **STOP after module complete** and ask user:
   ```
   ✅ Module 1: Authentication tests (TC001-TC015) implemented and verified.
   
   Which module should I implement next?
   ```

5. **Repeat** for next module

**Benefits:**
- Easier debugging (one test at a time)
- Faster feedback loop
- Prevents cascading failures
- Builds confidence incrementally

**Reference:** AI_TEST_STANDARDS.md Section 10 for checklist

### Step 3.5: Authentication & Global Setup

**Setup Project:**

1. **Create `tests/auth.setup.ts`** for storage state
2. **Configure `playwright.config.ts`** with setup project
3. **Override storage state** for auth tests:
   ```typescript
   // In auth.spec.ts
   test.use({ storageState: { cookies: [], origins: [] } });
   ```

**Reference:** AI_TEST_STANDARDS.md Section 7 for authentication patterns

---

## ✅ PHASE 4: VERIFICATION & VALIDATION

**Goal:** Prove that tests work through automated execution and visual evidence.

### Step 4.1: Execute Tests

**Run tests and capture output:**

```bash
# Run all tests
npx playwright test

# Run specific module
npx playwright test tests/auth/auth.spec.ts

# Run with UI mode for debugging
npx playwright test --ui

# Generate HTML report
npx playwright show-report
```

### Step 4.2: Browser Recording (Proof of Work)

**Use `browser_subagent` to:**

1. **Record test execution:**
   ```
   Task: "Navigate to [APP_URL], execute the login flow as defined in TC001,
   record the entire interaction, and capture screenshots of key steps."
   RecordingName: "login_flow_demo"
   ```

2. **Capture success states:**
   - Successful login (dashboard visible)
   - Successful CRUD operations
   - Proper error handling

3. **Save recordings** to artifact directory for user review

### Step 4.3: Create Walkthrough Artifact

**File:** `walkthrough.md` (proof of work document)

**Content:**
- Summary of what was implemented
- Test execution results
- Screenshots of passing tests
- Browser recordings embedded
- Known issues or limitations
- Next steps (if any)

**Use markdown features:**
- Embed screenshots: `![Login Success](path/to/screenshot.png)`
- Embed recordings: `![Test Execution](path/to/recording.webp)`
- Use tables for test results
- Use alerts for important notes

---

## 📄 PHASE 5: DOCUMENTATION & HANDOFF

**Goal:** Provide comprehensive documentation for maintainability.

### Step 5.1: Generate README.md

**Content:**

1. **Project Overview**
   - What application is being tested
   - Test coverage summary

2. **Tech Stack**
   - Playwright, TypeScript, Node.js versions
   - Key dependencies

3. **Setup Instructions**
   ```bash
   # Clone repository
   # Install dependencies
   npm install
   
   # Setup environment variables
   cp .env.example .env
   # Edit .env with actual values
   ```

4. **Execution Commands**
   ```bash
   # Run all tests
   npx playwright test
   
   # Run specific module
   npx playwright test tests/auth/
   
   # Run with UI mode
   npx playwright test --ui
   
   # Generate report
   npx playwright show-report
   ```

5. **Project Structure**
   ```
   src/
   ├── components/     # Reusable UI components
   ├── pages/          # Page objects
   ├── tests/          # Test specs
   ├── fixtures/       # Custom fixtures
   └── api/            # API helpers
   ```

6. **Test Modules**
   - List all modules with TC ranges
   - Link to testcases.md

7. **Contributing Guidelines**
   - How to add new tests
   - Coding standards reference

### Step 5.2: Organize Artifacts

**Ensure all artifacts are in place:**

- [ ] `testplan.md` - High-level strategy
- [ ] `testcases.md` - Detailed test cases
- [ ] `walkthrough.md` - Proof of work
- [ ] `README.md` - Setup and execution guide
- [ ] Screenshots and recordings (if applicable)

### Step 5.3: User Handoff Checklist

**Before completing, verify:**

- [ ] All tests are passing
- [ ] Documentation is complete and accurate
- [ ] `.env.example` is provided (no secrets committed)
- [ ] `package.json` has all dependencies
- [ ] `playwright.config.ts` is properly configured
- [ ] Project structure follows standards
- [ ] User can run tests with provided commands
- [ ] Known issues are documented

---

## 🚀 AI-SPECIFIC BEST PRACTICES

### Parallel vs Sequential Tool Execution

**✅ Execute in Parallel (No Dependencies):**
- Creating multiple component files
- Creating multiple page object files
- Reading multiple documentation files
- Searching for different patterns

**❌ Execute Sequentially (Has Dependencies):**
- Create fixture → then create test (test needs fixture)
- Read file → then edit file (need to see content first)
- Create page object → then update fixture (fixture imports page)
- Run test → then analyze results (need output first)

### Browser Automation Guidelines

**When to use `browser_subagent`:**

✅ **DO use for:**
- Initial application exploration
- Capturing screenshots for documentation
- Recording test execution demos
- Visual verification of UI changes
- Understanding complex user workflows

❌ **DON'T use for:**
- Every single test execution (use `npx playwright test` instead)
- Simple file operations
- Code generation
- Reading documentation

### Artifact Management

**Artifact Directory:** `C:\Users\Asus\.gemini\antigravity\brain\<conversation-id>\`

**Best Practices:**
- Create `implementation_plan.md` during PLANNING mode
- Create `walkthrough.md` after VERIFICATION
- Keep artifacts concise and scannable
- Use markdown formatting (tables, alerts, code blocks)
- Embed screenshots and recordings for visual proof

### User Interaction Patterns

**When to use `notify_user`:**

✅ **DO use when:**
- Requesting review of implementation plan
- Asking which module to generate next
- Blocked on user decision (API endpoints, credentials)
- Requesting review of completed work (walkthrough)

❌ **DON'T use when:**
- Just providing status updates (use task_boundary instead)
- Asking obvious questions (make reasonable assumptions)
- Every single step (batch questions together)

**Pattern for module generation:**
```
✅ Module X: [Name] (TC###-TC###) generated successfully.

Next modules to generate:
- Module Y: [Name] (X test cases)
- Module Z: [Name] (X test cases)

Which module should I generate next?
```

### Task Boundary Usage

**Update task_boundary to:**
- Communicate progress to user
- Group related tool calls
- Provide transparency

**TaskName should be granular:**
- ✅ "Implementing Authentication Module"
- ✅ "Generating Test Cases for User Management"
- ❌ "Creating Tests" (too broad)

---

## ⚡ WORKFLOW OPTIMIZATION TIPS

### Batch Operations

**Group similar operations:**
```typescript
// Instead of creating files one by one:
// Create all components in parallel
// Create all pages in parallel
// Create all test files for a module in parallel (if independent)
```

### Avoid Redundant Explorations

**Cache application structure:**
- After initial exploration, document the structure
- Reference the documentation for subsequent modules
- Only re-explore if application changes

### Reuse Page Objects Across Modules

**Don't duplicate:**
- If `LoginPage` is used in multiple modules, create it once
- Share components across pages
- Update fixtures once, use everywhere

### Incremental Verification

**Don't wait until the end:**
- Verify each test as you write it
- Run one test at a time during development
- Fix issues immediately before moving forward
- Only run full suite at the end

---

## 🔁 EXECUTION LOOP SUMMARY

**For each module:**

1. **Explore** the feature (if not already done in Phase 1)
2. **Plan** test cases in `testcases.md` (one module at a time)
3. **STOP** - Ask user which module to implement next
4. **Implement** Page Objects/Components (parallel when possible)
5. **Update** Fixtures
6. **Write** Test Specs (one test at a time)
7. **Verify** each test individually
8. **STOP** - Ask user which module to implement next
9. **Repeat** until all modules complete
10. **Document** in `walkthrough.md` with visual proof

---

## 📚 REFERENCE DOCUMENTS

**Always consult these before coding:**

- **`AI_TEST_STANDARDS.md`** - Comprehensive coding standards and best practices
- **`createtest_instructions.md`** - Step-by-step test creation workflow
- **`testplan.md`** - High-level test strategy (created in Phase 2)
- **`testcases.md`** - Detailed test specifications (created in Phase 2)

---

## ✨ SUCCESS CRITERIA

**A successful test automation project has:**

- [ ] Thorough application exploration with visual documentation
- [ ] Application-specific modules (not generic templates)
- [ ] Complete test documentation (testplan.md, testcases.md)
- [ ] Clean, maintainable code following COM architecture
- [ ] Fixtures-based dependency injection (no manual instantiation)
- [ ] All tests passing with proof (screenshots, recordings)
- [ ] Comprehensive README with setup and execution instructions
- [ ] Organized artifacts for user review
- [ ] User handoff checklist completed

---

**Remember:** Quality > Speed. Incremental > All-at-once. Visual Proof > Claims.