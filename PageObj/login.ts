import { Page } from "@playwright/test";

export class LoginPage{    
    page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async fillUsername(username: string) {
        await this.page.locator('#user-name').fill(username);
    }

    async fillPassword(password: string) {
        await this.page.locator('#password').fill(password);
    }

    async clickLoginButton() {
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async login(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }
}