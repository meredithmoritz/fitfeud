import { Page, Locator, expect } from '@playwright/test';

export class RegistrationPage {
    readonly page: Page;
    readonly registerButton: Locator;
    readonly registerHeader: Locator;
    readonly emailInput: Locator;
    readonly usernameInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerButton = page.getByTestId('register-button');
        this.registerHeader = page.getByTestId('register-header');
        this.emailInput = page.getByTestId('register-email');
        this.usernameInput = page.getByTestId('register-username');
        this.firstNameInput = page.getByTestId('register-firstname');
        this.lastNameInput = page.getByTestId('register-lastname');
        this.passwordInput = page.getByTestId('register-password');
        this.confirmPasswordInput = page.getByTestId('register-confirmpassword');
        this.submitButton = page.getByTestId('register-submit');
    }

    async goto() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }

    async openRegistrationForm() {
        await this.registerButton.click();
        await this.registerHeader.waitFor({ state: 'visible' });
    }

    async verifyRegistrationFormVisible() {
        await expect(this.registerHeader).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.usernameInput).toBeVisible();
        await expect(this.firstNameInput).toBeVisible();
        await expect(this.lastNameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.confirmPasswordInput).toBeVisible();
        await expect(this.submitButton).toBeVisible();
    }

    async register(email: string, username: string, firstName: string, lastName: string, password: string, confirmPassword: string) {
        await this.emailInput.fill(email);
        await this.usernameInput.fill(username);
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
        await this.submitButton.click();
    }

    async verifySuccessfulRegistration() {
        await this.page.waitForLoadState('networkidle')
        await expect(this.page.getByTestId('welcome-user')).toBeVisible();
    }


}