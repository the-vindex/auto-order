import { test as setup, expect } from '@playwright/test';
import { createAndLoginTestUser } from './utils/api-helpers';

const authFile = '.auth/user.json';
//@CLAUD: This seems to do the same as @globalSetup in global-setup.ts, but it is not used in the test files.
setup('authenticate', async ({ page, request }) => {
  const apiBaseURL = 'http://localhost:3000';
  
  // Create a test user via API
  const { user } = await createAndLoginTestUser(request, apiBaseURL);
  
  console.log(`Created and logging in test user: ${user.email}`);

  // Navigate to login page and authenticate via UI
  await page.goto('/login');
  
  // Fill login form
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for successful login (redirect to home page)
  await page.waitForURL('**/');
  
  // Verify we're logged in by checking for authenticated content
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  
  // Save authenticated state
  await page.context().storageState({ path: authFile });
  
  console.log('Authentication state saved');
});