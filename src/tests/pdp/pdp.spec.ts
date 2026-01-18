import { test, expect } from '../../fixtures/custom-test';

test.describe('Module 3: Product Details (PDP)', () => {

    test('TC026: PDP Information Display', async ({ page, searchResultsPage, productDetailsPage }) => {
        // ARRANGE
        // Navigate to a known product. We'll find one via search to be dynamic, 
        // or navigate directly if we want speed. Search is safer for "any exists".
        await page.goto('/');

        const productName = 'Anubias Nana Petite';

        // Use direct navigation for stability if the URL is known
        // Or browse/search. Let's use direct navigation for PDP tests to be focused.
        // Assuming slug is known or provided in test cases.
        // If not, we can go to category -> click logic.
        // Let's stick to the "Navigate to PDP" instruction.

        // Searching and clicking is a good way to "Navigate to PDP" naturally
        // await header.searchFor(productName);
        // await searchResultsPage.clickProduct(productName);

        // Faster: Navigate directly
        await page.goto('/anubias-nana-petite');

        // ACT & ASSERT
        await productDetailsPage.verifyProductLoaded(productName);
    });

});
