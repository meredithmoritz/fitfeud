import { test, expect } from '@playwright/test';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { UserData } from '../types/user';
import { RegistrationPage } from '../fixtures/registration.fixture';

const TEST_DIR = join(process.cwd(), 'tests');

const getRegistrationTestUser = async () => {
    const data = await readFile(join(TEST_DIR, 'fixtures/users.json'), 'utf-8');
    const allData = JSON.parse(data);
    return allData.registrationTestUsers.valid;
};

test.describe('User Registration', () => {
    let registrationUser: any;
    let registrationPage: RegistrationPage;

    test.beforeAll(async () => {
        registrationUser = await getRegistrationTestUser();
    });

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPage(page);
        await registrationPage.goto();
    });

    test('should display registration form with all fields', async ({ page }) => {
        await registrationPage.openRegistrationForm();
        await registrationPage.verifyRegistrationFormVisible();
    });

    test('should validate required fields', async ({ page }) => {
        await registrationPage.openRegistrationForm();
        await registrationPage.submitButton.click();

        // Check for required field errors
        await expect(page.getByText('Please enter a valid email')).toBeVisible();
        await expect(page.getByText('Please enter a username')).toBeVisible();
        await expect(page.getByText('Please enter a first name')).toBeVisible();
        await expect(page.getByText('Please enter a password')).toBeVisible();
        await expect(page.getByText('Please confirm your password')).toBeVisible();
    });

    test('should validate username requirements', async ({ page }) => {
        await registrationPage.openRegistrationForm();

        // Test username validation
        await registrationPage.usernameInput.fill('a');
        await registrationPage.submitButton.click();
        await expect(page.getByText('Username must be between 6-30 characters')).toBeVisible();


        await registrationPage.usernameInput.fill('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        await registrationPage.submitButton.click();
        await expect(page.getByText('Username must be between 6-30 characters')).toBeVisible();

        await registrationPage.usernameInput.fill('user name');
        await registrationPage.submitButton.click();
        await expect(page.getByText('Username can only contain letters, numbers, and hyphens')).toBeVisible();

        await registrationPage.usernameInput.fill('123username');
        await registrationPage.submitButton.click();
        await expect(page.getByText('Username must start with a letter')).toBeVisible();

        await registrationPage.usernameInput.fill('user--name');
        await registrationPage.submitButton.click();
        await expect(page.getByText('Username cannot contain consecutive hyphens')).toBeVisible();
    });

    test('should validate password confirmation', async ({ page }) => {
        await registrationPage.openRegistrationForm();

        await registrationPage.passwordInput.fill('password123');
        await registrationPage.confirmPasswordInput.fill('password456');
        await registrationPage.submitButton.click();

        await expect(page.getByText('Passwords do not match')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
        await registrationPage.openRegistrationForm();

        await registrationPage.emailInput.fill('invalid-email');
        await registrationPage.submitButton.click();

        await expect(page.getByText('Please enter a valid email')).toBeVisible();
    });

    test('should show error for existing username', async ({ page }) => {
        await registrationPage.openRegistrationForm();

        // Use existing username from your test data
        await registrationPage.emailInput.fill('new@example.com');
        await registrationPage.usernameInput.fill('meredith');  // existing username
        await registrationPage.firstNameInput.fill('Test');
        await registrationPage.passwordInput.fill('password123');
        await registrationPage.confirmPasswordInput.fill('password123');
        await registrationPage.submitButton.click();

        await expect(page.getByText('This username is already taken')).toBeVisible();
    });

    test('should successfully register a new user', async ({ page }) => {
        const testUser = await getRegistrationTestUser();
        await registrationPage.openRegistrationForm();

        // Fill in valid registration data
        await registrationPage.register(testUser.email, testUser.username, testUser.firstName, testUser.lastName, testUser.password, testUser.confirmPassword);

        await registrationPage.verifySuccessfulRegistration();
    });
});