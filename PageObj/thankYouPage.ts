import { Page } from "@playwright/test";

export class ThankYouPage {
    page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async getThankYouMessage() {
        return await this.page.getByTestId('checkout-complete-container').textContent();
    }

    async isThankYouMessageVisible() {
        return await this.page.getByTestId('checkout-complete-container').isVisible();
    }

    async clickBackToProducts() {
        await this.page.getByTestId('back-to-products').click();
    }
}