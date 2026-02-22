import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../PageObj/login';

test('Login to HerokuApp', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await page.goto('https://the-internet.herokuapp.com/login');

  await loginPage.login('tomsmith', 'SuperSecretPassword!');

  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  
});
