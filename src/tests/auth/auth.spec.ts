import { test, expect } from '../../fixtures/custom-test';

import dotenv from 'dotenv';
import path from 'path';

// Load env vars explicitly to ensure availability
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const VALID_EMAIL = process.env.BUNNY_EMAIL;
const VALID_PASSWORD = process.env.BUNNY_PASSWORD;
const FIRST_NAME = process.env.BUNNY_FIRSTNAME;
const LAST_NAME = process.env.BUNNY_LASTNAME;
const INVALID_EMAIL = process.env.BUNNY_INVALID_EMAIL;
const INVALID_PASSWORD = process.env.BUNNY_INVALID_PASSWORD;

test.describe('Module 1: Authentication & User Management', () => {
    // ⚠️ DISABLE storage state for this suite to ensure clean authentication flows
    test.use({ storageState: { cookies: [], origins: [] } });

    test('TC001: Registered User Login - Success', async ({ page, loginPage, header }) => {
        console.log(`Logging in with ${VALID_EMAIL!}`);

        await loginPage.navigateToLogin();
        await loginPage.login(VALID_EMAIL!, VALID_PASSWORD!);
        await header.verifyWelcomeMessage(FIRST_NAME!, LAST_NAME!);
    });

    test('TC002: Login Failure - Invalid Password', async ({ loginPage }) => {
        await loginPage.navigateToLogin();
        await loginPage.login(INVALID_EMAIL!, INVALID_PASSWORD!);
        await loginPage.verifyLoginError();
    });

    test('TC003: New User Registration - Success', async ({ page, registerPage }) => {
        // 1. Navigate to "Create an Account" link
        await registerPage.navigateToRegister();


        // Generate unique email
        const uniqueEmail = `bunny_test_${Date.now()}@example.com`;
        const password = 'TestUser@123';

        // 2-5. Fill form and Create
        await registerPage.registerNewUser({
            firstName: 'Test',
            lastName: 'User',
            email: uniqueEmail,
            password: password
        });

        // 6. Verify Success
        await registerPage.verifyRegistrationSuccess();

        // Verify logged in state
        await expect(page.getByText('Thank you for registering')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Sign Out' })).toBeVisible();
    });

    test('TC004: Forgot Password - Email Trigger', async ({ loginPage, page }) => {
        await loginPage.navigateToLogin();
        await loginPage.clickForgotPassword();
        await loginPage.submitForgotPassword(VALID_EMAIL!);
        // Validation of "If there is an account..." message
        await expect(page.getByText(/If there is an account associated with/)).toBeVisible();
    });

    test('TC005: Login Failure - User Does Not Exist', async ({ loginPage, page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login('nonexistent@test.com', 'RandomPass123');
        await loginPage.verifyLoginError();
        await expect(page).toHaveURL(/.*\/login.*/);
    });

    test('TC006: Sign Out Functionality', async ({ loginPage, header, page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login(VALID_EMAIL!, VALID_PASSWORD!);
        await expect(page.getByRole('link', { name: 'Sign Out' })).toBeVisible();

        await header.clickSignOut();
        // Verify redirection to logout success or homepage and correct link state
        await expect(page).toHaveURL(/.*\/logoutSuccess\//);
        await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    });

    test('TC007: Password Validation Rules', async ({ registerPage, page }) => {
        await registerPage.navigateToRegister();
        await registerPage.registerNewUser({
            firstName: 'Test', lastName: 'Weak', email: `weak${Date.now()}@test.com`, password: '123'
        });
        // Validation text: "Minimum of different classes of characters in password is 3"
        await expect(page.getByText(/Minimum of different classes/)).toBeVisible();
    });

    // test('TC008: Reset Password - Link Validation (Mock)', async ({ }) => {
    //     test.skip('Requires email access or valid reset token generation');
    // });

    test('TC009: Login from Checkout (Guest -> User)', async ({ productPage, page }) => {
        // Navigate to a known product (or search if needed)
        // Using a generic URL structure or one found previously. 
        // Ideally, navigate to a category and click first item.
        await page.goto('https://www.bunnycart.com/aquarium-plants/background');
        await page.locator('.product-item-info').first().click();

        await productPage.addToCart();

        await page.goto('https://www.bunnycart.com/checkout/');
        // Click "Sign In" in checkout sidebar/step
        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.getByRole('textbox', { name: 'Email Address' }).fill(VALID_EMAIL!);
        await page.getByRole('textbox', { name: 'Password' }).fill(VALID_PASSWORD!);
        await page.getByRole('button', { name: 'Sign In' }).click();

        // Verify logged in state (e.g. Email displayed)
        await expect(page.getByText(VALID_EMAIL!)).toBeVisible();
    });

    test('TC010: My Account - Address Book', async ({ loginPage, myAccountPage, page }) => {
        await loginPage.navigateToLogin();
        await loginPage.login(VALID_EMAIL!, VALID_PASSWORD!);

        await myAccountPage.navigateToAddressBook();
        await myAccountPage.addNewAddress({
            firstName: 'Test', lastName: 'Addr', phone: '1234567890',
            street: '123 Tester St', city: 'Test City', zip: '12345', country: 'IN'
        });
        await myAccountPage.verifyAddressSaved();
    });

});
