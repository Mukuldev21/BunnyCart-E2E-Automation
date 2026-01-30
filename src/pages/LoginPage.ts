import { type Page, expect } from '@playwright/test';
import { Header } from '../components/Header';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly header: Header;

    constructor(page: Page) {
        super(page);
        this.header = new Header(page);
    }

    /**
     * Navigate to homepage (required for some auth tests)
     */
    async navigateToHomepage() {
        await this.navigateTo('/');
    }

    /**
     * Navigate to login page via homepage → Sign In link
     * Use this for tests that need to start from homepage (e.g., negative tests)
     */
    async navigateToLoginViaHomepage() {
        await this.navigateToHomepage();
        await this.header.clickSignIn();
    }

    /**
     * Navigate directly to login page (optimized - no homepage redirect)
     * Use this for positive login tests where direct navigation is acceptable
     * BEFORE: goto('/') → click('Sign In') → wait (2 page loads)
     * AFTER: goto('/customer/account/login') (1 page load)
     * Performance gain: ~3-5 seconds
     */
    async navigateToLogin() {
        await this.navigateTo('/customer/account/login');
    }

    async login(email: string, pass: string) {
        const emailInput = this.page.getByRole('textbox', { name: 'Email' });
        const passwordInput = this.page.getByRole('textbox', { name: 'Password' });
        const signInButton = this.page.getByRole('button', { name: 'Sign In' });

        await this.fill(emailInput, email);
        await this.fill(passwordInput, pass);
        await this.click(signInButton);
    }

    async verifyLoginError() {
        const errorMessage = this.page.getByText('Invalid login or password.');
        await this.verifyVisible(errorMessage, this.DEFAULT_TIMEOUT);
    }

    async clickForgotPassword() {
        // Use a more specific locator to differentiate from the 'Checkout using your account' block
        const forgotPasswordLink = this.page.getByLabel('Sign In').getByText('Forgot Your Password?', { exact: true });
        await this.click(forgotPasswordLink, { timeout: this.DEFAULT_TIMEOUT });
    }

    async submitForgotPassword(email: string) {
        // Use Container + Filter pattern to target the correct form (avoiding header/login forms)
        const form = this.page.locator('form').filter({ has: this.page.getByRole('button', { name: 'Reset My Password' }) });
        const emailInput = form.getByLabel('Email');
        const resetButton = form.getByRole('button', { name: 'Reset My Password' });

        await this.fill(emailInput, email);
        await this.click(resetButton);
    }
}
