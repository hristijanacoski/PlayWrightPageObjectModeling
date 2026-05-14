import { Page, Locator } from '@playwright/test';

export class CheckOutPageOverview {
  readonly page: Page;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemPrices = page.locator('[data-testid="inventory-item-price"]');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  async getItemPrices() {
    return await this.itemPrices.allTextContents();
  }

  async getItemCount() {
    return await this.itemPrices.count();
  }

  async getSubtotalText() {
    return await this.subtotalLabel.textContent();
  }

  async getTotalText() {
    return await this.totalLabel.textContent();
  }

  async isSubtotalVisible() {
    return await this.subtotalLabel.isVisible();
  }

  async isTotalVisible() {
    return await this.totalLabel.isVisible();
  }

  async clickFinish() {
    await this.finishButton.click();
  }
}