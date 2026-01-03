import { test, expect } from '../../fixtures/custom-test';
import { Logger } from '../../utils/Logger';

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
        Logger.step('Starting TC001: Registered User Login');
        Logger.info(`Logging in with ${VALID_EMAIL!}`);

        await loginPage.navigateToLogin();
        await loginPage.login(VALID_EMAIL!, VALID_PASSWORD!);
        Logger.info('Login submitted. Verifying welcome message...');
        await header.verifyWelcomeMessage(FIRST_NAME!, LAST_NAME!);
        Logger.success('TC001 Completed Successfully');
    });

    test('TC002: Login Failure - Invalid Password', async ({ loginPage }) => {
        Logger.step('Starting TC002: Login Failure - Invalid Password');
        await loginPage.navigateToLogin();
        await loginPage.login(INVALID_EMAIL!, INVALID_PASSWORD!);
        Logger.info('Invalid credentials submitted. Verifying error...');
        await loginPage.verifyLoginError();
        Logger.success('TC002 Completed Successfully');
    });

    test('TC003: New User Registration - Success', async ({ page, registerPage, header }) => {
        Logger.step('Starting TC003: New User Registration');

        // 1. Navigate to "Create an Account" link
        await registerPage.navigateToRegister();
        Logger.info('Navigated to Register Page');

        // Generate unique email
        const timestamp = Date.now();
        const uniqueEmail = `testuser${timestamp}@example.com`;
        const firstName = 'test';
        const lastName = `user${timestamp}`;
        const password = 'testUser123#';

        Logger.info(`Registering new user with Email: ${uniqueEmail}`);

        // 2-5. Fill form and Create
        await registerPage.registerNewUser({
            firstName: firstName,
            lastName: lastName,
            email: uniqueEmail,
            password: password,
            mobile: '9876011223' // From codegen
        });
        Logger.info('Registration form submitted');

        // 6. Verify Success (Welcome Message)
        // Codegen: await expect(page.getByRole('listitem').filter({ hasText: 'Welcome, test user12!' }).locator('span')).toBeVisible();
        Logger.step('Verifying Welcome Message...');
        await header.verifyWelcomeMessage(firstName, lastName);
        Logger.success('Welcome Message Verified');

        // 7. Sign Out (as per codegen flow)
        await header.clickSignOut();
        Logger.step('Signed Out. Verifying Redirect...');

        // After sign out, we should be back on home page or logout success
        await expect(page).toHaveURL(/https:\/\/www.bunnycart.com\//);
        Logger.success('TC003 Completed Successfully');
    });

    test('TC004: Forgot Password - Email Trigger', async ({ loginPage, page }) => {
        Logger.step('Starting TC004: Forgot Password');
        await loginPage.navigateToLogin();
        await loginPage.clickForgotPassword();
        Logger.info(`Submitting forgot password for ${VALID_EMAIL!}`);
        await loginPage.submitForgotPassword(VALID_EMAIL!);
        // Validation of "If there is an account..." message
        await expect(page.getByText(/If there is an account associated with/)).toBeVisible();
        Logger.success('TC004 Completed Successfully');
    });

    test('TC005: Login Failure - User Does Not Exist', async ({ loginPage, page }) => {
        Logger.step('Starting TC005: Login Failure - User Does Not Exist');
        await loginPage.navigateToLogin();
        await loginPage.login('nonexistent@test.com', 'RandomPass123');
        Logger.info('Non-existent credentials submitted. Verifying error and URL...');
        await loginPage.verifyLoginError();
        await expect(page).toHaveURL(/.*\/login.*/);
        Logger.success('TC005 Completed Successfully');
    });

    test('TC006: Sign Out Functionality', async ({ loginPage, header, page }) => {
        Logger.step('Starting TC006: Sign Out Functionality');
        await loginPage.navigateToLogin();
        await loginPage.login(VALID_EMAIL!, VALID_PASSWORD!);
        await expect(page.getByRole('link', { name: 'Sign Out' })).toBeVisible();
        Logger.info('Logged in. Attempting sign out...');

        await header.clickSignOut();
        Logger.step('Sign out clicked. Verifying redirect...');
        // Verify redirection to logout success or homepage and correct link state
        await expect(page).toHaveURL(/.*\/logoutSuccess\//);
        await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
        Logger.success('TC006 Completed Successfully');
    });

    test('TC007: Password Validation Rules', async ({ registerPage, page }) => {
        Logger.step('Starting TC007: Password Validation Rules');
        await registerPage.navigateToRegister();
        Logger.info('Attempting registration with weak password...');
        await registerPage.registerNewUser({
            firstName: 'Test', lastName: 'Weak', email: `weak${Date.now()}@test.com`, password: '123'
        });
        // Validation text: "Minimum of different classes of characters in password is 3"
        await expect(page.getByText(/Minimum of different classes/)).toBeVisible();
        Logger.success('TC007 Completed Successfully');
    });

    // test('TC008: Reset Password - Link Validation (Mock)', async ({ }) => {
    //     test.skip('Requires email access or valid reset token generation');
    // });

    test('TC009: Login from Checkout (Guest -> User)', async ({ productPage, page }) => {
        Logger.step('Starting TC009: Login from Checkout');
        // Navigate to a known product (or search if needed)
        // Using a generic URL structure or one found previously.
        // Ideally, navigate to a category and click first item.
        await page.goto('https://www.bunnycart.com/aquarium-plants/background');
        await page.locator('.product-item-info').first().click();

        await productPage.addToCart();
        Logger.info('Product added to cart. Navigating to checkout...');

        await page.goto('https://www.bunnycart.com/checkout/');
        // Click "Sign In" in checkout sidebar/step
        await page.getByRole('button', { name: 'Sign In' }).click();
        Logger.info('Sign In panel opened. Entering credentials...');
        await page.getByRole('textbox', { name: 'Email Address' }).fill(VALID_EMAIL!);
        await page.getByRole('textbox', { name: 'Password' }).fill(VALID_PASSWORD!);
        await page.getByRole('button', { name: 'Sign In' }).click();

        // Verify logged in state (e.g. Email displayed)
        await expect(page.getByText(VALID_EMAIL!)).toBeVisible();
        Logger.success('TC009 Completed Successfully');
    });

    test('TC010: My Account - Address Book', async ({ loginPage, myAccountPage, page }) => {
        Logger.step('Starting TC010: My Account - Address Book');
        await loginPage.navigateToLogin();
        await loginPage.login(VALID_EMAIL!, VALID_PASSWORD!);

        await myAccountPage.navigateToAddressBook();
        Logger.info('Navigated to Address Book. Adding new address...');
        await myAccountPage.addNewAddress({
            firstName: 'Test', lastName: 'Addr', phone: '1234567890',
            street: '123 Tester St', city: 'Test City', zip: '12345', country: 'IN'
        });
        await myAccountPage.verifyAddressSaved();
        Logger.success('TC010 Completed Successfully');
    });

});
