import { test, expect } from '../../fixtures/custom-test';
import { Logger } from '../../utils/Logger';

test.describe('Module 3: Product Details (PDP)', () => {

    test('TC026: PDP Information Display', { tag: ['@pdp', '@ui', '@critical'] }, async ({ page, productDetailsPage }) => {
        Logger.step('Starting TC026: PDP Information Display');

        // ARRANGE
        const productName = 'Anubias Nana Petite';
        Logger.info(`Navigating to PDP for product: ${productName}`);
        await page.goto('/anubias-nana-petite');

        // ACT & ASSERT
        Logger.step('Verifying product details loaded...');
        await productDetailsPage.verifyProductLoaded(productName);

        Logger.success('TC026 Completed Successfully');
    });

    test('TC027: Select Product Options', { tag: ['@pdp', '@functional', '@critical'] }, async ({ page, productDetailsPage }) => {
        Logger.step('Starting TC027: Select Product Options');

        // ARRANGE
        // Navigate to a product with options (e.g., Hygrophila)
        Logger.info('Navigating to product with options...');
        await page.goto('/aquarium-plants');

        const productLink = page.getByRole('link', { name: /Hygrophila|Rotala|Anubias/i }).first();
        if (await productLink.isVisible()) {
            await productLink.click();
        } else {
            await page.locator('.product-item-info a').first().click();
        }
        Logger.info('Navigated to PDP');

        // ACT
        Logger.info('Selecting "Net Pot" option...');
        await productDetailsPage.selectOption('Net Pot');

        Logger.info('Adding to Cart to verify selection works...');
        await productDetailsPage.addToCart();

        // ASSERT
        Logger.step('Verifying success message...');
        await productDetailsPage.verifySuccessMessage('You added');

        Logger.success('TC027 Completed Successfully');
    });

    test('TC028: Add to Cart - Success', { tag: ['@pdp', '@smoke', '@critical'] }, async ({ page, productDetailsPage, header }) => {
        Logger.step('Starting TC028: Add to Cart - Success');

        // ARRANGE
        Logger.info('Navigating to known product (Hygrophila)...');
        await page.goto('/hygrophila-polysperma-rosanervig');

        // ACT
        // Select Option
        Logger.info('Selecting Option "Net Pot"...');
        const option = page.getByRole('option', { name: 'Net Pot' });
        if (await option.isVisible()) {
            await option.click();
        } else {
            Logger.warn('Option "Net Pot" not found, continuing assuming no options needed or pre-selected');
        }

        // Add to Cart
        Logger.info('Clicking Add to Cart...');
        await productDetailsPage.addToCart();

        // ASSERT
        Logger.step('Verifying success message and mini-cart...');
        await productDetailsPage.verifySuccessMessage('You added');
        await expect(page.getByRole('link', { name: /Your Cart/i })).toBeVisible();

        Logger.info('Verifying Mini-Cart visibility...');
        await header.clickCartIcon();
        await header.verifyMiniCartVisible();
        await expect(page.getByRole('button', { name: 'Go to Checkout' })).toBeVisible();

        Logger.success('TC028 Completed Successfully');
    });

    test('TC029: Add to Cart - Missing Option', { tag: ['@pdp', '@negative', '@medium'] }, async ({ page, productDetailsPage }) => {
        Logger.step('Starting TC029: Add to Cart - Missing Option');

        // ARRANGE
        Logger.info('Navigating to product with required options...');
        await page.goto('/hygrophila-polysperma-rosanervig');

        // ACT
        Logger.info('Clicking Add to Cart without selecting options...');
        await productDetailsPage.addToCart();

        // ASSERT
        Logger.step('Verifying validation error...');
        await productDetailsPage.verifyValidationError('This is a required field.');

        Logger.success('TC029 Completed Successfully');
    });

    test('TC030: Product Image Gallery', { tag: ['@pdp', '@ui', '@low'] }, async ({ page, productDetailsPage }) => {
        Logger.step('Starting TC030: Product Image Gallery');

        // ARRANGE
        await page.goto('/hygrophila-polysperma-rosanervig');

        // ACT
        const initialSrc = await productDetailsPage.getMainImageSrc();
        Logger.info(`Initial Image Src: ${initialSrc}`);
        expect(initialSrc).toBeTruthy();

        const thumbs = page.locator('.fotorama__nav__shaft .fotorama__nav__frame--thumb');
        if (await thumbs.count() > 1) {
            Logger.info('Switching to second thumbnail...');
            await productDetailsPage.clickThumbnail(1);

            // Allow time for animation
            await page.waitForTimeout(1000);

            // ASSERT
            const newSrc = await productDetailsPage.getMainImageSrc();
            Logger.info(`New Image Src: ${newSrc}`);
            expect(newSrc).not.toBe(initialSrc);
        } else {
            Logger.warn('Product has only one image, gallery switch verification skipped.');
        }

        Logger.success('TC030 Completed Successfully');
    });

    test('TC031: Out of Stock Product Display', { tag: ['@pdp', '@functional', '@high'] }, async ({ page, productDetailsPage }) => {
        Logger.step('Starting TC031: Out of Stock Product Display');

        // ARRANGE
        await page.goto('/aquarium-plants');

        // Find OOS product
        const oosProduct = page.locator('.product-item').filter({ hasText: /Out of Stock/i }).first();

        if (await oosProduct.isVisible()) {
            Logger.info('Found OOS product on PLP. Navigating...');
            await oosProduct.getByRole('link').first().click();

            // ACT & ASSERT
            Logger.step('Verifying Out of Stock status on PDP...');
            await productDetailsPage.verifyOutOfStock();
        } else {
            Logger.warn('No Out of Stock products found. Skipping test.');
            test.skip();
        }

        Logger.success('TC031 Completed Successfully');
    });

    test('TC032: Update Quantity in PDP', { tag: ['@pdp', '@functional', '@medium'] }, async ({ page, productDetailsPage }) => {
        Logger.step('Starting TC032: Update Quantity in PDP');

        // ARRANGE
        await page.goto('/hygrophila-polysperma-rosanervig');

        // ACT
        Logger.info('Selecting option and setting Quantity to 3...');
        await productDetailsPage.selectOption('Net Pot');
        await productDetailsPage.setQuantity(3);

        Logger.info('Adding to Cart...');
        await productDetailsPage.addToCart();

        // ASSERT
        Logger.step('Verifying success message and cart counter...');
        await productDetailsPage.verifySuccessMessage('You added');

        const counter = page.locator('.counter-number');
        await expect(counter).toHaveText('3', { timeout: 10000 });

        Logger.success('TC032 Completed Successfully');
    });

    test('TC033: Add to Wishlist', { tag: ['@pdp', '@functional', '@low'] }, async ({ page, productDetailsPage }) => {
        Logger.step('Starting TC033: Add to Wishlist');

        // ARRANGE
        await page.goto('/anubias-nana-petite');

        // ACT
        Logger.info('Clicking Add to Wish List...');
        await productDetailsPage.addToWishlist();

        // ASSERT
        Logger.step('Verifying redirect to Login...');
        await expect(page).toHaveURL(/.*\/customer\/account\/login\/.*/);

        const loginHeader = page.getByRole('heading', { name: /Customer Login/i });
        const wishlistMsg = page.getByText('You must login or register to add items to your wishlist.');

        // One of these should be visible depending on implementation
        if (await wishlistMsg.isVisible()) {
            await expect(wishlistMsg).toBeVisible();
        } else {
            await expect(loginHeader).toBeVisible();
        }

        Logger.success('TC033 Completed Successfully');
    });

    test.fixme('TC034: Add to Compare', { tag: ['@pdp', '@functional', '@low'] }, async ({ page, productDetailsPage }) => {
        Logger.step('Starting TC034: Add to Compare');

        // ARRANGE
        await page.goto('/anubias-nana-petite');

        // ACT
        Logger.info('Clicking Add to Compare...');
        await productDetailsPage.addToCompare();

        // ASSERT
        await productDetailsPage.verifySuccessMessage(/You added product.*comparison list/);

        Logger.success('TC034 Completed Successfully');
    });

    test('TC035: Related Products', { tag: ['@pdp', '@navigation', '@low'] }, async ({ page, productDetailsPage }) => {
        Logger.step('Starting TC035: Related Products');

        // ARRANGE
        await page.goto('/aquarium-plants');

        const productLinks = page.locator('.product-item-link');
        const count = await productLinks.count();
        let foundRelated = false;

        for (let i = 0; i < Math.min(count, 3); i++) {
            // Re-query to avoid stale element
            const products = page.locator('.product-item-link');
            if (await products.nth(i).isVisible()) {
                await products.nth(i).click();
                Logger.info('Navigated to PDP to check related products...');

                // ACT
                if (await productDetailsPage.selectRelatedProduct()) {
                    Logger.info('Related Product clicked. Verifying navigation...');
                    await expect(page.locator('h1.page-title span')).toBeVisible();
                    foundRelated = true;
                    break;
                } else {
                    Logger.info('No related products found. Going back...');
                    await page.goBack();
                }
            }
        }

        if (!foundRelated) {
            Logger.warn('No related products found during sampling. Skipping test.');
            test.skip();
        }

        Logger.success('TC035 Completed Successfully');
    });

    test('TC041_PDP: Verify Add to Cart Validation (Empty Quantity)', { tag: ['@pdp', '@negative', '@medium'] }, async ({ page, productDetailsPage }) => {
        // Technically Module 4, but testing PDP validation
        Logger.step('Starting TC041_PDP: Verify Empty Quantity Validation');

        // ARRANGE
        await page.goto('/hygrophila-polysperma-rosanervig');

        // ACT
        Logger.info('Clearing Quantity field...');
        await productDetailsPage.enterQuantity('');
        await productDetailsPage.selectOption('Net Pot'); // Select option to rule out option validation

        Logger.info('Clicking Add to Cart...');
        await productDetailsPage.addToCart();

        // ASSERT
        Logger.step('Verifying validation error...');
        await productDetailsPage.verifyValidationError('Please enter a valid number in this field.');

        Logger.success('TC041_PDP Completed Successfully');
    });

});
