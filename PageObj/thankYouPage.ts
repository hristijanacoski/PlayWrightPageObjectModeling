import { Page, Locator } from '@playwright/test';

export class ThankYouPage {
  readonly page: Page;
  readonly readyMessage: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.readyMessage = page.getByTestId('checkout-complete-container');
    this.backToProductsButton = page.getByTestId('back-to-products');
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