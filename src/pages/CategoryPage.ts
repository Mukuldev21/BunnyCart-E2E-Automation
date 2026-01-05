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
}
