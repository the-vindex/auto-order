import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ReminderPage extends BasePage {
  readonly urlInput: Locator;
  readonly targetPriceInput: Locator;
  readonly notesTextarea: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly loadingIndicator: Locator;
  readonly productTitle: Locator;
  readonly currentPrice: Locator;
  readonly productImage: Locator;

  constructor(page: Page) {
    super(page);
    this.urlInput = page.getByLabel('Amazon Product URLs');
    this.targetPriceInput = page.getByLabel('Target Price ($)');
    this.notesTextarea = page.getByLabel('Product Name');
    this.saveButton = page.getByRole('button', { name: 'Create Reminder' });
    this.cancelButton = page.getByRole('button', { name: /cancel|close/i });
    this.errorMessage = page.locator('.text-red-500');
    this.loadingIndicator = page.getByRole('button', { name: 'Creating...' });
    this.productTitle = page.getByLabel('Product Name');
    this.currentPrice = page.getByText(/\$\d+/);
    this.productImage = page.getByRole('img', { name: /product/i });
  }

  async goto(): Promise<void> {
    // This page is accessed via popover/modal, not direct navigation
    throw new Error('ReminderPage should be accessed via popover, not direct navigation');
  }

  async waitForLoad(): Promise<void> {
    await this.urlInput.waitFor();
    await this.targetPriceInput.waitFor();
    await this.saveButton.waitFor();
  }

  async fillReminderForm(data: {
    url: string;
    targetPrice: string;
    name?: string;
  }): Promise<void> {
    // Step 1: Fill product name (required for button to be enabled)
    if (data.name) {
      await this.notesTextarea.fill(data.name);
    }
    
    // Step 2: Fill URL input
    await this.urlInput.fill(data.url);
    
    // Step 3: Add URL to the list (either press Enter or click Add button)
    // Try pressing Enter first (simpler)
    await this.urlInput.press('Enter');
    
    // Wait a moment for the URL to be processed
    await this.page.waitForTimeout(500);
    
    // If Enter didn't work, try clicking the Add button
    const urlBadgesAfterEnter = await this.page.locator('.cursor-pointer').count();
    if (urlBadgesAfterEnter === 0) {
      // Find the "Add" button next to the URL input (should be in the same container)
      const addButton = this.page.locator('input').locator('..').getByRole('button', { name: 'Add' });
      await addButton.click();
      await this.page.waitForTimeout(500);
    }
    
    // Step 4: Fill target price
    await this.targetPriceInput.fill(data.targetPrice);
    
    // Wait for form to be valid (button should be enabled)
    await this.saveButton.waitFor({ state: 'visible' });
  }

  async saveReminder(): Promise<void> {
    // Wait for button to be enabled
    await this.saveButton.waitFor({ state: 'visible' });
    
    // Check if button is still disabled and log form state
    const isDisabled = await this.saveButton.getAttribute('disabled');
    if (isDisabled) {
      console.log('Save button is still disabled, checking form state...');
      const nameValue = await this.notesTextarea.inputValue();
      const urlValue = await this.urlInput.inputValue();
      const priceValue = await this.targetPriceInput.inputValue();
      console.log('Form values:', { name: nameValue, url: urlValue, price: priceValue });
      
      // Check if URLs were actually added to the list
      const urlBadges = await this.page.locator('.cursor-pointer').count();
      console.log('URL badges count:', urlBadges);
    }
    
    await this.saveButton.click();
  }

  async cancelReminder(): Promise<void> {
    // Since the popover doesn't have a visible cancel button, 
    // we can close it by pressing Escape key or clicking outside
    await this.page.keyboard.press('Escape');
    
    // Alternative: click outside the popover to close it
    // await this.page.click('body', { position: { x: 100, y: 100 } });
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async waitForProductInfoLoad(): Promise<void> {
    // Wait for product info to be scraped and displayed
    await this.loadingIndicator.waitFor({ state: 'hidden' });
    await this.productTitle.waitFor();
  }

  async getProductInfo(): Promise<{
    title: string;
    currentPrice: string;
  }> {
    await this.waitForProductInfoLoad();
    
    return {
      title: await this.productTitle.textContent() || '',
      currentPrice: await this.currentPrice.textContent() || ''
    };
  }

  async isLoadingVisible(): Promise<boolean> {
    return await this.loadingIndicator.isVisible();
  }

  async waitForSave(): Promise<void> {
    // Wait for save operation to complete
    try {
      // First wait for the loading state
      await this.loadingIndicator.waitFor({ state: 'visible', timeout: 2000 });
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
    } catch (e) {
      // Loading indicator might not appear if save is very fast
      console.log('Loading indicator not found, continuing...');
    }
    
    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle');
    
    // Wait for popover to close (indicates successful save)
    await this.page.waitForTimeout(1000);
  }
}