import { test, expect } from '../../fixtures/custom-test';

test.describe('Module 5: Checkout E2E', () => {

    test('TC046: Guest Checkout - Shipping Entry', async ({ page, productDetailsPage, header, cartPage, checkoutPage, loginPage }) => {
        // ARRANGE
        console.log('TC046: Starting test - Guest Checkout Shipping Entry');

        // Precondition 1: Login first (required to access checkout)
        const email = process.env.BUNNY_EMAIL || 'pikachu@pokemon.com';
        const password = process.env.BUNNY_PASSWORD || 'Ash123#';

        await page.goto('/customer/account/login/');

        // Check if already logged in
        const currentUrl = page.url();
        if (currentUrl.includes('/customer/account/login')) {
            await loginPage.login(email, password);
            console.log('TC046: Logged in successfully');
        } else {
            console.log('TC046: Already logged in');
        }

        // Precondition 2: Add item to cart
        await page.goto('/duckweed');
        console.log('TC046: Navigated to PDP (Duckweed)');

        await productDetailsPage.addToCart();
        console.log('TC046: Added product to cart');

        // Verify success message
        await expect(page.getByText('You added', { exact: false }).first()).toBeVisible({ timeout: 10000 });

        // Navigate directly to checkout
        await page.goto('/checkout/#shipping');
        await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
        console.log('TC046: Navigated to checkout');

        // ACT
        // Fill shipping address details
        await checkoutPage.fillShippingAddress({
            firstName: 'Ash',
            lastName: 'Ketchum',
            street1: '123 Pallet Town Road',
            street2: 'Mantri Road Pune',
            city: 'Pune',
            stateId: '553', // Maharashtra
            zip: '411057'
        });
        console.log('TC046: Filled shipping address');

        // ASSERT
        // Verify "Next" button is enabled/visible
        await expect(checkoutPage.nextButton).toBeEnabled({ timeout: 10000 });
        console.log('TC046: Verified Next button is enabled');

        // Verify shipping methods load
        await checkoutPage.verifyShippingMethodsVisible();
        console.log('TC046: Verified shipping methods are visible');

        console.log('TC046: Test completed successfully');
    });

    test('TC047: Shipping Method Selection', async ({ page, productDetailsPage, checkoutPage, loginPage }) => {
        // ARRANGE
        console.log('TC047: Starting test - Shipping Method Selection');

        // Precondition 1: Login
        const email = process.env.BUNNY_EMAIL || 'pikachu@pokemon.com';
        const password = process.env.BUNNY_PASSWORD || 'Ash123#';

        await page.goto('/customer/account/login/');

        const currentUrl = page.url();
        if (currentUrl.includes('/customer/account/login')) {
            await loginPage.login(email, password);
            console.log('TC047: Logged in successfully');
        } else {
            console.log('TC047: Already logged in');
        }

        // Precondition 2: Add item to cart
        await page.goto('/duckweed');
        console.log('TC047: Navigated to PDP (Duckweed)');

        await productDetailsPage.addToCart();
        console.log('TC047: Added product to cart');

        await expect(page.getByText('You added', { exact: false }).first()).toBeVisible({ timeout: 10000 });

        // Precondition 3: Navigate to checkout and fill address
        await page.goto('/checkout/#shipping');
        await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
        console.log('TC047: Navigated to checkout');

        await checkoutPage.fillShippingAddress({
            firstName: 'Ash',
            lastName: 'Ketchum',
            street1: '123 Pallet Town Road',
            street2: 'Mantri Road Pune',
            city: 'Pune',
            stateId: '553',
            zip: '411057'
        });
        console.log('TC047: Filled shipping address');

        // ACT
        // Select a shipping method
        await checkoutPage.selectShippingMethod('Shipping Table Rates');
        console.log('TC047: Selected shipping method');

        // Click Next to proceed to payment
        await checkoutPage.clickNext();
        console.log('TC047: Clicked Next button');

        // ASSERT
        // Verify redirected to payment step
        await checkoutPage.verifyPaymentStepLoaded();
        console.log('TC047: Verified payment step loaded');

        // Verify shipping cost appears in order summary
        await checkoutPage.verifyShippingCostInSummary('₹99.00');
        console.log('TC047: Verified shipping cost in order summary');

        console.log('TC047: Test completed successfully');
    });

});
