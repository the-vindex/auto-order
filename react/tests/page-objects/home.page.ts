import { Page, Locator } from '@playwright/test';
// @ts-ignore
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly addReminderButton: Locator;
  readonly remindersList: Locator;
  readonly welcomeMessage: Locator;
  readonly searchInput: Locator;
  readonly filterDropdown: Locator;

  constructor(private page: Page) {
    super(page);
    this.addReminderButton = page.getByRole('button', { name: 'Add' });
    //@CLAUDE: locator by CSS? Fix it by using something more specific. Feel free to modify page code.
    this.remindersList = page.locator('.space-y-4'); // The container with reminder cards
    this.welcomeMessage = page.getByRole('heading', { name: /my reminders/i });
    this.searchInput = page.getByPlaceholder('Search reminders...');
    this.filterDropdown = page.getByRole('combobox').or(page.getByRole('button', { name: /filter/i }));
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async waitForLoad(): Promise<void> {
    await this.addReminderButton.waitFor();
    // Wait for either reminders to load or empty state to appear
    await Promise.race([
      this.remindersList.waitFor({ state: 'visible' }),
      this.page.getByText('No reminders yet').waitFor({ state: 'visible' }),
      this.page.waitForTimeout(3000) // Fallback timeout
    ]);
  }

  async clickAddReminder(): Promise<void> {
    await this.addReminderButton.click();
  }

  async getReminderCards(): Promise<Locator[]> {
    // Wait for reminders to load
    await this.page.waitForTimeout(2000); // Give more time for API response and rendering
    
    // Try multiple selectors for reminder cards
    const cardSelectors = [
      '[class*="Card"]',
      '.mb-4', // From ReminderCard component
      '[class*="card"]',
      '.space-y-4 > div' // Direct children of the reminders container
    ];
    
    for (const selector of cardSelectors) {
      const cards = await this.page.locator(selector).all();
      if (cards.length > 0) {
        console.log(`Found ${cards.length} cards with selector: ${selector}`);
        return cards;
      }
    }
    
    // If no cards found, return empty array
    console.log('No reminder cards found with any selector');
    return [];
  }

  async searchReminders(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async getReminderByTitle(title: string): Promise<Locator> {
    // Be more specific with card selector and ensure we're looking for reminder cards
    //@CLAUDE: Try to find more specific locator or make one
    return this.page.locator('.mb-4').filter({ hasText: title });
  }

  async deleteReminder(title: string): Promise<void> {
    const reminder = await this.getReminderByTitle(title);
    
    // The delete button is the first button (red trash button) in the reminder card
    // Looking for button with Trash icon, it has specific styling - bg-red-200
    const deleteButton = reminder.locator('button').first();
    
    await deleteButton.click();
    
    // Wait for the reminder to be removed from the UI
    await this.page.waitForTimeout(1000);
  }

  async editReminder(title: string): Promise<void> {
    const reminder = await this.getReminderByTitle(title);
    await reminder.getByRole('button', { name: /edit|modify/i }).click();
  }

  async getRemindersCount(): Promise<number> {
    // First check if we're in empty state
    const isEmpty = await this.isEmptyState();
    if (isEmpty) {
      return 0;
    }
    
    const reminders = await this.getReminderCards();
    return reminders.length;
  }

  async isEmptyState(): Promise<boolean> {
    return await this.page.getByText('No reminders yet').isVisible();
  }
}