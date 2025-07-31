import { test as setup, expect } from '@playwright/test';
import { createAndLoginTestUser } from './utils/api-helpers';

const authFile = '.auth/user.json';
// Note: This setup is redundant with global-setup.ts which handles authentication
// for all tests. However, it can be useful for individual test authentication if needed.
setup('authenticate', async ({ page, request }) => {
  const apiBaseURL = 'http://localhost:3000';
  
  // Create a test user and login via API to get authentication cookies
  const { user, cookies } = await createAndLoginTestUser(request, apiBaseURL);
  
  console.log(`Created and logging in test user: ${user.email}`);

  // Navigate to the app and set cookies from API login
  await page.goto('/');
  
  // Parse and set cookies from API response
  for (const cookieString of cookies) {
    const cookieParts = cookieString.split(';')[0].split('=');
    if (cookieParts.length === 2) {
      await page.context().addCookies([{
        name: cookieParts[0].trim(),
        value: cookieParts[1].trim(),
        domain: 'localhost',
        path: '/'
      }]);
    }
  }
  
  // Refresh to apply cookies
  await page.reload();
  await page.waitForTimeout(1000);
  
  // Verify we're logged in by checking for authenticated content
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  
  // Save authenticated state
  await page.context().storageState({ path: authFile });
  
  console.log('Authentication state saved');
});