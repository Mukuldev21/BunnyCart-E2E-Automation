import { type Page, type Locator, expect } from '@playwright/test';
import { Header } from '../components/Header';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
    readonly header: Header;
    readonly pageHeading: Locator;
    readonly addToCartButton: Locator;
    readonly productPrice: Locator;
    readonly productSku: Locator;
    readonly productStock: Locator;

    constructor(page: Page) {
        super(page);
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
        await this.verifyVisible(this.pageHeading);
        await this.verifyText(this.pageHeading, productName);

        // Verify Price is visible
        await this.verifyVisible(this.productPrice);
        const priceText = await this.getText(this.productPrice);
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
        await this.verifyVisible(this.addToCartButton);
    }

    async selectProductOption(optionName: string) {
        // Select option by name (Semantic: getByRole('option'))
        // Note: Some Magento setups use divs as swatches, but codegen suggests 'option' role exists.
        // We will try semantic first, fallback to swatch if needed.
        const option = this.page.getByRole('option', { name: optionName });
        await this.verifyVisible(option);
        await this.click(option);
    }

    async addToCart() {
        await this.verifyVisible(this.addToCartButton);
        await this.click(this.addToCartButton);
    }

    async verifySuccessMessage(text: string | RegExp) {
        // Dynamic locator for message
        // Use exact: false to allow partial string matches (e.g. "You added" matching "You added X")
        // Reduced timeout from 10000ms to 5000ms
        const messageLocator = this.page.getByText(text, { exact: false });
        await this.verifyVisible(messageLocator, this.SHORT_TIMEOUT);
    }

    async verifyValidationError(message: string) {
        // Validation error usually appears below the field or globally
        // "This is a required field." is standard Magento error
        const errorLocator = this.page.getByText(message);
        await this.verifyVisible(errorLocator);
    }

    // Image Gallery Methods
    async clickThumbnail(index: number) {
        // Magento Fotorama gallery thumbnails
        // Using generic locator for resilience, assuming standard gallery structure
        const thumbnails = this.page.locator('.fotorama__nav__shaft .fotorama__nav__frame--thumb');
        const thumbnail = thumbnails.nth(index);
        await this.verifyVisible(thumbnail);
        await this.click(thumbnail);
    }

    async getMainImageSrc(): Promise<string | null> {
        // Get the source of the currently active main image
        const activeImage = this.page.locator('.fotorama__stage__frame.fotorama__active .fotorama__img');
        await this.verifyVisible(activeImage);
        return await activeImage.getAttribute('src');
    }

    async verifyOutOfStock() {
        // Verify "Out of Stock" text is present in the stock locator
        await this.verifyVisible(this.productStock);
        await this.verifyText(this.productStock, 'Out of Stock');

        // Verify Add to Cart button is NOT visible or is disabled
        // In Magento, the button is often removed entirely for OOS items
        // Or it might be present but disabled.
        // Let's check if it's hidden OR disabled.
        const isVisible = await this.addToCartButton.isVisible();
        if (isVisible) {
            await expect(this.addToCartButton).toBeDisabled();
        } else {
            // If not visible, that's also valid for OOS
            expect(isVisible).toBeFalsy();
        }
    }

    async setQuantity(qty: number) {
        // Locator for Qty input
        const quantityInput = this.page.locator('#qty');
        await this.fill(quantityInput, qty.toString());
    }

    async enterQuantity(qty: string) {
        // Allow entering strings (e.g. empty, "0", "-1") for negative testing
        const quantityInput = this.page.locator('#qty');
        await this.fill(quantityInput, qty);
    }

    async addToWishlist() {
        // Locator for Add to Wish List
        // Often it's an icon with text hidden or visible on hover
        // Try locating by class or broader text match
        // .action.towishlist is standard Magento class
        const wishlistBtn = this.page.locator('.action.towishlist');
        await this.verifyVisible(wishlistBtn);
        await this.click(wishlistBtn);
    }

    async addToCompare() {
        // Locator for Add to Compare
        // Use :visible to skip hidden instances (e.g. mobile/desktop duplicates)
        const compareBtn = this.page.locator('.action.compare:visible').first();
        await this.verifyVisible(compareBtn);
        await this.click(compareBtn);
    }

    async selectRelatedProduct() {
        // Locator for related products link
        // Magento standard: .block.related .product-item-link
        const relatedProductLink = this.page.locator('.block.related .product-item-link').first();

        // Conditional check - Not all products have related items
        if (await relatedProductLink.isVisible()) {
            await this.click(relatedProductLink);
            return true;
        } else {
            console.log('WARN: No Related Products found');
            return false;
        }
    }
}
