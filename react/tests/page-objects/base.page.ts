import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the page
   */
  abstract goto(): Promise<void>;

  /**
   * Wait for the page to be loaded
   */
  abstract waitForLoad(): Promise<void>;

  /**
   * Common UI elements present across pages
   */
  get navigationMenu(): Locator {
    return this.page.getByRole('navigation');
  }

  get userMenuButton(): Locator {
    return this.page.getByText('Click to logout');
  }

  get logoutButton(): Locator {
    return this.page.getByText('Click to logout');
  }

  /**
   * Common actions
   */
  async logout(): Promise<void> {
    await this.userMenuButton.click(); // This clicks the logout area directly
  }

  /**
   * Wait for a specific URL pattern
   */
  async waitForURL(pattern: string): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  /**
   * Take a screenshot with a specific name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    });
  }
}