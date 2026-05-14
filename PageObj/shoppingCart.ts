import { Page } from "@playwright/test";

export class ShoppingCart {
    page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async getCartItemCount() {
        return await this.page.locator('.cart_item').count();
    }

    async getCartItems() {
        return await this.page.locator('.cart_item').allTextContents();
    }

    async removeItemByIndex(index: number = 0) {
        const buttons = this.page.getByRole('button', { name: 'Remove' });
        await buttons.nth(index).click();
    }

    async removeFirstItem() {
        await this.removeItemByIndex(0);
    }

    async removeAllItems() {
        let buttons = this.page.getByRole('button', { name: 'Remove' });
        let count = await buttons.count();
        
        for (let i = 0; i < count; i++) {
            buttons = this.page.getByRole('button', { name: 'Remove' });
            await buttons.first().click();
        }
    }

    async getItemPrices() {
        return await this.page.locator('.inventory_item_price').allTextContents();
    }

    async clickCheckout() {
        await this.page.getByRole('button', { name: 'Checkout' }).click();
    }

    async clickContinueShopping() {
        await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
    }
}