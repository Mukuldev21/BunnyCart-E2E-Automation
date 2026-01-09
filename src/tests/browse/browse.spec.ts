import { test } from '../../fixtures/custom-test';

test.describe('Module 2: Product Search & Browse', () => {

    test('TC013: Category Navigation - Level 1', async ({ page, header, categoryPage }) => {
        // ARRANGE
        await page.goto('/');

        // ACT
        // Click on top level category "Aquatic Plants"
        await header.clickCategory('Aquatic Plants');

        // ASSERT
        // Verify correct category page is loaded
        await categoryPage.verifyCategoryLoaded('Aquatic Plants');
    });

    test('TC014: Filter Products by Price', async ({ page, categoryPage }) => {
        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT
        // Filter by Price range 0-1000
        await categoryPage.filterByPrice(0, 1000);

        // ASSERT
        // Verify "Now Shopping by" shows Price filter with correct range
        // Verify "Now Shopping by" shows Price filter with correct range
        await categoryPage.verifyFilterActive('Price', '₹0.00 - ₹1,000.00');
    });

    test('TC015: Sort Products by Name', async ({ page, categoryPage }) => {
        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT
        // Sort by "Product Name"
        await categoryPage.sortBy('Product Name');

        // ASSERT
        // Verify products are sorted alphabetically (Ascending is default for Name)
        await categoryPage.verifySorting('asc');
    });

    test('TC016: Product Listing - view Details', async ({ page, categoryPage, productDetailsPage }) => {
        // ARRANGE
        await page.goto('/aquarium-plants');

        // Use a known product that usually appears early in the list
        // Based on previous sorts, "Acmella repens" or "Aglaonema simplex" should be available
        // Let's use "Acmella repens" if sorted by name, but we are just landing on default.
        // Default list starts with Rotala Wallichii usually.
        // Let's pick "Rotala Wallichii" or "Bacopa Caroliniana" as they are common.
        const targetProduct = 'Bacopa Caroliniana';

        // ACT
        // Click on product
        await categoryPage.clickProduct(targetProduct);

        // ASSERT
        // Verify PDP is loaded
        await productDetailsPage.verifyProductLoaded(targetProduct);
    });

});
