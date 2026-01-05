import { type Page, type Locator, expect } from '@playwright/test';
import { Header } from '../components/Header';

export class CategoryPage {
    readonly page: Page;
    readonly header: Header;
    readonly pageHeading: Locator;
    readonly breadcrumbs: Locator;
    readonly productGrid: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.pageHeading = page.locator('h1.page-title');
        this.breadcrumbs = page.locator('.breadcrumbs');
        this.productGrid = page.locator('.product-item');
    }

    async verifyCategoryLoaded(categoryName: string) {
        // Verify Page Title (Browser Tab)
        const title = await this.page.title();
        expect(title).toContain(categoryName);

        // Verify Breadcrumbs first as they are always visible
        await expect(this.breadcrumbs).toBeVisible();
        await expect(this.breadcrumbs).toContainText(`Home ${categoryName}`);

        // Verify Products
        // We expect at least one product
        await expect(this.productGrid.first()).toBeVisible();
    }

    async filterByPrice(rangeText: string) {
        // Expand Price section if needed (usually strictly open, but good to be safe)
        // For Luma theme, it's often under "Shopping Options"
        // Locator strategy: Find the Price filter group, then click the range
        // We'll use a robust text match
        const filterLink = this.page.locator('#narrow-by-list a').filter({ hasText: rangeText });
        await filterLink.click();
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
        const clearAll = this.page.locator('.action.clear.filter-clear');
        if (await clearAll.isVisible()) {
            await clearAll.click();
        }
    }
}
