# BunnyCart E2E Automation Framework

![BunnyCart Cover](./image/bunnycart_cover_image.webp)

[![Playwright](https://img.shields.io/badge/Playwright-v1.49+-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![LambdaTest](https://img.shields.io/badge/LambdaTest-Integreated-blueviolet?style=for-the-badge&logo=lambdatest&logoColor=white)](https://www.lambdatest.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Enterprise-grade automation solution for ensuring the reliability and performance of the BunnyCart e-commerce platform.**

---

## 📋 Project Overview

**BunnyCart** is a premier online store for aquarium supplies. This automation framework is designed to validate critical business flows including **Authentication**, **Product Discovery**, **Checkout**, and **Cart Management** (`https://www.bunnycart.com/`).

Built on **Playwright** and **TypeScript**, the framework adopts the **Component Object Model (COM)** architecture to ensure modularity, scalability, and ease of maintenance across a growing test suite.

---

## 🏗️ Architecture

The framework handles interactions through a strictly typed layer of Page Objects and Components, separating test logic from implementation details.

The framework handles interactions through a strictly typed layer of Page Objects and Components, separating test logic from implementation details.

*   **Test Specifications**: Define the scenarios and utilize Page Objects.
*   **Fixtures**: Inject Page Objects and reusable components into tests.
*   **Page Objects**: Encapsulate page logic, composed of Base Pages and Components.
*   **Components**: Represent reusable UI elements like Headers, Footers, and Carts.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Component Object Model** | Modular design separating page logic from test scripts. |
| **Strict Typing** | Comprehensive TypeScript definitions for all pages, fixtures, and data. |
| **Hybrid Testing** | *Not Implemented*: Currently relying on pure UI interactions (API seeding is planned for future optimization). |
| **Touch Reporter** | Custom HTML dashboard with visual insights and AI analysis. |
| **Cloud Execution** | Seamless integration with **LambdaTest** grid. |
| **Enterprise Standards** | Governed by strictly enforced [AI Test Standards](./docs/AI_TEST_STANDARDS.md). |

---

## 🛠️ Tech Stack

*   **Core Framework**: [Playwright](https://playwright.dev/)
*   **Language**: TypeScript (Node.js)
*   **Config Management**: `dotenv`
*   **Reporting**: Custom Touch Reporter & Playwright HTML

---

## ⚙️ Prerequisites

*   **Node.js**: v18.0.0 or higher
*   **npm**: Bundled with Node.js
*   **LambdaTest Account**: (Optional) For cloud execution

---

## 📦 Installation

```bash
# 1. Clone the repository
git clone <repository_url>
cd bunnycart

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## 🔧 Configuration

The project is config-driven via `.env`.

1.  **Initialize Config**:
    ```bash
    cp .env.example .env
    ```

2.  **Set Variables** (in `.env`):
    ```ini
    # App Config
    BASE_URL="https://www.bunnycart.com/"
    NODE_ENV="test"

    # Test Credentials
    BUNNY_EMAIL="<valid_email>"
    BUNNY_PASSWORD="<valid_password>"
    
    # LambdaTest (Optional)
    LT_USERNAME="<your_username>"
    LT_ACCESS_KEY="<your_access_key>"
    ```

---

## ▶️ Execution Strategies

### 🖥️ Local Execution

| Command | Description |
| :--- | :--- |
| `npm run test:and:report` | **Recommended**: Run all tests & open Touch Reporter. |
| `npm test` | Standard headless execution. |
| `npm run test:ui` | Open interactive UI mode. |
| `npx playwright test --debug` | Run in debug mode. |

### ☁️ LambdaTest Execution (Cloud)

Execute tests on the LambdaTest grid for cross-browser validation.

| Command | Target Module |
| :--- | :--- |
| `npm run test:module1:lt` | **Module 1**: Authentication |
| `npm run test:module2:lt` | **Module 2**: Product Search & Browse |
| `npm run test:lt` | **Full Suite**: All Modules |

> **Note**: Cloud test results are visible on your [LambdaTest Automation Dashboard](https://automation.lambdatest.com/build).

---

## 📊 Reporting

The framework generates multiple report formats to suit different needs.

### Touch Reporter
A modern, visual dashboard generated locally at `touch-summary.html`.
```bash
npm run report
```

### Playwright Standard Report
Deep-dive trace viewer and execution logs.
```bash
npm run report:standard
```

---

## 📂 Project Structure

```bash
bunnycart/
├── src/
│   ├── components/     # Reusable UI components (Header, Cart)
│   ├── fixtures/       # Test fixtures & Dependency Injection
│   ├── pages/          # Page Objects (COM Implementation)
│   └── tests/          # Feature-based Test Specs
├── .env                # Secrets & Config (GitIgnored)
├── AI_TEST_STANDARDS.md # Engineering Guidelines
├── playwright.config.ts # Local Configuration
├── playwright.service.config.ts # LambdaTest Configuration
└── README.md           # Project Documentation
```

---

## 📚 Documentation Links

*   📖 **[Test Plan](./docs/testplan.md)**: Strategy & Scope
*   🧪 **[Test Cases](./docs/testcases.md)**: Detailed Scenarios
*   ⚖️ **[Standards](./docs/AI_TEST_STANDARDS.md)**: Coding Guidelines

---

**Strict Compliance**: All contributions must adhere to the guidelines defined in **[AI_TEST_STANDARDS.md](./docs/AI_TEST_STANDARDS.md)**.

---
*Created by Mukul Dev Mahato - QA Engineer*