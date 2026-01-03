import { type Page, expect } from '@playwright/test';

export class Header {
    constructor(private readonly page: Page) { }

    async clickSignIn() {
        await this.page.getByRole('link', { name: 'Sign In' }).first().click();
    }

    async clickCreateAccount() {
        await this.page.getByRole('link', { name: 'Create an Account' }).click();
    }

    async clickSignOut() {
        // Updated based on codegen: straightforward lookup
        await this.page.getByText('Sign out').first().click();
    }

    async verifyWelcomeMessage(firstName: string, lastName: string) {
        // Updated based on codegen: "Welcome, test user12!" logic
        // Codegen: await expect(page.getByRole('listitem').filter({ hasText: 'Welcome, test user12!' }).locator('span')).toBeVisible();
        const expectedText = `Welcome, ${firstName} ${lastName}!`;
        await expect(
            this.page.getByRole('listitem')
                .filter({ hasText: expectedText })
                .locator('span')
        ).toBeVisible();
    }

    async isSignInLinkVisible(): Promise<boolean> {
        return await this.page.getByRole('link', { name: 'Sign In' }).first().isVisible();
    }
}
