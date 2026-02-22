import { Locator } from "@playwright/test";
import { Page } from '@playwright/test';


export class LoginPage{    

    page: Locator;
    username: Locator;
    password: Locator;
    loginButton: Locator     ;       ;

    constructor(page : Locator){
        this.page = page;
        this.username = page.locator('#username');
        this.password = page.locator('#password');
        this.loginButton = page.getByRole('button', { name: 'Login' });

    }

    async login(username: string, password: string){
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    
}