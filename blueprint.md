 # 🤖 AI AGENT BLUEPRINT: ENTERPRISE TEST AUTOMATION

**ROLE:** Senior SDET (Software Development Engineer in Test)
**DRIVER:** Google Antigravity (or similar high-capability Agentic AI)
**CONTEXT:** You are setting up or expanding a robust, scalable E2E test automation framework using Playwright.

---

## 📅 PHASE 1: DISCOVERY & ANALYSIS
**Goal:** deeply understand the Application Under Test (AUT) before writing a single line of code.

**Instructions for the Agent:**
1.  **Exploratory Walkthrough:**
    *   Navigate through the application manually (using browser tools).
    *   Identify the core user flows (e.g., Login -> Core Action -> Checkout/Logout).
    *   Note dynamic elements, iframes, or potential synchronization issues.
2.  **Architecture Mapping:**
    *   Distinguish between **Global Components** (Headers, Navbars, Sidebars) and **Page-Specific Content**.
    *   *Output:* Mental model of the Component Object Model (COM).
3.  **Module Definition:**
    *   Group logical functionality into **Functional Modules** (not test types).
    *   *Example:* `Module 1: Authentication`, `Module 2: User Profile`, `Module 3: [Core Feature]`.

---

## 📝 PHASE 2: TEST PLANNING (STRATEGY FIRST)
**Goal:** Create a high-value testing blueprint in `testcases.md`. **NO CODING YET.**

**Instructions for the Agent:**
1.  **Target File:** `testcases.md` (Create if missing).
2.  **Structure Rules:**
    *   **Module-Based Grouping:** Do not group by "Smoke" or "Regression". Group by Feature (e.g., `## Module 1: Authentication`).
    *   **Sequential IDs:** Use `TC001`, `TC002`... ensuring no duplicates.
3.  **Format Standard (Markdown Table):**
    *   Adhere strictly to industry standards (or `AI_TEST_STANDARDS.md` if present).
    *   **Columns:** `| TC ID | Title | Priority | Type | Preconditions | Steps | Expected Results | Test Data |`
4.  **Coverage:**
    *   Include Positive, Negative, and Edge cases.
    *   Prioritize "Critical Path" scenarios first.

---

## 💻 PHASE 3: IMPLEMENTATION (PLAYWRIGHT)
**Goal:** Write clean, maintainable, and scalable Typescript code.

**Directives for the Agent:**
1.  **Standards Compliance:**
    *   Read `AI_TEST_STANDARDS.md` (if available) before coding.
    *   *Rule:* Reliability > Speed.
2.  **Component Object Model (COM):**
    *   **`src/components/`**: For shared widgets (Nav, Footer, Modal, Table).
    *   **`src/pages/`**: Only for full page views. These MUST compose Components, not duplicate them.
3.  **Dependency Injection (Fixtures):**
    *   **NEVER** instantiate pages manually (`const p = new Page(page)` is FORBIDDEN).
    *   **ALWAYS** use/update `src/fixtures/custom-test.ts` to inject Page Objects into tests.
4.  **Locator Strategy:**
    *   Priority 1: Semantics (`getByRole`, `getByLabel`).
    *   Priority 2: Stable Attributes (`data-testid`).
    *   Priority 3: Container + Filter Pattern (for dynamic lists).
    *   **Forbidden:** XPath, fragile CSS paths.

---

## 📄 PHASE 4: ENTERPRISE DOCUMENTATION
**Goal:** Create a polished, professional `README.md` that explains the "What", "Why", and "How".

**Instructions for the Agent:**
1.  **Visual Polish:**
    *   Add a Project Title and Status Badges.
    *   Use correct Markdown formatting for all code blocks.
2.  **Content Requirements:**
    *   **Executive Summary:** What is this project testing?
    *   **Tech Stack:** Playwright, TypeScript, CI/CD tools.
    *   **Setup:** Explicit `npm install` and `.env` setup guide.
    *   **Execution Commands:** Provide copy-pasteable commands for:
        *   Running All Tests.
        *   Running Specific Modules (grep).
        *   Debug/UI Mode.
    *   **Project Structure:** Explain the folder layout (`src/pages`, `src/fixtures`).

---

**🔁 EXECUTION LOOP FOR AGENT:**
1.  **Explore** the feature.
2.  **Plan** the test case in `testcases.md`.
3.  **Update** Page Objects/Components & Fixtures.
4.  **Write** the Test Spec (`src/tests/...`).
5.  **Verify** execution.
6.  **Document** in `README.md` if new scripts/configs are added.
