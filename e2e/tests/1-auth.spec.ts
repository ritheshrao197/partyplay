import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow guest login and save to localStorage', async ({ page }) => {
    await page.goto('/login');
    
    // Click Play as Guest
    await page.getByRole('button', { name: /Play as Guest/i }).click();
    
    // Verify successful login redirects to home
    await expect(page).toHaveURL('/');
    
    // Verify localStorage has the token and user data via Zustand's persist key
    const storageState = await page.evaluate(() => {
      return localStorage.getItem('partyplay-auth');
    });
    
    expect(storageState).not.toBeNull();
    expect(storageState).toContain('token');
  });

  test('should allow updating username in profile', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByRole('button', { name: /Play as Guest/i }).click();
    await expect(page).toHaveURL('/');

    // Navigate to profile
    await page.goto('/profile');
    
    // Click edit button next to the h2 username
    await page.locator('h2 + button').click();

    // Fill in new username
    await page.locator('input[type="text"]').fill('TestUser1');
    
    // Click save (the green button with check)
    await page.locator('button.bg-green-600').click();

    // Verify username updated on screen
    await expect(page.locator('h2')).toHaveText('TestUser1');
  });

  test('should auto-login on refresh', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Play as Guest/i }).click();
    await expect(page).toHaveURL('/');
    
    // Refresh the page
    await page.reload();
    
    // Should still be on the authenticated page
    await expect(page).toHaveURL('/');
  });
});
