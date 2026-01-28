import { test, expect } from '../../fixtures/custom-test';

test.describe('Module 3: Product Details (PDP)', () => {

    test('TC026: PDP Information Display', async ({ page, searchResultsPage, productDetailsPage }) => {
        // ARRANGE
        await page.goto('/');
        const productName = 'Anubias Nana Petite';
        // Faster: Navigate directly
        await page.goto('/anubias-nana-petite');

        // ACT & ASSERT
        await productDetailsPage.verifyProductLoaded(productName);
    });

    test('TC027: Select Product Options', async ({ page, productDetailsPage, categoryPage }) => {
        // ARRANGE
        console.log('TC027: Starting test - Select Product Options');

        // Navigate to a product with options (e.g., Hygrophila from user codegen)
        // User codegen navigated to "Aquatic Plants" then clicked 6th item. 
        // We will try to find a known product with options or use the user's flow if specific product unknown.
        // Codegen target: "Hygrophila" (inferred from Success Message "You added Hygrophila")
        // Let's try navigating to a category and clicking a product, or finding a product with options via search.
        // User codegen: 
        // 1. Home
        // 2. Aquatic Plants
        // 3. Click item

        await page.goto('/');
        console.log('TC027: Navigated to homepage');

        // Use direct navigation (or header if available)
        // categoryPage.clickCategory is not valid. Navigation is usually in Header or via URL.
        // Direct URL is faster and more reliable for setup.
        await page.goto('/aquarium-plants');
        console.log('TC027: Navigated to Aquatic Plants');

        // Click on a product that likely has options. The codegen picked nth-child-5.
        // We can try to pick "Hygrophila" if visible, or "Rotala" which we inspected before.
        // Let's look for "Hygrophila" text link first to be robust.
        const productLink = page.getByRole('link', { name: /Hygrophila|Rotala|Anubias/i }).first();
        if (await productLink.isVisible()) {
            await productLink.click();
        } else {
            // Fallback to first product
            await page.locator('.product-item-info a').first().click();
        }
        console.log('TC027: Navigated to PDP');

        // ACT
        // Select 'Net Pot' option
        await productDetailsPage.selectOption('Net Pot');
        console.log('TC027: Selected Option "Net Pot"');

        // Add to Cart
        await productDetailsPage.addToCart();
        console.log('TC027: Clicked Add to Cart');

        // ASSERT
        // Verify visual confirmation (message or mini-cart update)
        // Codegen verified: "You added Hygrophila"
        // We'll verify a generic success part "You added" to be safe
        await productDetailsPage.verifySuccessMessage('You added');
        console.log('TC027: Verified Success Message');

        console.log('TC027: Test completed successfully');
    });

    test('TC028: Add to Cart - Success', async ({ page, productDetailsPage, header, categoryPage }) => {
        // ARRANGE
        console.log('TC028: Starting test - Add to Cart Success');

        // 1. Navigate to PDP of a known product (Hygrophila as per codegen)
        // Using direct URL for reliability
        await page.goto('/hygrophila-polysperma-rosanervig');
        console.log('TC028: Navigated to PDP (Hygrophila)');

        // ACT
        // 3. Select Options
        // Mandatory selection as per user feedback/product requirement
        const option = page.getByRole('option', { name: 'Net Pot' });
        await expect(option).toBeVisible(); // Explicit wait for stability
        await option.click();
        console.log('TC028: Selected Option "Net Pot"');

        // 4. Add to Cart
        await productDetailsPage.addToCart();
        console.log('TC028: Clicked Add to Cart');

        // ASSERT
        // 5. Verify Success Message
        await productDetailsPage.verifySuccessMessage('You added');

        // 6. Verify Mini-Cart
        // Wait for cart counter to update (implicit in success message usually, but let's check UI)
        await expect(page.getByRole('link', { name: /Your Cart/i })).toBeVisible();

        // 7. Click Cart Icon
        await header.clickCartIcon();

        // 8. Verify Mini-Cart Dropdown
        await header.verifyMiniCartVisible();

        // 9. Verify Checkout Button
        await expect(page.getByRole('button', { name: 'Go to Checkout' })).toBeVisible();

        console.log('TC028: Test completed successfully');
    });

});
