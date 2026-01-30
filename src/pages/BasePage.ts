import { type Page, type Locator, expect } from '@playwright/test';

/**
 * BasePage - Foundation class for all Page Objects
 * 
 * Provides optimized common utilities to improve test execution performance:
 * - Smart navigation (defaults to 'domcontentloaded' instead of 'load')
 * - Optimized wait strategies (eliminates redundant waits)
 * - Reusable action methods with built-in auto-wait
 * - Centralized timeout configuration
 */
export class BasePage {
    readonly page: Page;

    // Centralized timeout configuration
    protected readonly DEFAULT_TIMEOUT = 10000;
    protected readonly SHORT_TIMEOUT = 5000;
    protected readonly LONG_TIMEOUT = 30000;

    constructor(page: Page) {
        this.page = page;
    }

    // ==================== NAVIGATION METHODS ====================

    /**
     * Smart navigation - defaults to 'domcontentloaded' for faster page loads
     * @param url - URL to navigate to (can be relative or absolute)
     * @param waitUntil - Load state to wait for (default: 'domcontentloaded')
     */
    async navigateTo(url: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' = 'domcontentloaded') {
        await this.page.goto(url, { waitUntil });
    }

    /**
     * Reload the current page
     * @param waitUntil - Load state to wait for (default: 'domcontentloaded')
     */
    async reload(waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded') {
        await this.page.reload({ waitUntil });
    }

    // ==================== WAIT METHODS ====================

    /**
     * Smart element wait - waits for element to be visible and stable
     * @param locator - Element locator
     * @param timeout - Custom timeout (optional)
     */
    async waitForElement(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Wait for element to be hidden
     * @param locator - Element locator
     * @param timeout - Custom timeout (optional)
     */
    async waitForElementHidden(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT) {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    /**
     * Wait for element to be attached to DOM
     * @param locator - Element locator
     * @param timeout - Custom timeout (optional)
     */
    async waitForElementAttached(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT) {
        await locator.waitFor({ state: 'attached', timeout });
    }

    /**
     * Conditional navigation wait - only waits if navigation is expected
     * Use this instead of Promise.all with waitForNavigation
     * @param action - Action that may trigger navigation
     * @param shouldWait - Whether to wait for navigation (default: true)
     */
    async performActionWithNavigation(action: () => Promise<void>, shouldWait: boolean = true) {
        if (shouldWait) {
            await Promise.all([
                this.page.waitForLoadState('domcontentloaded'),
                action()
            ]);
        } else {
            await action();
        }
    }

    /**
     * Wait for network to be idle - use sparingly, only when truly needed
     * This is slow (waits 500ms of no network activity)
     */
    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle');
    }

    // ==================== ACTION METHODS ====================

    /**
     * Click element with auto-wait for actionability
     * @param locator - Element locator
     * @param options - Click options
     */
    async click(locator: Locator, options?: { timeout?: number; force?: boolean }) {
        await locator.click({ timeout: options?.timeout || this.DEFAULT_TIMEOUT, force: options?.force });
    }

    /**
     * Fill input field with auto-wait
     * @param locator - Input locator
     * @param value - Value to fill
     * @param timeout - Custom timeout (optional)
     */
    async fill(locator: Locator, value: string, timeout: number = this.DEFAULT_TIMEOUT) {
        await locator.fill(value, { timeout });
    }

    /**
     * Select option from dropdown
     * @param locator - Select locator
     * @param value - Option value or label
     * @param timeout - Custom timeout (optional)
     */
    async selectOption(locator: Locator, value: string | string[], timeout: number = this.DEFAULT_TIMEOUT) {
        await locator.selectOption(value, { timeout });
    }

    /**
     * Get text content of element
     * @param locator - Element locator
     * @param timeout - Custom timeout (optional)
     */
    async getText(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT): Promise<string> {
        await this.waitForElement(locator, timeout);
        return await locator.textContent() || '';
    }

    /**
     * Get all text contents from multiple elements
     * @param locator - Element locator
     */
    async getAllTexts(locator: Locator): Promise<string[]> {
        await this.waitForElement(locator.first());
        return await locator.allTextContents();
    }

    /**
     * Check if element is visible
     * @param locator - Element locator
     * @param timeout - Custom timeout (optional)
     */
    async isVisible(locator: Locator, timeout: number = this.SHORT_TIMEOUT): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if element is hidden
     * @param locator - Element locator
     * @param timeout - Custom timeout (optional)
     */
    async isHidden(locator: Locator, timeout: number = this.SHORT_TIMEOUT): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'hidden', timeout });
            return true;
        } catch {
            return false;
        }
    }

    // ==================== ASSERTION HELPERS ====================

    /**
     * Verify element is visible with custom timeout
     * @param locator - Element locator
     * @param timeout - Custom timeout (optional)
     */
    async verifyVisible(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT) {
        await expect(locator).toBeVisible({ timeout });
    }

    /**
     * Verify element is hidden with custom timeout
     * @param locator - Element locator
     * @param timeout - Custom timeout (optional)
     */
    async verifyHidden(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT) {
        await expect(locator).toBeHidden({ timeout });
    }

    /**
     * Verify element contains text
     * @param locator - Element locator
     * @param text - Expected text (string or regex)
     * @param timeout - Custom timeout (optional)
     */
    async verifyText(locator: Locator, text: string | RegExp, timeout: number = this.DEFAULT_TIMEOUT) {
        await expect(locator).toContainText(text, { timeout });
    }

    /**
     * Verify element has exact text
     * @param locator - Element locator
     * @param text - Expected text (string or regex)
     * @param timeout - Custom timeout (optional)
     */
    async verifyExactText(locator: Locator, text: string | RegExp, timeout: number = this.DEFAULT_TIMEOUT) {
        await expect(locator).toHaveText(text, { timeout });
    }

    /**
     * Verify current URL matches pattern
     * @param pattern - URL pattern (string or regex)
     * @param timeout - Custom timeout (optional)
     */
    async verifyURL(pattern: string | RegExp, timeout: number = this.DEFAULT_TIMEOUT) {
        await expect(this.page).toHaveURL(pattern, { timeout });
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Execute action with retry mechanism
     * @param action - Action to execute
     * @param retries - Number of retries (default: 3)
     * @param delay - Delay between retries in ms (default: 1000)
     */
    async executeWithRetry<T>(
        action: () => Promise<T>,
        retries: number = 3,
        delay: number = 1000
    ): Promise<T> {
        let lastError: Error | null = null;

        for (let i = 0; i < retries; i++) {
            try {
                return await action();
            } catch (error) {
                lastError = error as Error;
                if (i < retries - 1) {
                    await this.page.waitForTimeout(delay);
                }
            }
        }

        throw lastError;
    }

    /**
     * Scroll element into view
     * @param locator - Element locator
     */
    async scrollIntoView(locator: Locator) {
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Hover over element
     * @param locator - Element locator
     * @param timeout - Custom timeout (optional)
     */
    async hover(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT) {
        await locator.hover({ timeout });
    }

    /**
     * Press key on element
     * @param locator - Element locator
     * @param key - Key to press
     */
    async pressKey(locator: Locator, key: string) {
        await locator.press(key);
    }

    /**
     * Get current page URL
     */
    getCurrentURL(): string {
        return this.page.url();
    }

    /**
     * Get page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Wait for specific duration (use sparingly - prefer element-based waits)
     * @param ms - Milliseconds to wait
     */
    async wait(ms: number) {
        await this.page.waitForTimeout(ms);
    }
}
