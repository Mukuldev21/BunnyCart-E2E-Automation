# BunnyCart E2E Automation

## Project Overview

Bunnycart is a leading online aquarium store in India, specializing in high-grade aquarium supplies, fresh aquatic plants, and accessories. This automation framework ensures the reliability and performance of the Bunnycart e-commerce platform (`https://www.bunnycart.com/`), covering critical user flows such as authentication, product search, cart management, and checkout.

The test suite is built with **Playwright** and **TypeScript**, adhering to the **Component Object Model (COM)** architecture for scalability and maintainability.

## Key Features

*   **Component Object Model (COM)**: Modular architecture separating page logic from test execution.
*   **Strict Typing**: Comprehensive TypeScript definitions for all data fixtures and page objects.
*   **Hybrid Testing Strategy**: Utilizes API calls for data seeding to isolate UI tests and improve execution speed.
*   **Touch Reporter**: Custom HTML dashboard providing visual insights and AI-driven analysis.
*   **Enterprise Standards**: Strictly governed by `AI_TEST_STANDARDS.md` for locator strategies and code quality.

## Tech Stack

*   **Framework**: Playwright
*   **Language**: TypeScript (Node.js)
*   **Configuration**: dotenv

## Prerequisites

*   **Node.js**: v18.0.0 or higher
*   **npm**: Included with Node.js
*   **VS Code**: Recommended for Playwright integration

## Installation

```bash
# Clone the repository
git clone <repository_url>
cd bunnycart

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Configuration

This project requires a `.env` file in the root directory.

1.  Copy the example file:
    ```bash
    cp .env.example .env
    ```

2.  Configure your environment variables:

    ```env
    # Application Config
    BASE_URL="https://www.bunnycart.com/"
    NODE_ENV="test"

    # Test Credentials
    BUNNY_EMAIL="<valid_email>"
    BUNNY_PASSWORD="<valid_password>"
    BUNNY_FIRSTNAME="<firstname>"
    BUNNY_LASTNAME="<lastname>"
    
    # Negative Test Data
    BUNNY_INVALID_EMAIL="<invalid_email>"
    BUNNY_INVALID_PASSWORD="<invalid_password>"
    ```

## Execution

## Execution

**Recommended: Run & Report**
Run all tests and automatically open the Touch Reporter dashboard.
```bash
npm run test:and:report
```

**Standard Execution**
```bash
npm test
```

**Run Specific Module**
```bash
npx playwright test src/tests/auth/
```

**Run by Tag**
Use tags to filter specific test types:
*   `@smoke`: Critical path tests
*   `@auth`: Authentication module tests
*   `@e2e`: End-to-end user flows
*   `@security`: Security and guard verifications

```bash
npx playwright test --grep "@smoke"
```

**Interactive UI Mode**
```bash
npm run test:ui
```

**Debug Mode**
```bash
npx playwright test --debug
```

## Project Structure

```
bunnycart/
├── src/
│   ├── api/            # API wrappers for hybrid testing
│   ├── components/     # Shared UI components (Header, Footer, Cart)
│   ├── fixtures/       # Dependency Injection and test fixtures
│   ├── pages/          # Page Objects (COM implementation)
│   └── tests/          # Test specifications
├── .env                # Environment variables (GitIgnored)
├── AI_TEST_STANDARDS.md # Engineering standards
├── playwright.config.ts # Global configuration
├── testplan.md         # High-level test strategy
└── testcases.md        # Detailed test case specifications
```

## Reporting

## Reporting

### Touch Reporter (Custom Dashboard)
A modern, visual dashboard is generated automatically at `touch-summary.html`.

To view the latest report manually:
```bash
npm run report
```

### Standard Playwright Report
For detailed execution traces and deep debugging:
```bash
npm run report:standard
```

## Documentation

*   **[Test Plan](./testplan.md)**: High-level test strategy and module breakdown.
*   **[Test Cases](./testcases.md)**: Detailed step-by-step test specifications.
*   **[AI Test Standards](./AI_TEST_STANDARDS.md)**: Engineering guidelines and best practices.

---
**Strict Compliance**: All contributions must adhere to the guidelines defined in **[AI_TEST_STANDARDS.md](./AI_TEST_STANDARDS.md)**.

---
**Created by**:  Mukul Dev Mahato - QA Engineer