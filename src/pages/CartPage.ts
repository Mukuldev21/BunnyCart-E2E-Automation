import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly subtotal: Locator;
    readonly updateCartButton: Locator;
    readonly pageTitle: Locator;
    readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
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
    }

    async proceedToCheckout() {
        await expect(this.proceedToCheckoutButton).toBeVisible({ timeout: 10000 });
        await this.proceedToCheckoutButton.click();
    }

    async verifyCartPageLoaded() {
        // Verify URL contains /checkout/cart/
        await expect(this.page).toHaveURL(/.*\/checkout\/cart\//, { timeout: 15000 });
        // Verify page title
        await expect(this.pageTitle).toContainText(/Shopping Cart/i, { timeout: 10000 });
    }

    async verifyItemInCart(itemName: string) {
        // Verify item is visible in cart
        const item = this.cartItems.filter({ hasText: itemName });
        await expect(item).toBeVisible({ timeout: 10000 });
    }

    async getSubtotal(): Promise<string> {
        // Get subtotal text
        const text = await this.subtotal.textContent();
        return text || '';
    }

    async verifySubtotalVisible() {
        // Verify subtotal is visible
        await expect(this.subtotal).toBeVisible({ timeout: 10000 });
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
        await qtyInput.fill(quantity.toString());
        await qtyInput.press('Enter');
        await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }

    async getSubtotalAmount(): Promise<number> {
        // Get subtotal as a number
        const text = await this.subtotal.textContent();
        // Remove currency symbol and commas, then parse
        // Assuming format like "₹123.00" or "$123.00"
        const cleanText = text?.replace(/[^0-9.]/g, '') || '0';
        return parseFloat(cleanText);
    }

    async clickUpdateCart() {
        // Click update cart button
        await expect(this.updateCartButton).toBeVisible({ timeout: 10000 });
        await this.updateCartButton.click();
        await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
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

        await expect(removeButton).toBeVisible({ timeout: 10000 });
        await removeButton.click();
    }

    async verifyEmptyCart() {
        // Verify empty cart message
        // Use .first() or specific container to avoid strict mode error (minicart vs main page)
        // Preferring main content if possible, but .first() is sufficient for "visible" check
        await expect(this.page.locator('.cart-empty').filter({ hasText: /You have no items/i }).first()).toBeVisible({ timeout: 10000 });
    }

    async verifyItemNotInCart(itemName: string) {
        // Verify item is NOT visible in cart
        const item = this.cartItems.filter({ hasText: itemName });
        await expect(item).toBeHidden({ timeout: 10000 });
    }
}
