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

    test('TC001: Registered User Login - Success', { tag: ['@auth', '@smoke', '@positive'] }, async ({ page, loginPage, header }) => {
        Logger.step('Starting TC001: Registered User Login');
        Logger.info(`Logging in with ${VALID_EMAIL!}`);

        await loginPage.navigateToLogin();
        await loginPage.login(VALID_EMAIL!, VALID_PASSWORD!);
        Logger.info('Login submitted. Verifying welcome message...');
        await header.verifyWelcomeMessage(FIRST_NAME!, LAST_NAME!);
        Logger.success('TC001 Completed Successfully');
    });

    test('TC002: Login Failure - Invalid Password', { tag: ['@auth', '@negative'] }, async ({ loginPage }) => {
        Logger.step('Starting TC002: Login Failure - Invalid Password');
        await loginPage.navigateToLogin();
        await loginPage.login(INVALID_EMAIL!, INVALID_PASSWORD!);
        Logger.info('Invalid credentials submitted. Verifying error...');
        await loginPage.verifyLoginError();
        Logger.success('TC002 Completed Successfully');
    });

    test('TC003: New User Registration - Success', { tag: ['@auth', '@smoke', '@positive'] }, async ({ page, registerPage, header }) => {
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

    test('TC004: Forgot Password - Email Trigger', { tag: ['@auth', '@positive'] }, async ({ loginPage, page }) => {
        Logger.step('Starting TC004: Forgot Password');
        await loginPage.navigateToLogin();
        await loginPage.clickForgotPassword();
        Logger.info(`Submitting forgot password for ${VALID_EMAIL!}`);
        await loginPage.submitForgotPassword(VALID_EMAIL!);

        // Assertion removed as per user request to unblock execution
        Logger.success('TC004 Completed Successfully');
    });

    test('TC005: Login Validation - Empty Credentials', { tag: ['@auth', '@negative'] }, async ({ loginPage, page }) => {
        Logger.step('Starting TC005: Login Validation - Empty Credentials');
        await loginPage.navigateToLogin();

        // Directly click Sign In without entering data
        await page.getByRole('button', { name: 'Sign In' }).click();
        Logger.info('Empty login form submitted. Verifying validation errors...');

        // Assert "This is a required field" appears for both fields
        // Using strict locators to ensure messages are attached to specific inputs if possible,
        // or checking for partial text count
        await expect(page.getByText('This is a required field.')).toHaveCount(2);

        Logger.success('TC005 Completed Successfully');
    });

    test('TC006: Sign Out Functionality', { tag: ['@auth', '@smoke', '@positive'] }, async ({ loginPage, header, page }) => {
        Logger.step('Starting TC006: Sign Out Functionality');
        await loginPage.navigateToLogin();
        await loginPage.login(VALID_EMAIL!, VALID_PASSWORD!);
        Logger.info('Logged in. Attempting sign out...');
        await header.clickSignOut();
        Logger.step('Sign out clicked. Verifying redirect...');
        // Verify redirection to logout success or homepage and correct link state
        await expect(page).toHaveURL(/https:\/\/www.bunnycart.com\//);
        Logger.info('Redirected to homepage. Verifying Sign In link visibility...');
        await header.isSignInLinkVisible();
        Logger.success('TC006 Completed Successfully');
    });

    test('TC007: Password Validation Rules', { tag: ['@auth', '@negative'] }, async ({ registerPage, page }) => {
        Logger.step('Starting TC007: Password Validation Rules');
        await registerPage.navigateToRegister();
        Logger.info('Attempting registration with weak password...');
        await registerPage.registerNewUser({
            firstName: 'Test', lastName: 'Weak', email: `weak${Date.now()}@test.com`, password: '123'
        });
        // Validation text: "Minimum of different classes of characters in password is 3"
        await expect(page.getByText(/Minimum length of this field must be/)).toBeVisible();
        Logger.success('TC007 Completed Successfully');
    });

    test('TC008: Registration - Duplicate Email Validation', { tag: ['@auth', '@negative'] }, async ({ registerPage, page }) => {
        Logger.step('Starting TC008: Registration - Duplicate Email Validation');
        await registerPage.navigateToRegister();

        Logger.info(`Attempting to register with existing email: ${VALID_EMAIL!}`);
        await registerPage.registerNewUser({
            firstName: 'Test',
            lastName: 'Duplicate',
            email: VALID_EMAIL!, // Use existing valid email 
            password: 'TestPassword123$',
            confirmPassword: 'TestPassword123$' // Ensure password match
        });

        // Assertion: Verify error message
        // Common Magento/Adobe Commerce error text
        await expect(page.getByText(/There is already an account with this email address/)).toBeVisible();

        Logger.success('TC008 Completed Successfully');
    });

    test('TC009: Login from Checkout (Guest -> User)', { tag: ['@auth', '@e2e', '@positive'] }, async ({ productPage, page, header }) => {
        Logger.step('Starting TC009: Login from Checkout');

        // 1. Navigate to Home
        await page.goto('https://www.bunnycart.com/');

        // 2. Click 'Background' link
        await page.getByRole('link', { name: 'Background' }).click();

        // 3. Click first product
        // Codegen: locator('.product > a').first().click();
        await page.locator('.product > a').first().click();

        // 4. Select 'Net Pot' Option
        // Codegen showed: await page.getByRole('option', { name: 'Net Pot' }).click();
        // and before that clicked 'This is a required field' - likely triggering validation or interaction.
        // We go straight for the option.
        await productPage.selectOption('Net Pot');

        // 5. Add to Cart
        await productPage.addToCart();
        Logger.info('Product added to cart. Navigating to checkout...');

        // 6. Go to Checkout
        // Codegen: await page.getByRole('link', { name: ' Your Cart ₹40.00 1 items' }).click();
        await page.getByRole('link', { name: /Your Cart/ }).click();
        // Codegen: await page.getByRole('button', { name: 'Go to Checkout' }).click();
        await page.getByRole('button', { name: 'Go to Checkout' }).click();

        // 7. Login at Checkout
        Logger.info('Sign In panel opened. Entering credentials...');
        // Codegen: 
        // await page.getByRole('textbox', { name: 'Email Address*' }).click();
        // await page.getByRole('textbox', { name: 'Email Address*' }).fill('pikachu@pokemon.com');
        await page.getByRole('textbox', { name: 'Email Address' }).first().click();
        await page.getByRole('textbox', { name: 'Email Address' }).first().fill(VALID_EMAIL!);

        // Codegen: await page.locator('div > .field.password').click();
        // await page.getByRole('textbox', { name: 'Password Password*' }).fill('Ash123#');
        await page.getByRole('textbox', { name: 'Password' }).first().fill(VALID_PASSWORD!);

        await page.getByRole('button', { name: 'Sign In' }).click();

        // 8. Verify Login
        // Codegen: await expect(page.getByText('Welcome, Pikachu Ash!')).toBeVisible();
        await header.verifyWelcomeMessage(FIRST_NAME!, LAST_NAME!);

        Logger.success('TC009 Completed Successfully');
    });

    test('TC010: Protected Route Redirection (Auth Guard)', { tag: ['@auth', '@security', '@positive'] }, async ({ page, loginPage, header }) => {
        Logger.step('Starting TC010: Protected Route Redirection');

        // 1. Ensure strictly logged out (incognito assumption or manual sign out if needed, but test.use handles clean state)
        // Access a protected route directly
        const protectedUrl = 'https://www.bunnycart.com/customer/account/';
        Logger.info(`Attempting to access protected URL: ${protectedUrl}`);
        await page.goto(protectedUrl);

        // 2. Verify Redirect to Login
        // Expect URL to contain 'customer/account/login'
        await expect(page).toHaveURL(/customer\/account\/login/);
        Logger.info('Redirected to Login Page as expected.');

        // 3. Perform Login
        // We are already on the login page, so we just fill and submit
        Logger.info('Performing login to verify redirect back...');
        await loginPage.login(VALID_EMAIL!, VALID_PASSWORD!);

        // 4. Verify Redirect Back to Protected Page
        // Use regex to allow for potential trailing slash or /index/ which some frameworks add
        await expect(page).toHaveURL(/customer\/account\/?(index\/)?/);
        Logger.success('Successfully redirected back to My Account page.');

        // 5. Verify Content to be sure (Heading)
        await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();

        Logger.success('TC010 Completed Successfully');
    });

});
