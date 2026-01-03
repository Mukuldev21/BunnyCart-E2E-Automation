import { type Page, expect } from '@playwright/test';
import { Header } from '../components/Header';

export class LoginPage {
    readonly header: Header;

    constructor(private readonly page: Page) {
        this.header = new Header(page);
    }

    async navigateToLogin() {
        await this.page.goto('/');
        // await this.page.getByRole('link', { name: 'Sign In' }).click();
        this.header.clickSignIn();
        await this.page.waitForLoadState('load');
    }

    async login(email: string, pass: string) {
        await this.page.getByRole('textbox', { name: 'Email' }).click();
        await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
        await this.page.getByRole('textbox', { name: 'Password' }).click();
        await this.page.getByRole('textbox', { name: 'Password' }).fill(pass);
        await this.page.getByRole('button', { name: 'Sign In' }).click();
    }

    async verifyLoginError() {
        await expect(this.page.getByText('Invalid login or password.')).toBeVisible();
    }

    async clickForgotPassword() {
        await this.page.locator('.action.remind').click();
    }

    async submitForgotPassword(email: string) {
        await this.page.getByLabel('Email', { exact: true }).fill(email);
        // "Reset My Password" button text might vary, checking generic 'Reset' or the specific text
        await this.page.getByRole('button', { name: 'Reset My Password' }).click();
    }
}
