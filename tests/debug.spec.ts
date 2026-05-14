import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../PageObj/login';

test('Inspect cart page structure', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await page.goto('https://www.saucedemo.com/');

  await loginPage.login('standard_user', 'secret_sauce');
  
  // Add items to cart
  const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
  await addToCartButtons.first().click();
  await addToCartButtons.nth(1).click();
  
  // Go to cart
  await page.locator('.shopping_cart_link').click();
  
  // Wait a bit
  await page.waitForTimeout(1000);
  
  console.log('=== CART PAGE ===');
  
  // Look for item names
  const itemLabels = page.locator('.inventory_item_label');
  console.log('Items with inventory_item_label class:', await itemLabels.count());
  
  if (await itemLabels.count() > 0) {
    const name = await itemLabels.first().textContent();
    console.log('First item name:', name);
  }
  
  // Look for all divs with inventory_item in class
  const inventoryItems = page.locator('[class*="inventory_item"]');
  console.log('Elements with inventory_item in class:', await inventoryItems.count());
  
  // Look for cart items specifically
  const cartItems = page.locator('.cart_item');
  console.log('Cart items:', await cartItems.count());
  
  // Look for all divs that might contain product info
  const allDivs = page.locator('div');
  console.log('Total divs:', await allDivs.count());
  
  // Look for links that might be product names
  const links = page.locator('a');
  console.log('Links on cart page:', await links.count());
  for (let i = 0; i < await links.count(); i++) {
    const text = await links.nth(i).textContent();
    const href = await links.nth(i).getAttribute('href');
    if (text && text.trim()) {
      console.log(`Link ${i}: "${text.trim()}" href="${href}"`);
    }
  }
  
  await page.screenshot({ path: 'debug-cart.png' });
});
