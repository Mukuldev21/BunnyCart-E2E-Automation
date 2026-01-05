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
}
