import { test, expect } from '../fixtures/test';

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page, loginPage, homePage, testUser }) => {
    await loginPage.goto();
    await loginPage.waitForLoad();
    
    await loginPage.login(testUser.email, testUser.password);
    
    // Should redirect to home page
    await homePage.waitForLoad();
    await expect(page).toHaveURL('/');
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.waitForLoad();
    
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    // Should show error message
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toMatch(/Account not found|Invalid/i);
  });

  test('should logout successfully', async ({ page, homePage }) => {
    // Test starts with authenticated user due to storageState
    await homePage.goto();
    await homePage.waitForLoad();
    
    await homePage.logout();
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });

  test('should redirect to login when accessing protected route without auth', async ({ 
    page, 
    context 
  }) => {
    // Clear authentication state
    await context.clearCookies();
    await context.clearPermissions();
    
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});