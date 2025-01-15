import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly loginButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly loginHeader: Locator;
    readonly emailError: Locator;
    readonly passwordError: Locator;
    readonly authError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.getByTestId('login-button');
        this.emailInput = page.getByTestId('login-email');
        this.passwordInput = page.getByTestId('login-password');
        this.submitButton = page.getByTestId('login-submit');
        this.loginHeader = page.getByRole('heading', { name: 'Log in' });
        this.emailError = page.getByText('Email is required');
        this.passwordError = page.getByText('Please enter a password');
        this.authError = page.getByRole('alert');
    }

    async goto() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }

    async openLoginForm() {
        await this.loginButton.click();
        await this.loginHeader.waitFor({ state: 'visible' });
    }

    async verifyLoginFormVisible() {
        await expect(this.loginHeader).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.submitButton).toBeVisible();
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async verifyValidationErrors() {
        await expect(this.emailError).toBeVisible();
        await expect(this.passwordError).toBeVisible();
    }

    async verifyAuthError(errorMessage: string) {
        await expect(this.authError).toContainText(errorMessage);
    }

    async verifySuccessfulLogin() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.getByTestId('welcome-user')).toBeVisible();
    }
}