import { type Page, expect } from '@playwright/test';
import { Header } from '../components/Header';

export interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class RegisterPage {
    readonly header: Header;

    constructor(private readonly page: Page) {
        this.header = new Header(page);
    }

    async navigateToRegister() {
        await this.page.goto('/');
        this.header.clickCreateAccount();
        await this.page.waitForLoadState('load');
    }

    async registerNewUser(data: RegistrationData) {
        await this.page.locator('#firstname').fill(data.firstName);
        await this.page.locator('#lastname').fill(data.lastName);
        await this.page.locator('#email_address').fill(data.email);
        // Password fields might have specific IDs or labels
        await this.page.locator('#password').fill(data.password);
        await this.page.locator('#password-confirmation').fill(data.password);

        await this.page.locator('button.action.submit.primary').click();
    }

    async verifyRegistrationSuccess() {
        await expect(this.page.getByText('Thank you for registering with BunnyCart.')).toBeVisible();
        await expect(this.page).toHaveURL(/.*\/customer\/account\//);
    }
}
