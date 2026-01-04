import { type Page, expect } from '@playwright/test';

export class ProductPage {
    constructor(private readonly page: Page) { }

    async navigateToProduct(url: string) {
        await this.page.goto(url);
    }

    async selectOption(optionName: string) {
        // Handle options like "Net Pot"
        // Using getByRole('option') or text match as per codegen suggestion, 
        // assuming standard HTML select or custom dropdown
        // Codegen said: await page.getByRole('option', { name: 'Net Pot' }).click();
        // This implies likely a custom UI or listbox.
        await this.page.getByRole('option', { name: optionName }).click();
    }

    async addToCart() {
        // Assuming standard Magento-like structure or BunnyCart specific
        await this.page.getByRole('button', { name: 'Add to Cart' }).click();
        // Wait for success message or mini-cart update
        // Use .first() to avoid strict mode violation if multiple messages appear (e.g., in modal and main page)
        await expect(this.page.getByText('You added').first()).toBeVisible();
    }
}
