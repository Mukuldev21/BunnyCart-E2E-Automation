# Test Plan: BunnyCart E2E Automation

## 1. Introduction
**Purpose:** This document outlines the high-level test strategy for the BunnyCart e-commerce application. The goal is to ensure the core functionalities, including product discovery, user management, and the checkout process, work as expected.  
**Scope:** Functional testing of the web application key modules.  
**Framework:** Playwright with TypeScript.  
**Environment:** QA/Staging (URL: https://www.bunnycart.com/)

## 2. Test Modules

### Module 1: Authentication & User Management
**Test Cases:** TC001 - TC010  
**Priority:** High  
**Coverage:**
- User Registration (Sign up)
- Login (Sign in) with valid/invalid credentials
- Forgot Password flows
- My Account dashboard access

### Module 2: Product Search & Browse
**Test Cases:** TC011 - TC025  
**Priority:** Critical  
**Coverage:**
- Global Search functionality
- Category Navigation (e.g., Aquatic Plants, Foreground)
- Product Listing Pages (PLP) sorting and filtering
- Pagination and grid/list views

### Module 3: Product Details (PDP)
**Test Cases:** TC026 - TC035  
**Priority:** Critical  
**Coverage:**
- Product information display (Title, Price, Stock)
- Product Option selection (e.g., Net Pot, Portion)
- "Add to Cart" functionality
- Image gallery interaction
- Reviews/Tabs visibility

### Module 4: Shopping Cart
**Test Cases:** TC036 - TC045  
**Priority:** Critical  
**Coverage:**
- Mini-cart pop-over interaction
- Cart Page access
- Updating item quantities
- Removing items from cart
- Subtotal calculation
- "Proceed to Checkout" navigation

### Module 5: Checkout End-to-End
**Test Cases:** TC046 - TC060  
**Priority:** Critical  
**Coverage:**
- Guest Checkout flow
- Registered User Checkout flow
- Shipping Address entry
- Shipping Method selection
- Payment Method alignment (UI check only)
- Order placement confirmation

## 3. Test Summary Table

| Module | Test Cases | Priority | Status |
|--------|-----------|----------|--------|
| Authentication | TC001-TC010 (10) | High | Planned |
| Search & Browse | TC011-TC025 (15) | Critical | Planned |
| Product Details (PDP) | TC026-TC035 (10) | Critical | Planned |
| Shopping Cart | TC036-TC045 (10) | Critical | Planned |
| Checkout E2E | TC046-TC060 (15) | Critical | Planned |
| **TOTAL** | **60** | **Critical, High** | **Planned** |

## 4. Test Execution Strategy
- **Prioritization:** Critical paths (Checkout, Cart, PDP) are prioritized (P0). Authentication is High (P1).
- **Execution Order:** 
    1. Smoke Test (Critical flows: Homepage -> Product -> Cart -> Checkout)
    2. Functional Regression (Detailed module testing)
    3. UI/Responsiveness
- **Automation Approach:** 
    - Use Playwright with Page Object Model (POM).
    - Data-driven tests for PLP/PDP variations.
    - Component-based architecture for reused widgets (Header, Mini-cart).

## 5. Test Data Requirements
- **Users:** Test accounts (Registered User), unique emails for Sign Up tests.
- **Products:** In-stock products, Out-of-stock products, Products with options.
- **Configuration:** Valid shipping addresses.

## 6. Entry/Exit Criteria
- **Entry:** Environment is accessible, critical blockers are resolved.
- **Exit:** 100% of Critical/High priority tests passed or have accepted workarounds.

## 7. Risks and Mitigation
- **Risk:** Third-party payment gateway restrictions in test mode.
    - **Mitigation:** Verify up to the payment step or use test cards if supported.
- **Risk:** Inventory fluctuation.
    - **Mitigation:** Use products known to be in stock or mock inventory APIs if possible.

## 8. Deliverables
- `testplan.md` (This strategy document)
- `testcases.md` (Detailed specifications)
- Playwright Test Suite (Code)
- Execution Reports
