import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../PageObj/login';

test('Login to HerokuApp', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await page.goto('https://www.saucedemo.com/');

  await loginPage.login('standard_user', 'secret_sauce');
  
});
