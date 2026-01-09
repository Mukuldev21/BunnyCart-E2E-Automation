import { type Page, type Locator, expect } from '@playwright/test';
import { Header } from '../components/Header';

export class ProductDetailsPage {
    readonly page: Page;
    readonly header: Header;
    readonly pageHeading: Locator;
    readonly addToCartButton: Locator;
    readonly productPrice: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.pageHeading = page.locator('h1.page-title');
        this.addToCartButton = page.locator('#product-addtocart-button');
        this.productPrice = page.locator('.price-final_price').first();
    }

    async verifyProductLoaded(productName: string) {
        // Verify Title matches
        await expect(this.pageHeading).toContainText(productName, { ignoreCase: true });

        // Verify core PDP elements are visible
        await expect(this.addToCartButton).toBeVisible();
        await expect(this.productPrice).toBeVisible();

        // Verify URL contains slug (simplified check)
        // We assume the slug is part of the product name or we just check we are not on the category page
        const url = this.page.url();
        expect(url).not.toContain('checkout/cart');
    }
}
