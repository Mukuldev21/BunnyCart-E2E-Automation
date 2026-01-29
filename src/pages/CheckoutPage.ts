import { type Page, type Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly streetAddress1: Locator;
    readonly streetAddress2: Locator;
    readonly stateDropdown: Locator;
    readonly cityInput: Locator;
    readonly zipInput: Locator;
    readonly phoneInput: Locator;
    readonly nextButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Login fields (for guest checkout)
        this.emailInput = page.getByRole('textbox', { name: 'Email Address*' });
        this.passwordInput = page.getByRole('textbox', { name: /Password.*\*/ });
        this.signInButton = page.getByRole('button', { name: 'Sign In' });

        // Shipping address fields
        this.firstNameInput = page.getByRole('textbox', { name: /First Name/ });
        this.lastNameInput = page.getByRole('textbox', { name: /Last Name/ });
        this.streetAddress1 = page.getByRole('textbox', { name: /Street Address: Line 1/ });
        this.streetAddress2 = page.getByRole('textbox', { name: /Street Address: Line 2/ });
        this.stateDropdown = page.locator('select[name="region_id"]');
        this.cityInput = page.getByRole('textbox', { name: /City/ });
        this.zipInput = page.getByRole('textbox', { name: /Zip\/Postal Code/ });
        this.phoneInput = page.getByRole('textbox', { name: /Phone Number/ });

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
        firstName?: string;
        lastName?: string;
        street1?: string;
        street2?: string;
        city: string;
        stateId: string;
        zip: string;
        phone?: string;
    }) {
        // Fill shipping address fields
        if (address.firstName) {
            await this.firstNameInput.fill(address.firstName);
        }

        if (address.lastName) {
            await this.lastNameInput.fill(address.lastName);
        }

        if (address.street1) {
            await this.streetAddress1.fill(address.street1);
        }

        if (address.street2) {
            await this.streetAddress2.fill(address.street2);
        }

        await this.stateDropdown.selectOption(address.stateId);
        await this.cityInput.fill(address.city);
        await this.zipInput.fill(address.zip);

        if (address.phone) {
            await this.phoneInput.fill(address.phone);
        }

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

    async selectShippingMethod(methodName: string) {
        // Select a shipping method by clicking its radio button
        const methodRadio = this.page.getByRole('radio', { name: new RegExp(methodName, 'i') });
        await expect(methodRadio).toBeVisible({ timeout: 10000 });
        await methodRadio.click();
        console.log(`Selected shipping method: ${methodName}`);
    }

    async verifyPaymentStepLoaded() {
        // Verify URL contains #payment
        await expect(this.page).toHaveURL(/.*#payment/, { timeout: 15000 });
    }

    async verifyShippingCostInSummary(cost: string) {
        // Verify shipping cost appears in order summary (in a table cell)
        const costCell = this.page.getByRole('cell', { name: cost }).first();
        await expect(costCell).toBeVisible({ timeout: 10000 });
    }
}
