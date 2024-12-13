import { Page } from '@playwright/test';

export async function clearTestEnvironment(page: Page) {
    await page.context().clearCookies();
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
}

export async function loginTestUser(page: Page, email: string, password: string) {
    await page.getByRole('button', { name: /log in/i }).click();
    await page.fill('[data-testid="login-email"]', email);
    await page.fill('[data-testid="login-password"]', password);
    await page.click('[data-testid="login-submit"]');
}