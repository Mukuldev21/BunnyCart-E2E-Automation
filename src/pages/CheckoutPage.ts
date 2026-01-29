import { type Page, type Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly streetAddress2: Locator;
    readonly stateDropdown: Locator;
    readonly cityInput: Locator;
    readonly zipInput: Locator;
    readonly nextButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Login fields (for guest checkout)
        this.emailInput = page.getByRole('textbox', { name: 'Email Address*' });
        this.passwordInput = page.getByRole('textbox', { name: /Password.*\*/ });
        this.signInButton = page.getByRole('button', { name: 'Sign In' });

        // Shipping address fields
        this.streetAddress2 = page.getByRole('textbox', { name: 'Street Address: Line 2' });
        this.stateDropdown = page.locator('select[name="region_id"]');
        this.cityInput = page.getByRole('textbox', { name: 'City*' });
        this.zipInput = page.getByRole('textbox', { name: 'Zip/Postal Code*' });

        // Navigation
        this.nextButton = page.getByRole('button', { name: 'Next' });
    }

    async verifyCheckoutPageLoaded() {
        // Verify URL contains checkout
        await expect(this.page).toHaveURL(/.*checkout.*/, { timeout: 15000 });
    }

    async loginFromCheckout(email: string, password: string) {
        // Login from checkout page
        await expect(this.emailInput).toBeVisible({ timeout: 10000 });
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }

    async fillShippingAddress(address: {
        street2?: string;
        city: string;
        stateId: string;
        zip: string;
    }) {
        // Fill shipping address fields
        if (address.street2) {
            await this.streetAddress2.fill(address.street2);
        }

        await this.stateDropdown.selectOption(address.stateId);
        await this.cityInput.fill(address.city);
        await this.zipInput.fill(address.zip);

        // Wait for shipping methods to load
        await this.page.waitForTimeout(2000);
    }

    async verifyShippingMethodsVisible() {
        // Verify shipping methods section is visible
        await expect(this.page.getByText('Shipping Methods')).toBeVisible({ timeout: 10000 });
    }

    async verifyShippingMethod(methodName: string) {
        // Verify specific shipping method is visible
        const method = this.page.getByRole('cell', { name: methodName, exact: true });
        await expect(method).toBeVisible({ timeout: 10000 });
    }

    async verifyShippingRate(rate: string) {
        // Verify shipping rate is visible
        await expect(this.page.getByText(rate)).toBeVisible({ timeout: 10000 });
    }

    async clickNext() {
        // Click Next button to proceed to payment
        await expect(this.nextButton).toBeVisible({ timeout: 10000 });
        await this.nextButton.click();
        await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }
}
