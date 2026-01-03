import { type Page, expect } from '@playwright/test';
import { Header } from '../components/Header';

export interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobile?: string;
}

export class RegisterPage {
    readonly header: Header;

    constructor(private readonly page: Page) {
        this.header = new Header(page);
    }

    async navigateToRegister() {
        // Updated based on codegen: goto('/') then click "Create an Account"
        await this.page.goto('/');
        await this.header.clickCreateAccount();
    }

    async registerNewUser(data: RegistrationData) {
        // Updated based on codegen
        await this.page.getByRole('textbox', { name: 'First Name*' }).fill(data.firstName);
        await this.page.getByRole('textbox', { name: 'Last Name*' }).fill(data.lastName);
        await this.page.getByRole('textbox', { name: 'Email*' }).fill(data.email);

        // Password fields
        await this.page.getByRole('textbox', { name: 'Password*', exact: true }).fill(data.password);
        await this.page.getByRole('textbox', { name: 'Confirm Password*' }).fill(data.password);

        // Mobile (if provided, or default dummy)
        const mobile = data.mobile || '9876543210';
        await this.page.getByRole('textbox', { name: 'Mobile Number*' }).fill(mobile);

        await this.page.getByRole('button', { name: 'Create an Account' }).click();
    }

    async verifyRegistrationSuccess() {
        // Codegen: await expect(page.getByRole('listitem').filter({ hasText: 'Welcome, ...' }).locator('span')).toBeVisible();
        // This is handled by Header.verifyWelcomeMessage.
        // We can just verify URL or "Thank you" if it exists, but codegen didn't explicitly show "Thank you" verification,
        // it showed the welcome message verification. We'll stick to URL or let the test spec call Header verification.
        await expect(this.page).toHaveURL(/.*\/customer\/account\//);
    }
}
