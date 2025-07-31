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
    // Create a test user and login via API to get authentication cookies
    const { user, cookies } = await createAndLoginTestUser(context.request, apiBaseURL);
    
    console.log(`Created test user: ${user.email}`);

    // Navigate to the app to establish browser context, then set cookies
    await page.goto(baseURL);
    
    // Parse and set cookies from API response  
    for (const cookieString of cookies) {
      const cookieParts = cookieString.split(';')[0].split('=');
      if (cookieParts.length === 2) {
        await context.addCookies([{
          name: cookieParts[0].trim(),
          value: cookieParts[1].trim(),
          domain: 'localhost',
          path: '/'
        }]);
      }
    }
    
    // Refresh page to apply cookies and verify authentication works
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Save authenticated state with API-obtained cookies
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