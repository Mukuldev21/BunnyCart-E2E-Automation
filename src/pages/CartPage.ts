import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
    readonly subtotal: Locator;
    readonly updateCartButton: Locator;
    readonly pageTitle: Locator;
    readonly proceedToCheckoutButton: Locator;
    readonly continueShoppingLink: Locator;

    constructor(page: Page) {
        super(page);
        // Cart items container
        this.cartItems = page.locator('.cart.item');
        // Subtotal in order summary
        this.subtotal = page.locator('.grand.totals .amount .price');
        // Update cart button - Relaxed regex with CSS fallback
        // Magento 2 uses 'action update' class
        this.updateCartButton = page.locator('button.action.update').or(page.getByRole('button', { name: /Update.*Cart/i }));
        // Page title
        this.pageTitle = page.locator('h1.page-title');
        // Proceed to Checkout button
        this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });
        // Continue Shopping link (appears when cart is empty)
        this.continueShoppingLink = page.getByRole('link', { name: /continue shopping/i });
    }

    async proceedToCheckout() {
        await this.verifyVisible(this.proceedToCheckoutButton, this.DEFAULT_TIMEOUT);
        await this.click(this.proceedToCheckoutButton);
    }

    async verifyCartPageLoaded() {
        // Verify URL contains /checkout/cart/
        await this.verifyURL(/.*\/checkout\/cart\//, 15000);
        // Verify page title
        await this.verifyText(this.pageTitle, /Shopping Cart/i, this.DEFAULT_TIMEOUT);
    }

    async verifyItemInCart(itemName: string) {
        // Verify item is visible in cart
        const item = this.cartItems.filter({ hasText: itemName });
        await this.verifyVisible(item, this.DEFAULT_TIMEOUT);
    }

    async getSubtotal(): Promise<string> {
        // Get subtotal text
        return await this.getText(this.subtotal);
    }

    async verifySubtotalVisible() {
        // Verify subtotal is visible
        await this.verifyVisible(this.subtotal, this.DEFAULT_TIMEOUT);
    }

    async getItemQuantity(itemName: string): Promise<string> {
        // Get quantity for specific item
        const item = this.cartItems.filter({ hasText: itemName });
        const qtyInput = item.locator('input.qty');
        return await qtyInput.inputValue();
    }

    async updateItemQuantity(itemName: string, quantity: number) {
        // Update quantity for specific item
        const item = this.cartItems.filter({ hasText: itemName });
        const qtyInput = item.locator('input.qty');
        await this.fill(qtyInput, quantity.toString());
        await this.pressKey(qtyInput, 'Enter');
        // Wait for cart to update (element-based wait)
        await this.waitForElement(this.subtotal);
    }

    async getSubtotalAmount(): Promise<number> {
        // Get subtotal as a number
        const text = await this.getText(this.subtotal);
        // Remove currency symbol and commas, then parse
        // Assuming format like "₹123.00" or "$123.00"
        const cleanText = text?.replace(/[^0-9.]/g, '') || '0';
        return parseFloat(cleanText);
    }

    async clickUpdateCart() {
        // Click update cart button
        await this.verifyVisible(this.updateCartButton, this.DEFAULT_TIMEOUT);
        await this.click(this.updateCartButton);
        // Wait for cart to update (element-based wait)
        await this.waitForElement(this.subtotal);
    }

    async removeItem(itemName: string) {
        // Remove specific item from cart
        const item = this.cartItems.filter({ hasText: itemName });
        const removeButton = item.locator('.action.action-delete')
            .or(item.getByRole('button', { name: /Remove item/i }))
            .or(item.getByTitle('Remove item'));

        // Handle confirmation dialog if it appears
        this.page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.accept().catch(() => { });
        });

        await this.verifyVisible(removeButton, this.DEFAULT_TIMEOUT);
        await this.click(removeButton);
    }

    async verifyEmptyCart() {
        // Verify empty cart message
        // Use .first() or specific container to avoid strict mode error (minicart vs main page)
        // Preferring main content if possible, but .first() is sufficient for "visible" check
        const emptyCartMessage = this.page.locator('.cart-empty').filter({ hasText: /You have no items/i }).first();
        await this.verifyVisible(emptyCartMessage, this.DEFAULT_TIMEOUT);
    }

    async verifyItemNotInCart(itemName: string) {
        // Verify item is NOT visible in cart
        const item = this.cartItems.filter({ hasText: itemName });
        await this.verifyHidden(item, this.DEFAULT_TIMEOUT);
    }

    async verifyContinueShoppingLink() {
        // Verify continue shopping link is visible
        await this.verifyVisible(this.continueShoppingLink, this.DEFAULT_TIMEOUT);
    }
}
