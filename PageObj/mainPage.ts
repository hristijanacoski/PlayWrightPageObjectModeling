import { Page, Locator } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addFirstItem() {
    await this.addItemToCart(0);
  }

  async addItemToCart(item: string | number) {
    if (typeof item === 'string') {
      const itemLocator = this.inventoryItems.filter({ hasText: item });
      await itemLocator.getByRole('button', { name: 'Add to cart' }).click();
    } else {
      await this.inventoryItems.nth(item).getByRole('button', { name: 'Add to cart' }).click();
    }
  }

  async getCartBadgeText() {
    return await this.cartBadge.textContent();
  }

  async navigateToCart() {
    await this.cartLink.click();
  }
}