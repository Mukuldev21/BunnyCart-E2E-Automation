import { type Page, type Locator, expect } from '@playwright/test';
import { Header } from '../components/Header';

export class CategoryPage {
    readonly page: Page;
    readonly header: Header;
    readonly pageHeading: Locator;
    readonly breadcrumbs: Locator;
    readonly productGrid: Locator;
    readonly activeFilters: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.pageHeading = page.locator('h1.page-title');
        this.breadcrumbs = page.locator('.breadcrumbs');
        // Unique selector for main grid items (excludes "Expert Picks" & "Popular" sections)
        this.productGrid = page.locator('.products-grid .product-item');
        this.activeFilters = page.locator('.filter-current');
    }

    async verifyCategoryLoaded(categoryName: string) {
        // Verify Page Title (Browser Tab)
        const title = await this.page.title();
        expect(title).toContain(categoryName);

        // Verify Breadcrumbs first as they are always visible
        await expect(this.breadcrumbs).toBeVisible();
        await expect(this.breadcrumbs).toContainText('Home');
        await expect(this.breadcrumbs).toContainText(categoryName);

        // Verify Products
        // We expect at least one product
        await expect(this.productGrid.first()).toBeVisible();
    }

    async filterByAttribute(filterName: string, optionName: string) {
        // Locate the specific filter group item container that has the specific title
        const filterItem = this.page.locator('.filter-options-item').filter({
            has: this.page.locator('.filter-options-title', { hasText: filterName })
        });

        // Ensure the filter item exists
        await expect(filterItem).toBeVisible();

        const titleParams = filterItem.locator('.filter-options-title');

        // Check if expanded, if not click to expand
        const isExpanded = await titleParams.getAttribute('aria-expanded');
        if (isExpanded === 'false') {
            await titleParams.click();
        }

        // Find the specific option link within this group
        const optionLink = filterItem.locator('a').filter({ hasText: optionName });
        await expect(optionLink).toBeVisible();

        // Click and wait for network/grid update
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            optionLink.click()
        ]);

        // Wait for product grid to stabilize
        await this.productGrid.first().waitFor({ state: 'visible' });
    }

    async filterByPrice(min: number, max: number) {
        // Direct URL manipulation for stability with Amasty sliders
        // Example: ?price=0-1000
        const url = new URL(this.page.url());
        url.searchParams.set('price', `${min}-${max}`);
        await this.page.goto(url.toString());
    }

    async verifyFilterActive(filterLabel: string, expectedText: string) {
        await expect(this.activeFilters).toBeVisible();
        // The active filter section usually has the label and value
        await expect(this.activeFilters).toContainText(filterLabel);
        await expect(this.activeFilters).toContainText(expectedText);
    }

    async filterByAttribute(attribute: string, value: string) {
        // Find the group title
        const group = this.page.locator('.filter-options-title').filter({ hasText: attribute });

        // Ensure group exists
        await expect(group).toBeVisible({ timeout: 5000 });

        // Check expand state
        const isExpanded = await group.getAttribute('aria-expanded');
        if (isExpanded === 'false') {
            await group.click();
        }

        // Wait for specific value to be visible before clicking
        const valueLink = this.page.locator('.filter-options-content a').filter({ hasText: value });
        await valueLink.waitFor({ state: 'visible', timeout: 5000 });
        await valueLink.click();
    }

    async verifyFilterApplied(filterText: string) {
        // Check "Now Shopping by" section
        const appliedFilter = this.page.locator('.filter-current .filter-value');
        await expect(appliedFilter).toContainText(filterText);
    }

    async clearAllFilters() {
        // Use visible=true to avoid targeting hidden mobile view duplicates
        const clearAll = this.page.locator('.action.clear.filter-clear >> visible=true');

        // Ensure it's visible before clicking (assuming we expect filters to be active)
        await expect(clearAll).toBeVisible();

        await Promise.all([
            this.page.waitForLoadState('networkidle'), // Wait for reload/update
            clearAll.click()
        ]);

        // Wait for the "Now Shopping by" section to disappear or the grid to refresh
        await expect(this.activeFilters).toBeHidden();

        // Wait for product grid to stabilize
        await this.productGrid.first().waitFor({ state: 'visible' });
    }

    async sortBy(option: string) {
        // Map user-friendly option names to value attributes
        const optionMap: { [key: string]: string } = {
            'Product Name': 'name',
            'Price': 'price',
            'Position': 'position'
        };
        const value = optionMap[option] || option;

        // Check if already selected
        // Use the first visible sorter to ensure we interact with the correct element
        const sorter = this.page.locator('#sorter').first();
        const currentSort = await sorter.inputValue();
        if (currentSort === value) {
            return;
        }

        // Clear the product grid to ensure we wait for new content (handling both AJAX and Reload)
        await this.page.evaluate(() => {
            const grid = document.querySelector('.products-grid');
            if (grid) grid.innerHTML = '';
        });

        // Select option
        await sorter.selectOption(value);

        // Wait for the product grid to be repopulated
        await this.productGrid.first().waitFor({ state: 'visible', timeout: 30000 });
    }

    async verifyPriceSorting(order: 'asc' | 'desc') {
        // Extract all price texts using the reliable locator
        const priceTexts = await this.page.locator('.product-item-info [data-price-type="finalPrice"] .price').allTextContents();

        // Parse prices to numbers (remove currency symbols like ₹, $, and commas)
        const prices = priceTexts.map(t => parseFloat(t.replace(/[^0-9.]/g, '')));

        // Verify we have prices to check
        expect(prices.length).toBeGreaterThan(0);

        // Check if sorted
        const sortedPrices = [...prices].sort((a, b) => order === 'asc' ? a - b : b - a);
        expect(prices).toEqual(sortedPrices);
    }

    async verifySorting(order: 'asc' | 'desc') {
        // Use the specific locator for the main grid to avoid duplicates from recommendation blocks
        // Wait for at least one item
        await this.page.locator('.products-grid .product-item-link').first().waitFor({ state: 'visible' });

        const titles = await this.page.locator('.products-grid .product-item-link').allTextContents();

        // Filter out empty strings if any
        const cleanTitles = titles.map(t => t.trim()).filter(t => t.length > 0);

        // Log first item for debugging
        console.log(`First item after sorting ${order}: ${cleanTitles[0]}`);

        // Create a copy and sort it consistently (case-insensitive)
        const sortedTitles = [...cleanTitles].sort((a, b) => {
            return order === 'asc'
                ? a.localeCompare(b, undefined, { sensitivity: 'base' })
                : b.localeCompare(a, undefined, { sensitivity: 'base' });
        });

        // Verify equality
        expect(cleanTitles).toEqual(sortedTitles);
    }

    async clickProduct(productName: string) {
        // Use the specific grid locator and filter by text
        // Note: The product name text is usually inside an anchor tag with class 'product-item-link'
        const productLink = this.productGrid.locator('.product-item-link').filter({ hasText: productName });

        // Ensure it's visible and click
        await expect(productLink.first()).toBeVisible();
        await productLink.first().click();
    }

    async navigateToNextPage() {
        // Locator for the "Next" arrow button
        // Use >> visible=true to target the one currently shown to the user (e.g. bottom pager)
        const nextButton = this.page.locator('.pages-item-next a.next >> visible=true');

        // Ensure it's visible (if not, we might be on the last page or pagination is missing)
        await expect(nextButton).toBeVisible();

        // Click and wait for navigation/update
        // Pagination usually triggers a full reload or partial reload
        await Promise.all([
            this.page.waitForLoadState('networkidle'), // Wait for new products to load
            nextButton.click()
        ]);

        // Wait for product grid to stabilize
        await this.productGrid.first().waitFor({ state: 'visible' });
    }

    async verifyPageActive(pageNumber: number) {
        // Verify URL contains the page parameter (e.g. ?p=2) or handled via clean URL
        // BunnyCart standard is usually ?p=2
        const urlToCheck = `p=${pageNumber}`;
        await expect(this.page).toHaveURL(new RegExp(urlToCheck));

        // Verify the UI shows the page as current
        // Verify the UI shows the page as current (target visible pager)
        const currentPager = this.page.locator('.pages li.item.current .page span').filter({ hasText: pageNumber.toString() }).locator('visible=true');
        await expect(currentPager).toHaveText(pageNumber.toString());
    }

    async verifyGridView() {
        // Verify the main product wrapper has the grid class
        const gridContainer = this.page.locator('.products-grid');
        await expect(gridContainer).toBeVisible();

        // Verify items are displayed
        await expect(this.productGrid.first()).toBeVisible();

        // Optional: Verify it is NOT list view
        const listContainer = this.page.locator('.products-list');
        await expect(listContainer).toBeHidden();
    }
}
