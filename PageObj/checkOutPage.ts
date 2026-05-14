import { Page, Locator } from '@playwright/test';

export class CheckOutPage {
    page: Page;
    firstName: Locator;
    lastName: Locator;
    zipCode: Locator;
    continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('#first-name');
    this.lastName = page.locator('#last-name');
    this.zipCode = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
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
}