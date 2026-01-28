import { test, expect } from '../../fixtures/custom-test';

test.describe('Module 4: Shopping Cart', () => {

    test('TC036: Mini-Cart Hover/Click', async ({ page, header, productDetailsPage }) => {
        // ARRANGE
        console.log('TC036: Starting test - Mini-Cart Hover/Click');

        // Precondition: Add item to cart
        // Navigate to a known product with options
        await page.goto('/hygrophila-polysperma-rosanervig');
        console.log('TC036: Navigated to PDP (Hygrophila)');

        // Select required option
        const option = page.getByRole('option', { name: 'Net Pot' });
        await expect(option).toBeVisible({ timeout: 10000 });
        await option.click();
        console.log('TC036: Selected Option "Net Pot"');

        // Add to cart
        await productDetailsPage.addToCart();
        console.log('TC036: Added product to cart');

        // Verify success message (use .first() to handle multiple success messages)
        await expect(page.getByText('You added', { exact: false }).first()).toBeVisible({ timeout: 10000 });
        console.log('TC036: Verified success message');

        // ACT
        // Click cart icon to open mini-cart
        await header.clickCartIcon();
        console.log('TC036: Clicked cart icon');

        // ASSERT
        // Verify mini-cart dropdown appears
        await header.verifyMiniCartVisible();
        console.log('TC036: Verified mini-cart dropdown is visible');

        // Verify item count is displayed in cart link
        const cartLink = page.getByRole('link', { name: /Your Cart/i });
        await expect(cartLink).toBeVisible();
        await expect(cartLink).toContainText(/\d+/); // Contains a number (item count)
        console.log('TC036: Verified item count is displayed');

        // Verify subtotal is displayed
        // Mini-cart should show price information
        const miniCart = page.locator('.minicart-items-wrapper');
        await expect(miniCart).toContainText(/₹/); // Contains currency symbol
        console.log('TC036: Verified subtotal is displayed');

        // Verify "Go to Checkout" button is visible
        const checkoutButton = page.getByRole('button', { name: 'Go to Checkout' });
        await expect(checkoutButton).toBeVisible();
        console.log('TC036: Verified "Go to Checkout" button is visible');

        console.log('TC036: Test completed successfully');
    });

    test('TC037: View Cart Page', async ({ page, header, productDetailsPage, cartPage }) => {
        // ARRANGE
        console.log('TC037: Starting test - View Cart Page');

        // Precondition: Add item to cart
        await page.goto('/hygrophila-polysperma-rosanervig');
        console.log('TC037: Navigated to PDP (Hygrophila)');

        // Select required option
        const option = page.getByRole('option', { name: 'Net Pot' });
        await expect(option).toBeVisible({ timeout: 10000 });
        await option.click();
        console.log('TC037: Selected Option "Net Pot"');

        // Add to cart
        await productDetailsPage.addToCart();
        console.log('TC037: Added product to cart');

        // Verify success message
        await expect(page.getByText('You added', { exact: false }).first()).toBeVisible({ timeout: 10000 });
        console.log('TC037: Verified success message');

        // ACT
        // Click cart icon to open mini-cart
        await header.clickCartIcon();
        console.log('TC037: Clicked cart icon');

        // Verify mini-cart is visible
        await header.verifyMiniCartVisible();
        console.log('TC037: Mini-cart visible');

        // Click "View and Edit Cart"
        await header.clickViewAndEditCart();
        console.log('TC037: Clicked View and Edit Cart');

        // ASSERT
        // Verify redirected to cart page
        await cartPage.verifyCartPageLoaded();
        console.log('TC037: Verified cart page loaded');

        // Verify item is listed in cart
        await cartPage.verifyItemInCart('Hygrophila');
        console.log('TC037: Verified item in cart');

        // Verify subtotal is visible
        await cartPage.verifySubtotalVisible();
        console.log('TC037: Verified subtotal visible');

        console.log('TC037: Test completed successfully');
    });

});
