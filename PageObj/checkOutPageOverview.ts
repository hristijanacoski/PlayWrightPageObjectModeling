import { Page } from "@playwright/test";

export class CheckOutPageOverview {
    page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async getItemPrices() {
        return await this.page.locator('[data-testid="inventory-item-price"]').allTextContents();
    }

    async getItemCount() {
        return await this.page.locator('[data-testid="inventory-item-price"]').count();
    }

    async getSubtotalText() {
        return await this.page.getByTestId('subtotal-label').textContent();
    }

    async getTotalText() {
        return await this.page.getByTestId('total-label').textContent();
    }

    async isSubtotalVisible() {
        return await this.page.getByTestId('subtotal-label').isVisible();
    }

    async isTotalVisible() {
        return await this.page.getByTestId('total-label').isVisible();
    }

    async clickFinish() {
        await this.page.getByTestId('finish').click();
    }
}