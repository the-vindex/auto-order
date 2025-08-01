import { test as base } from '@playwright/test';
// @ts-ignore
import { LoginPage } from '../page-objects/login.page';
// @ts-ignore
import { HomePage } from '../page-objects/home.page';
// @ts-ignore
import { ReminderPage } from '../page-objects/reminder.page';
// @ts-ignore
import { createTestUser, TestUser } from '../utils/api-helpers';

// Extend base test to include page objects and utilities
export const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  reminderPage: ReminderPage;
  testUser: TestUser;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  reminderPage: async ({ page }, use) => {
    await use(new ReminderPage(page));
  },

  // Create a fresh test user for each test that needs one
  testUser: async ({ request }, use) => {
    const user = await createTestUser(request);
    await use(user);
    // Note: We're not cleaning up users as per the requirement
  },
});

export { expect } from '@playwright/test';