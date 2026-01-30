import { type Page, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class Header extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async clickSignIn() {
        const signInLink = this.page.getByRole('link', { name: 'Sign In' });
        await this.click(signInLink);
    }

    async clickCreateAccount() {
        const createAccountLink = this.page.getByRole('link', { name: 'Create an Account' });
        await this.click(createAccountLink);
    }

    async clickSignOut() {
        // Updated based on codegen: straightforward lookup
        const signOutLink = this.page.getByText('Sign out').first();
        await this.click(signOutLink);
    }

    async verifyWelcomeMessage(firstName: string, lastName: string) {
        // Use .logged-in class which is standard and robust
        // Use case-insensitive regex to handle capitalization differences
        const locator = this.page.locator('.logged-in').first();
        const regex = new RegExp(`Welcome, ${firstName} ${lastName}!`, 'i');

        // Reduced timeout from 10000ms to 5000ms for faster feedback
        // Reverting to DEFAULT_TIMEOUT (10000ms) as registration redirect can handle slow
        await this.verifyVisible(locator, this.DEFAULT_TIMEOUT);
        await this.verifyExactText(locator, regex, this.DEFAULT_TIMEOUT);
    }

    async isSignInLinkVisible(): Promise<boolean> {
        return await this.page.getByRole('link', { name: 'Sign In' }).isVisible();
    }

    async searchFor(query: string) {
        // Updated based on browser inspection: ID is 'search', placeholder is 'Search...'
        const searchInput = this.page.locator('#search');
        await this.fill(searchInput, query);
        await this.pressKey(searchInput, 'Enter');
    }

    async clickCategory(categoryName: string) {
        // Use exact text match for top-level menu items to avoid ambiguity
        // Exclude .side-megamenu to avoid duplicates on some resolutions/layouts
        const categoryLink = this.page.locator('nav.navigation:not(.side-megamenu) a.level-top').filter({ hasText: categoryName });
        await this.click(categoryLink);
    }

    async hoverAndClickSubCategory(mainCategory: string, subCategory: string) {
        // Find the main category LI to ensure we scope the sub-menu search within it
        const mainNav = this.page.locator('nav.navigation:not(.side-megamenu) a.level-top').filter({ hasText: mainCategory });

        // Hover to trigger dropdown
        await this.hover(mainNav);

        // Wait for sub-menu container to appear (generic wait)
        // Usually .submenu or .level0.submenu

        // Find the specific sub-category link RELATIVE to the main category, or global if unique
        // Using a global search for the visible link with that text is often more robust in mega menus
        // provided the text is unique enough.
        const subLink = this.page.locator('a.level-top, li.level1 a').filter({ hasText: subCategory }).locator('visible=true');

        // Wait for visibility explicitly
        await this.verifyVisible(subLink.first());
        await this.click(subLink.first());
    }

    // Mini-Cart Methods
    async clickCartIcon() {
        // "Your Cart" link with item count: "Your Cart ₹40.00 1 items"
        // Using partial match for robustness
        const cartLink = this.page.getByRole('link', { name: /Your Cart/i });
        await this.verifyVisible(cartLink);
        await this.click(cartLink);
    }

    async verifyMiniCartVisible() {
        // Verify the mini-cart container is visible
        // It might take animation time
        const miniCart = this.page.locator('.minicart-items-wrapper');
        const checkoutButton = this.page.getByRole('button', { name: 'Go to Checkout' });

        await this.verifyVisible(miniCart, this.DEFAULT_TIMEOUT);
        await this.verifyVisible(checkoutButton);
    }

    async clickProceedToCheckout() {
        const checkoutButton = this.page.getByRole('button', { name: 'Go to Checkout' });
        await this.click(checkoutButton);
    }

    async clickViewAndEditCart() {
        // Click "View and Edit Cart" link in mini-cart dropdown
        const viewCartLink = this.page.getByRole('link', { name: /View and Edit Cart/i });
        await this.click(viewCartLink);
    }
}
