import { type Page, type Locator, expect } from '@playwright/test';
import { Header } from '../components/Header';

export class ProductDetailsPage {
    readonly page: Page;
    readonly header: Header;
    readonly pageHeading: Locator;
    readonly addToCartButton: Locator;
    readonly productPrice: Locator;
    readonly productSku: Locator;
    readonly productStock: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        // Use Semantic Locators (Priority 1) where possible
        this.pageHeading = page.locator('h1.page-title span'); // Keeping for specificity as h1 role might be broad

        // Semantic Button for Add to Cart
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });

        // Price - Data attribute is stable (Priority 2), kept for precision
        this.productPrice = page.locator('[data-price-type="finalPrice"] .price').first();

        // SKU - Class based, but strictly specific
        this.productSku = page.locator('.product.attribute.sku .value');

        // Stock - Locate by text content if role is missing
        // "In Stock" or "Out of stock" are the key text indicators
        // Removing visible=true to allow verifying data presence (toBeAttached) even if hidden by CSS
        this.productStock = page.locator('.stock').getByText(/In Stock|Out of stock/i).first();
    }

    async verifyProductLoaded(productName: string) {
        // Verify Title matches
        // Using normalize text to avoid whitespace issues
        await expect(this.pageHeading).toBeVisible();
        await expect(this.pageHeading).toContainText(productName, { ignoreCase: true });

        // Verify Price is visible
        await expect(this.productPrice).toBeVisible();
        const priceText = await this.productPrice.textContent();
        expect(priceText).toMatch(/[0-9]/); // Should contain numbers

        // Verify SKU (Hidden by CSS on some layouts, so checking presence/attachment instead of visibility)
        await expect(this.productSku).toBeAttached();
        const skuText = await this.productSku.textContent();
        expect(skuText?.length).toBeGreaterThan(0);

        // Verify Stock Status (Check presence if visibility is flakey on OOS/Responsive)
        await expect(this.productStock).toBeAttached();
        const stockText = await this.productStock.textContent();
        expect(stockText).toMatch(/(In Stock|Out of Stock)/i);

        // Verify Add to Cart button layout
        await expect(this.addToCartButton).toBeVisible();
    }

    async selectOption(optionName: string) {
        // Select option by name (Semantic: getByRole('option'))
        // Note: Some Magento setups use divs as swatches, but codegen suggests 'option' role exists.
        // We will try semantic first, fallback to swatch if needed.
        const option = this.page.getByRole('option', { name: optionName });
        await expect(option).toBeVisible();
        await option.click();
    }

    async addToCart() {
        await expect(this.addToCartButton).toBeVisible();
        await this.addToCartButton.click();
    }

    async verifySuccessMessage(text: string | RegExp) {
        // Dynamic locator for message
        // Use exact: false to allow partial string matches (e.g. "You added" matching "You added X")
        await expect(this.page.getByText(text, { exact: false })).toBeVisible({ timeout: 10000 });
    }
}
