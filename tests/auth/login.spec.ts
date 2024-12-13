import { test, expect } from '@playwright/test';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { UserData } from '../types/user';

const TEST_DIR = join(process.cwd(), 'tests');

const getUsersData = async (): Promise<UserData> => {
    const data = await readFile(join(TEST_DIR, 'fixtures/users.json'), 'utf-8');
    return JSON.parse(data) as UserData;
};

test.describe('Login Flow', () => {
    let users: UserData;

    test.beforeAll(async () => {
        users = await getUsersData();
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should successfully log in with valid credentials', async ({ page }) => {
        const testUser = users.testUsers.standard;

        // Click login button
        const loginButton = page.getByRole('button', { name: /log in/i });
        await loginButton.waitFor({ state: 'visible' });
        await loginButton.click();

        // Fill login form
        await page.getByTestId('login-email').fill(testUser.email);
        await page.getByTestId('login-password').fill(testUser.password);

        // Submit form and wait for Firebase auth request
        await page.getByTestId('login-submit').click();

        // Submit form and wait for response
        await Promise.all([
            page.getByTestId('login-submit').click(),
            // Wait for Firebase auth request to complete
            page.waitForResponse(
                response => response.url().includes('identitytoolkit') &&
                    response.status() === 200
            )
        ]);

        // Verify successful login (assuming you have a welcome message with the user's name)
        await expect(page.getByTestId('welcome-user')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        // Click login button
        await page.getByRole('button', { name: /log in/i }).click();

        // Fill form with invalid credentials
        await page.getByTestId('login-email').fill('wrong@email.com');
        await page.getByTestId('login-password').fill('wrongpassword');
        await page.getByTestId('login-submit').click();

        // Wait for error message
        await expect(page.getByText('No account exists with this email')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
        // Click login button
        await page.getByRole('button', { name: /log in/i }).click();

        // Try to submit empty form
        await page.getByTestId('login-submit').click();

        // Check validation messages
        await expect(page.getByText('Email is required')).toBeVisible();
        await expect(page.getByText('Please enter a password')).toBeVisible();
    });
});