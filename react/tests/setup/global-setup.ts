import { chromium, FullConfig } from '@playwright/test';
// @ts-ignore
import { createAndLoginTestUser } from '../utils/api-helpers';

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:5173';
  const apiBaseURL = 'http://localhost:3000';
  
  // Create a browser instance for authentication
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Create a test user via API

    //@CLAUDE: Here you create and login user, you ignore cookie and go to login user agian. Is it necessary?
    const { user } = await createAndLoginTestUser(context.request, apiBaseURL);
    
    console.log(`Created test user: ${user.email}`);

    // Navigate to login page and authenticate via UI
    await page.goto(`${baseURL}/login`);
    
    // Fill login form
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for successful login (redirect to home page)
    await page.waitForURL('**/');
    
    // Save authenticated state
    await context.storageState({ path: '.auth/user.json' });
    
    console.log('Authentication state saved to .auth/user.json');
    
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;