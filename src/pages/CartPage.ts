import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly subtotal: Locator;
    readonly updateCartButton: Locator;
    readonly pageTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        // Cart items container
        this.cartItems = page.locator('.cart.item');
        // Subtotal in order summary
        this.subtotal = page.locator('.grand.totals .amount .price');
        // Update cart button
        this.updateCartButton = page.getByRole('button', { name: /Update Shopping Cart/i });
        // Page title
        this.pageTitle = page.locator('h1.page-title');
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
    }

    async clickUpdateCart() {
        // Click update cart button
        await this.updateCartButton.click();
        await this.page.waitForLoadState('load', { timeout: 15000 });
    }

    async removeItem(itemName: string) {
        // Remove specific item from cart
        const item = this.cartItems.filter({ hasText: itemName });
        const removeButton = item.getByRole('button', { name: /Remove item/i });
        await removeButton.click();
    }

    async verifyEmptyCart() {
        // Verify empty cart message
        await expect(this.page.getByText(/You have no items in your shopping cart/i)).toBeVisible({ timeout: 10000 });
    }
}
