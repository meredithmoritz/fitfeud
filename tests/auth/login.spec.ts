import { test, expect } from '@playwright/test';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { UserData } from '../types/user';
import { LoginPage } from '../fixtures/login.fixture';

const TEST_DIR = join(process.cwd(), 'tests');

const getUsersData = async (): Promise<UserData> => {
    const data = await readFile(join(TEST_DIR, 'fixtures/users.json'), 'utf-8');
    return JSON.parse(data) as UserData;
};

test.describe('Login Flow', () => {
    let users: UserData;
    let loginPage: LoginPage;

    test.beforeAll(async () => {
        users = await getUsersData();
    });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test ('user can successfully access the login page', async ({page}) => {
        await loginPage.openLoginForm();
        await loginPage.verifyLoginFormVisible();
    })
    test('should successfully log in with valid credentials', async ({ page }) => {
        const testUser = users.testUsers.standard;
        await loginPage.openLoginForm();
        await loginPage.login(testUser.email, testUser.password);
        await loginPage.verifySuccessfulLogin();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await loginPage.openLoginForm();
        await loginPage.login('wrong@email.com', 'wrongpassword');
        await loginPage.verifyAuthError('No account exists with this email');
    });

    test('should validate required fields', async ({ page }) => {
        await loginPage.openLoginForm();
        await loginPage.submitButton.click();
        await loginPage.verifyValidationErrors();
    });
});