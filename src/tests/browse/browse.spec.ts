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

});
