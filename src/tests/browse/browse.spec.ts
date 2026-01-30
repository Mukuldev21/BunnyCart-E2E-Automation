import { test, expect } from '../../fixtures/custom-test';
import { Logger } from '../../utils/Logger';

test.describe('Module 2: Product Search & Browse', () => {

    test('TC011: Global Search - Valid Product', { tag: ['@browse', '@search', '@critical'] }, async ({ page, header, searchResultsPage }) => {
        Logger.step('Starting TC011: Global Search - Valid Product');

        // ARRANGE
        await page.goto('/');
        Logger.info('Navigated to homepage');

        // ACT
        const searchQuery = 'Anubias';
        Logger.info(`Searching for "${searchQuery}"...`);
        await header.searchFor(searchQuery);

        // ASSERT
        Logger.step('Verifying search results...');
        await searchResultsPage.verifyResultsHeader(searchQuery);
        await searchResultsPage.verifyProductVisible(searchQuery);

        Logger.success('TC011 Completed Successfully');
    });

    test('TC012: Global Search - No Results', { tag: ['@browse', '@search', '@negative'] }, async ({ page, header, searchResultsPage }) => {
        Logger.step('Starting TC012: Global Search - No Results');

        // ARRANGE
        await page.goto('/');

        // ACT
        const invalidQuery = 'XylophoneFish';
        Logger.info(`Searching for non-existent product "${invalidQuery}"...`);
        await header.searchFor(invalidQuery);

        // ASSERT
        Logger.step('Verifying no results message...');
        await searchResultsPage.verifyNoResultsMessage(invalidQuery);

        Logger.success('TC012 Completed Successfully');
    });

    test('TC013: Category Navigation - Level 1', { tag: ['@browse', '@navigation', '@high'] }, async ({ page, header, categoryPage }) => {
        Logger.step('Starting TC013: Category Navigation - Level 1');

        // ARRANGE
        await page.goto('/');

        // ACT
        const category = 'Aquatic Plants';
        Logger.info(`Clicking top level category: ${category}`);
        await header.clickCategory(category);

        // ASSERT
        Logger.step('Verifying category page loaded...');
        await categoryPage.verifyCategoryLoaded(category);

        Logger.success('TC013 Completed Successfully');
    });

    test('TC014: Filter Products by Price', { tag: ['@browse', '@filter', '@medium'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC014: Filter Products by Price');

        // ARRANGE
        await page.goto('/aquarium-plants');
        Logger.info('Navigated to Aquatic Plants PLP');

        // ACT
        Logger.info('Applying Price Filter (0-1000)...');
        // Filter by Price range 0-1000
        // Ideally we should make this robust to available ranges
        await categoryPage.filterByPrice(0, 1000);

        // ASSERT
        Logger.step('Verifying price filter active...');
        await categoryPage.verifyFilterActive('Price', '₹0.00 - ₹1,000.00');

        Logger.success('TC014 Completed Successfully');
    });

    test('TC015: Sort Products by Name', { tag: ['@browse', '@sort', '@low'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC015: Sort Products by Name');

        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT
        Logger.info('Sorting by Product Name...');
        await categoryPage.sortBy('Product Name');

        // ASSERT
        Logger.step('Verifying alphabetical sort...');
        await categoryPage.verifySorting('asc');

        Logger.success('TC015 Completed Successfully');
    });

    test('TC016: Product Listing - view Details', { tag: ['@browse', '@navigation', '@high'] }, async ({ page, categoryPage, productDetailsPage }) => {
        Logger.step('Starting TC016: Product Listing - view Details');

        // ARRANGE
        await page.goto('/aquarium-plants');

        const targetProduct = 'Bacopa Caroliniana';
        Logger.info(`Targeting product: ${targetProduct}`);

        // ACT
        await categoryPage.clickProduct(targetProduct);

        // ASSERT
        Logger.step('Verifying PDP loaded...');
        await productDetailsPage.verifyProductLoaded(targetProduct);

        Logger.success('TC016 Completed Successfully');
    });

    test('TC017: Pagination - Next Page', { tag: ['@browse', '@pagination', '@medium'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC017: Pagination - Next Page');

        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT
        Logger.info('Navigating to Next Page...');
        await categoryPage.navigateToNextPage();

        // ASSERT
        Logger.step('Verifying Page 2 is active...');
        await categoryPage.verifyPageActive(2);

        Logger.success('TC017 Completed Successfully');
    });

    test('TC018: Sub-Category Navigation', { tag: ['@browse', '@navigation', '@medium'] }, async ({ page, header, categoryPage }) => {
        Logger.step('Starting TC018: Sub-Category Navigation');

        // ARRANGE
        await page.goto('/');

        // ACT
        const parentCategory = 'Aquatic Plants';
        const subCategory = 'Foreground';
        Logger.info(`Hovering ${parentCategory} and clicking ${subCategory}...`);
        await header.hoverAndClickSubCategory(parentCategory, subCategory);

        // ASSERT
        // The actual category name in breadcrumbs/title is "Foreground Aquatic Plants"
        await categoryPage.verifyCategoryLoaded('Foreground Aquatic Plants');

        Logger.success('TC018 Completed Successfully');
    });

    test('TC019: Filter Products by Attribute', { tag: ['@browse', '@filter', '@low'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC019: Filter Products by Attribute');

        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT
        const filterType = 'Difficulty';
        const filterValue = 'Easy';
        Logger.info(`Filtering by ${filterType}: ${filterValue}...`);

        try {
            await categoryPage.filterByAttribute(filterType, filterValue);

            // ASSERT
            Logger.step('Verifying filter active...');
            await categoryPage.verifyFilterActive(filterType, filterValue);
        } catch (error) {
            Logger.warn(`Filter ${filterType}: ${filterValue} might not be available or locators changed. Test proceeding strictly.`);
            throw error;
        }

        Logger.success('TC019 Completed Successfully');
    });

    test('TC020: Clear All Filters', { tag: ['@browse', '@filter', '@medium'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC020: Clear All Filters');

        // ARRANGE
        await page.goto('/aquarium-plants');
        await categoryPage.filterByAttribute('Difficulty', 'Easy');
        await categoryPage.verifyFilterActive('Difficulty', 'Easy');
        Logger.info('Filter applied. Now clearing...');

        // ACT
        await categoryPage.clearAllFilters();

        // ASSERT
        Logger.step('Verifying all filters cleared...');
        const activeFilters = page.locator('.filter-current');
        await expect(activeFilters).toBeHidden();
        await expect(page).not.toHaveURL(/difficulty=/);

        Logger.success('TC020 Completed Successfully');
    });

    test('TC021: Verify Default Grid View', { tag: ['@browse', '@ui', '@low'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC021: Verify Default Grid View');

        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT & ASSERT
        Logger.info('Verifying Grid View is default...');
        await categoryPage.verifyGridView();

        Logger.success('TC021 Completed Successfully');
    });

    test('TC022: Sort Products by Price (Low > High)', { tag: ['@browse', '@sort', '@medium'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC022: Sort Products by Price (Low > High)');

        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT
        // First sort by Name to ensure we change state
        await categoryPage.sortBy('name');

        Logger.info('Sorting by Price (Ascending)...');
        await categoryPage.sortBy('price');

        // ASSERT
        Logger.step('Verifying price sort (asc)...');
        await categoryPage.verifyPriceSorting('asc');

        Logger.success('TC022 Completed Successfully');
    });

    test('TC023: Sort Products by Price (High > Low)', { tag: ['@browse', '@sort', '@medium'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC023: Sort Products by Price (High > Low)');

        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT
        Logger.info('Sorting by Price (Descending)...');
        await categoryPage.sortBy('price');
        await categoryPage.setSortDirection('desc');

        // ASSERT
        Logger.step('Verifying price sort (desc)...');
        await categoryPage.verifyPriceSorting('desc');

        Logger.success('TC023 Completed Successfully');
    });

    test('TC024: Change Items Per Page', { tag: ['@browse', '@pagination', '@low'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC024: Change Items Per Page');

        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT
        const limit = 40;
        Logger.info(`Changing items per page to ${limit}...`);
        await categoryPage.changeItemsPerPage(limit);

        // ASSERT
        Logger.step(`Verifying ${limit} items visible...`);
        await categoryPage.verifyItemsPerPage(limit);

        Logger.success('TC024 Completed Successfully');
    });

    test('TC025: Breadcrumb Navigation Click', { tag: ['@browse', '@navigation', '@medium'] }, async ({ page, categoryPage }) => {
        Logger.step('Starting TC025: Breadcrumb Navigation Click');

        // ARRANGE
        await page.goto('/aquarium-plants');

        // ACT
        Logger.info('Clicking "Home" in breadcrumb...');
        await categoryPage.clickBreadcrumb('Home');

        // ASSERT
        Logger.step('Verifying redirection to Home...');
        await expect(page).toHaveURL('https://www.bunnycart.com/');
        await expect(page).toHaveTitle(/Buy Aquatic Plants & Aquarium Fish online/);

        Logger.success('TC025 Completed Successfully');
    });

});
