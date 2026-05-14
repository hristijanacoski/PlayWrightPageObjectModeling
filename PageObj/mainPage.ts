import { Page } from "@playwright/test";

export class MainPage{    
    page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async addItemToCartByIndex(index: number = 0) {
        const buttons = this.page.getByRole('button', { name: 'Add to cart' });
        await buttons.nth(index).click();
    }

    async addFirstItem() {
        await this.addItemToCartByIndex(0);
    }

    async getCartBadgeText() {
        return await this.page.locator('.shopping_cart_badge').textContent();
    }

    async isCartBadgeVisible() {
        return await this.page.locator('.shopping_cart_badge').isVisible();
    }

    async navigateToCart() {
        await this.page.locator('.shopping_cart_link').click();
    }

    async getInventoryItemCount() {
        return await this.page.locator('[data-testid="inventory-item"]').count();
    }

    async getInventoryItemNames() {
        return await this.page.getByTestId('inventory-item-name').allTextContents();
    }
}