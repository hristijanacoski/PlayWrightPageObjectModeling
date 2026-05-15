import { Page, Locator } from '@playwright/test';

export class ThankYouPage {
  readonly page: Page;
  readonly readyMessage: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.readyMessage = page.locator('.checkout_complete_container');
    this.backToProductsButton = page.getByRole('button', { name: 'Back Home' });
  }

  async getThankYouMessage() {
    return await this.readyMessage.textContent();
  }

  async isThankYouMessageVisible() {
    return await this.readyMessage.isVisible();
  }

  async clickBackToProducts() {
    await this.backToProductsButton.click();
  }
}