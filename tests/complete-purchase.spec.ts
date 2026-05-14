import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../PageObj/login';
import { MainPage } from '../PageObj/mainPage';
import { ShoppingCart } from '../PageObj/shoppingCart';
import { CheckOutPage } from '../PageObj/checkOutPage';
import { CheckOutPageOverview } from '../PageObj/checkOutPageOverview';
import { ThankYouPage } from '../PageObj/thankYouPage';

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Complete E-Commerce Purchase Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('User can login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Verify login was successful by checking we're on main page
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('User can add items to cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add first item to cart
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.first().click();
    
    // Verify shopping cart badge shows 1 item
    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).toContainText('1');

    // Add second item to cart
    await page.locator('button:has-text("Add to cart")').nth(1).click();
    
    // Verify shopping cart badge shows 2 items
    await expect(badge).toContainText('2');
  });

  test('User can view and modify shopping cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add items to cart
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.first().click();
    await addToCartButtons.nth(1).click();

    // Navigate to cart
    await page.locator('.shopping_cart_link').click();
    
    // Verify items are in cart
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);

    // Remove one item
    const removeButtons = page.getByRole('button', { name: 'Remove' });
    await removeButtons.first().click();
    
    // Verify only 1 item remains
    const remainingItems = page.locator('.cart_item');
    await expect(remainingItems).toHaveCount(1);
  });

  test('User can proceed through checkout form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item to cart
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.first().click();

    // Navigate to cart
    await page.locator('.shopping_cart_link').click();

    // Click checkout
    await shoppingCart.checkoutButton.click();
    
    // Fill in checkout form
    await checkoutPage.firstName.fill('John');
    await checkoutPage.lastName.fill('Doe');
    await checkoutPage.zipCode.type('12345');

    // Continue to next page
    await checkoutPage.continueButton.click();
    
    // Verify we're on the overview page
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('User can review order and complete purchase', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);
    const checkoutOverview = new CheckOutPageOverview(page);
    const thankYouPage = new ThankYouPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add multiple items to cart
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.nth(0).click();
    await addToCartButtons.nth(1).click();

    // Navigate to cart
    await page.locator('.shopping_cart_link').click();

    // Checkout
    await shoppingCart.checkoutButton.click();

    // Fill in checkout form
    await checkoutPage.firstName.fill('Jane');
    await checkoutPage.lastName.fill('Smith');
    await checkoutPage.zipCode.fill('54321');
    await checkoutPage.continueButton.click();

    // Verify order summary
    const itemPrices = page.locator('[data-testid="inventory-item-price"]');
    const itemCount = await itemPrices.count();
    expect(itemCount).toBeGreaterThan(0);

    // Verify subtotal and total are displayed
    await expect(checkoutOverview.subtotalLabel).toBeVisible();
    await expect(checkoutOverview.totalLabel).toBeVisible();

    // Finish purchase
    await checkoutOverview.finishButton.click();

    // Verify thank you message
    await expect(thankYouPage.readyMessage).toBeVisible();
    await expect(page).toHaveURL(/.*checkout-complete/);
  });

  test('User can navigate back to products from thank you page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);
    const checkoutOverview = new CheckOutPageOverview(page);
    const thankYouPage = new ThankYouPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Complete a purchase
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.first().click();

    await page.locator('.shopping_cart_link').click();
    await shoppingCart.checkoutButton.click();

    await checkoutPage.firstName.fill('Test');
    await checkoutPage.lastName.fill('User');
    await checkoutPage.zipCode.fill('99999');
    await checkoutPage.continueButton.click();

    await checkoutOverview.finishButton.click();

    // Click back to products
    await thankYouPage.backToProductsButton.click();
    
    // Verify we're back at inventory
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('User can continue shopping from cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item to cart
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.first().click();

    // Navigate to cart
    await page.locator('.shopping_cart_link').click();

    // Click continue shopping
    await shoppingCart.continueShoppingButton.click();
    
    // Verify we're back on inventory page
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('Cart persists across page navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item and check badge
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.first().click();
    
    await expect(mainPage.inventoryItems).toContainText('1');

    // Navigate away and back
    await page.goto(BASE_URL + 'inventory.html');
    
    // Verify cart badge still shows 1 item
    const badgePersist = page.locator('.shopping_cart_badge');
    await expect(badgePersist).toContainText('1');
  });

});
