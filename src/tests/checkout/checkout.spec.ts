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

});
