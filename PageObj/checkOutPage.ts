import { Page } from "@playwright/test";

export class CheckOutPage {
    page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async fillFirstName(firstName: string) {
        await this.page.locator('#first-name').fill(firstName);
    }

    async fillLastName(lastName: string) {
        await this.page.locator('#last-name').fill(lastName);
    }

    async fillPostalCode(postalCode: string) {
        await this.page.locator('#postal-code').fill(postalCode);
    }

    async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillPostalCode(postalCode);
    }

    async clickContinue() {
        await this.page.locator('#continue').click();
    }

    async getErrorMessage() {
        return await this.page.locator('[data-testid="error"]').textContent();
    }

    async isErrorDisplayed() {
        return await this.page.locator('[data-testid="error"]').isVisible();
    }
}