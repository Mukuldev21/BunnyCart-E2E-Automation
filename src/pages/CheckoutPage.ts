import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
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
        super(page);

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
        await this.verifyURL(/.*checkout.*/, 15000);
    }

    async loginFromCheckout(email: string, password: string) {
        // Login from checkout page
        await this.verifyVisible(this.emailInput, this.DEFAULT_TIMEOUT);
        await this.fill(this.emailInput, email);
        await this.fill(this.passwordInput, password);
        await this.click(this.signInButton);
        // Wait for checkout form to load after login
        await this.waitForElement(this.nextButton);
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
            await this.fill(this.firstNameInput, address.firstName);
        }

        if (address.lastName) {
            await this.fill(this.lastNameInput, address.lastName);
        }

        if (address.street1) {
            await this.fill(this.streetAddress1, address.street1);
        }

        if (address.street2) {
            await this.fill(this.streetAddress2, address.street2);
        }

        await this.selectOption(this.stateDropdown, address.stateId);
        await this.fill(this.cityInput, address.city);
        await this.fill(this.zipInput, address.zip);

        if (address.phone) {
            await this.fill(this.phoneInput, address.phone);
        }

        // Wait for shipping methods to load (element-based wait instead of hard timeout)
        await this.waitForElement(this.page.getByText('Shipping Methods'), 10000);
    }

    async verifyShippingMethodsVisible() {
        // Verify shipping methods section is visible
        const shippingMethodsHeading = this.page.getByText('Shipping Methods');
        await this.verifyVisible(shippingMethodsHeading, this.DEFAULT_TIMEOUT);
    }

    async verifyShippingMethod(methodName: string) {
        // Verify specific shipping method is visible
        const method = this.page.getByRole('cell', { name: methodName, exact: true });
        await this.verifyVisible(method, this.DEFAULT_TIMEOUT);
    }

    async verifyShippingRate(rate: string) {
        // Verify shipping rate is visible
        const rateElement = this.page.getByText(rate);
        await this.verifyVisible(rateElement, this.DEFAULT_TIMEOUT);
    }

    async clickNext() {
        // Click Next button to proceed to payment
        await this.verifyVisible(this.nextButton, this.DEFAULT_TIMEOUT);
        await this.click(this.nextButton);
        // Wait for payment step to load
        await this.verifyURL(/.*#payment/, 15000);
    }

    async selectShippingMethod(methodName: string) {
        // Select a shipping method by clicking its radio button
        const methodRadio = this.page.getByRole('radio', { name: new RegExp(methodName, 'i') });
        await this.verifyVisible(methodRadio, this.DEFAULT_TIMEOUT);
        await this.click(methodRadio);
        console.log(`Selected shipping method: ${methodName}`);
    }

    async verifyPaymentStepLoaded() {
        // Verify URL contains #payment
        await this.verifyURL(/.*#payment/, 15000);
    }

    async verifyShippingCostInSummary(cost: string) {
        // Verify shipping cost appears in order summary (in a table cell)
        const costCell = this.page.getByRole('cell', { name: cost }).first();
        await this.verifyVisible(costCell, this.DEFAULT_TIMEOUT);
    }
}
