import { Page, Locator } from '@playwright/test';
// @ts-ignore
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;

  constructor(private page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    this.registerLink = page.getByRole('button', { name: 'Sign up' });
    this.errorMessage = page.locator('.text-red-500 span');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async waitForLoad(): Promise<void> {
    await this.emailInput.waitFor();
    await this.passwordInput.waitFor();
    await this.loginButton.waitFor();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickRegisterLink(): Promise<void> {
    await this.registerLink.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}