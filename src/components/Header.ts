import { type Page, expect } from '@playwright/test';

export class Header {
    constructor(private readonly page: Page) { }

    async clickSignIn() {
        await this.page.getByRole('link', { name: 'Sign In' }).first().click();
    }

    async clickCreateAccount() {
        await this.page.getByRole('link', { name: 'Create an Account' }).first().click();
    }

    async clickSignOut() {
        // Open the dropdown first
        await this.page.locator('.customer-name').first().click();
        await this.page.getByRole('link', { name: 'Sign Out' }).click();
    }

    async verifyWelcomeMessage(firstName: string, lastName: string) {
        // Selector found: span.logged-in
        // We use a regex to be robust against "Default welcome msg" vs "Welcome, Name!"
        // If name is provided, check for it.
        const locator = this.page.locator('span.logged-in').first();
        await locator.waitFor({ state: 'visible' });
        if (firstName && lastName) {
            await expect(locator).toHaveText(new RegExp(`Welcome, ${firstName} ${lastName}!`, 'i'));
        } else {
            await expect(locator).toContainText('Welcome');
        }
    }

    async isSignInLinkVisible(): Promise<boolean> {
        return await this.page.getByRole('link', { name: 'Sign In' }).first().isVisible();
    }
}
