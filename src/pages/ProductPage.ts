import { type Page, expect } from '@playwright/test';

export class ProductPage {
    constructor(private readonly page: Page) { }

    async navigateToProduct(url: string) {
        await this.page.goto(url);
    }

    async addToCart() {
        // Assuming standard Magento-like structure or BunnyCart specific
        await this.page.getByRole('button', { name: 'Add to Cart' }).click();
        // Wait for success message or mini-cart update
        await expect(this.page.getByText('You added')).toBeVisible();
    }
}
