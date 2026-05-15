import { Page, Locator } from '@playwright/test';

export class CheckOutPage {
    readonly page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly zipCode: Locator;
    readonly continueButton: Locator;
    readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('#first-name');
    this.lastName = page.locator('#last-name');
    this.zipCode = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillCheckoutForm(first: string, last: string, zip: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.zipCode.fill(zip);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async fillInformation(first: string, last: string, zip: string) {
    await this.fillCheckoutForm(first, last, zip);
  }

  async fillFirstName(first: string) {
    await this.firstName.fill(first);
  }

  async isErrorDisplayed() {
    return await this.errorMessage.isVisible();
  }
}