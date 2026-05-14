import { Page, Locator } from '@playwright/test';

export class ShoppingCart {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeItemButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.removeItemButtons = page.locator('.cart_item button:has-text("Remove")');
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async removeFirstItem() {
    await this.removeItemButtons.first().click();
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async clickContinueShopping() {
    await this.continueShoppingButton.click();
  }
}