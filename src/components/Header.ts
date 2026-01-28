import { type Page, expect } from '@playwright/test';

export class Header {
    constructor(private readonly page: Page) { }

    async clickSignIn() {
        await this.page.getByRole('link', { name: 'Sign In' }).click();
    }

    async clickCreateAccount() {
        await this.page.getByRole('link', { name: 'Create an Account' }).click();
    }

    async clickSignOut() {
        // Updated based on codegen: straightforward lookup
        await this.page.getByText('Sign out').first().click();
    }

    async verifyWelcomeMessage(firstName: string, lastName: string) {
        // Use .logged-in class which is standard and robust
        // Use case-insensitive regex to handle capitalization differences
        const locator = this.page.locator('.logged-in').first();
        await expect(locator).toBeVisible({ timeout: 10000 }); // Give it time to appear
        const regex = new RegExp(`Welcome, ${firstName} ${lastName}!`, 'i');
        await expect(locator).toHaveText(regex);
    }

    async isSignInLinkVisible(): Promise<boolean> {
        return await this.page.getByRole('link', { name: 'Sign In' }).isVisible();
    }

    async searchFor(query: string) {
        // Updated based on browser inspection: ID is 'search', placeholder is 'Search...'
        const searchInput = this.page.locator('#search');
        await searchInput.fill(query);
        await searchInput.press('Enter');
    }
    async clickCategory(categoryName: string) {
        // Use exact text match for top-level menu items to avoid ambiguity
        // Exclude .side-megamenu to avoid duplicates on some resolutions/layouts
        await this.page.locator('nav.navigation:not(.side-megamenu) a.level-top').filter({ hasText: categoryName }).click();
    }

    async hoverAndClickSubCategory(mainCategory: string, subCategory: string) {
        // Find the main category LI to ensure we scope the sub-menu search within it
        const mainNav = this.page.locator('nav.navigation:not(.side-megamenu) a.level-top').filter({ hasText: mainCategory });

        // Hover to trigger dropdown
        await mainNav.hover();

        // Wait for sub-menu container to appear (generic wait)
        // Usually .submenu or .level0.submenu

        // Find the specific sub-category link RELATIVE to the main category, or global if unique
        // Using a global search for the visible link with that text is often more robust in mega menus
        // provided the text is unique enough.
        const subLink = this.page.locator('a.level-top, li.level1 a').filter({ hasText: subCategory }).locator('visible=true');

        // Wait for visibility explicitly
        await expect(subLink.first()).toBeVisible();
        await subLink.first().click();
    }

    // Mini-Cart Methods
    async clickCartIcon() {
        // "Your Cart" link with item count: "Your Cart ₹40.00 1 items"
        // Using partial match for robustness
        const cartLink = this.page.getByRole('link', { name: /Your Cart/i });
        await expect(cartLink).toBeVisible();
        await this.page.waitForLoadState('domcontentloaded'); // Ensure DOM is ready
        await cartLink.click();
    }

    async verifyMiniCartVisible() {
        // Verify the mini-cart container is visible
        // It might take animation time
        const miniCart = this.page.locator('.minicart-items-wrapper');
        await expect(miniCart).toBeVisible({ timeout: 10000 });
        await expect(this.page.getByRole('button', { name: 'Go to Checkout' })).toBeVisible();
    }

    async clickProceedToCheckout() {
        await this.page.getByRole('button', { name: 'Go to Checkout' }).click();
    }

    async clickViewAndEditCart() {
        // Click "View and Edit Cart" link in mini-cart dropdown
        await this.page.getByRole('link', { name: /View and Edit Cart/i }).click();
        await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }
}
