import { type Page, type Locator, expect } from '@playwright/test';
import { Header } from '../components/Header';

export class SearchResultsPage {
    readonly page: Page;
    readonly header: Header;
    readonly pageHeading: Locator;
    readonly noResultsMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.pageHeading = page.locator('h1.page-title');
        this.noResultsMessage = page.locator('.message.notice');
    }

    async verifyResultsHeader(query: string) {
        // The expected text is usually "Search results for: 'query'"
        await expect(this.pageHeading).toBeVisible();
        await expect(this.pageHeading).toContainText(`Search results for: '${query}'`);
    }

    async verifyNoResultsMessage(query: string) {
        await expect(this.noResultsMessage).toBeVisible();
        await expect(this.noResultsMessage).toContainText(`Your search request '${query}' did not match any products.`);
    }

    async verifyProductVisible(productName: string) {
        // Using the Container + Filter pattern as per standards
        // Assuming there is a product item container, typically .product-item
        // We filter by valid text content
        const productItem = this.page.locator('.product-item').filter({ hasText: productName }).first();
        await expect(productItem).toBeVisible();
    }
}
