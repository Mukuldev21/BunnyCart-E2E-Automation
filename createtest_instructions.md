# INSTRUCTIONS FOR CREATING TESTS

This document enables agents (and developers) to create high-quality, maintainable Playwright tests that adhere to the project's strict `AI_TEST_STANDARDS.md`.

## 1. PRE-REQUISITES (CRITICAL)

Before writing a single line of code:
1.  **Read Standards**: Review `AI_TEST_STANDARDS.md`. Pay attention to Locator Strategy (Cascade Rule) and Dependency Injection.
2.  **Analyze UI**: Identify the Pages and Components involved in the test.

---

## 2. UPDATE COMPONENT OBJECT MODEL (COM)

Do not write monolithic Page Objects. Use Composition.

### A. Update `src/components`
**When to use:** For reusable UI widgets (Headers, NavBars, Tables, Modals).
*   **Check**: Does a component already exist? (e.g., `Header.ts`)
*   **Create/Update**: If not, create it. If yes, add missing locators/methods.
*   **Code Style**:
    ```typescript
    import { Page, Locator } from '@playwright/test';

    export class Header {
        readonly page: Page;
        readonly cartIcon: Locator;

        constructor(page: Page) {
            this.page = page;
            this.cartIcon = page.getByRole('link', { name: 'Cart' });
        }

        async navigateToCart() {
            await this.cartIcon.click();
        }
    }
    ```

### B. Update `src/pages`
**When to use:** For a specific URL or Route.
*   **Structure**: Pages should *compose* components.
*   **Action**: Create a new class or update an existing one in `src/pages`.
*   **Code Style**:
    ```typescript
    import { Page } from '@playwright/test';
    import { Header } from '../components/Header'; // Import Component

    export class ProductPage {
        readonly page: Page;
        readonly header: Header; // Declare Component

        constructor(page: Page) {
            this.page = page;
            this.header = new Header(page); // Instantiate Component
        }

        async addToCart() {
             // ... implementation
        }
    }
    ```

---

## 3. UPDATE FIXTURES (DEPENDENCY INJECTION)

**CRITICAL RULE:** NEVER instantiate Page Objects manually in a test file (e.g., `new LoginPage(page)`). You MUST use the fixture system.

### Action: Update `src/fixtures/custom-test.ts`
1.  **Import** your new Page Object.
2.  **Add** it to the `MyFixtures` type definition.
3.  **Initialize** it in the `test` extension.

**Example Update:**

```typescript
// src/fixtures/custom-test.ts
import { test as base } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage'; // [NEW IMPORT]

type MyFixtures = {
    // ... existing fixtures
    productPage: ProductPage; // [NEW TYPE]
};

export const test = base.extend<MyFixtures>({
    // ... existing inits
    
    // [NEW INITIALIZATION]
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
});
export { expect } from '@playwright/test';
```

---

## 4. CREATE THE TEST SPEC

**Location:** `src/tests/<module>/<feature>.spec.ts`

### Rules:
1.  **Import**: Import `test` and `expect` from `src/fixtures/custom-test` (NOT `@playwright/test`).
2.  **Use Fixture**: Destructure the page object from the test arguments.
3.  **Locators**: Use strict priority: `getByRole` > `getByTestId` > `Container + Filter`. NO XPath.

**Example Spec:**

```typescript
import { test, expect } from '../../fixtures/custom-test'; // Correct Import

test('TC001: Add Product to Cart', async ({ productPage }) => { // Inject Fixture
    // ARRANCE
    await productPage.navigateTo('blue-shoes');

    // ACT
    await productPage.addToCart();

    // ASSERT
    await expect(productPage.header.cartIcon).toBeVisible();
});
```

---

## 5. SUMMARY CHECKLIST

- [ ] Page Object created/updated in `src/pages`?
- [ ] Shared components extracted to `src/components`?
- [ ] Fixture registered in `src/fixtures/custom-test.ts`?
- [ ] Test spec uses injected fixture (no `new Page(...)`)?
- [ ] Locators follow the "Cascade Rule" (Semantics first)?
