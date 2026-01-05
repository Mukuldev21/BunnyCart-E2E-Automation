import { test } from '../../fixtures/custom-test';

test.describe('Module 2: Product Search & Browse', () => {

    test('TC011: Global Search - Valid Product', async ({ page, header, searchResultsPage }) => {
        // ARRANGE
        // Navigate to the homepage or any page where header is visible
        await page.goto('/');

        // ACT
        // Perform search
        await header.searchFor('Anubias');

        // ASSERT
        // Verify we are on the search results page and correct results are shown
        await searchResultsPage.verifyResultsHeader('Anubias');
        await searchResultsPage.verifyProductVisible('Anubias');
    });

});
