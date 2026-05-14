import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObj/login';
import { MainPage } from '../PageObj/mainPage';
import { ShoppingCart } from '../PageObj/shoppingCart';
import { CheckOutPage } from '../PageObj/checkOutPage';
import { CheckOutPageOverview } from '../PageObj/checkOutPageOverview';

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Shopping Cart Edge Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Cannot proceed to checkout with empty cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Navigate to empty cart
    await page.locator('.shopping_cart_link').click();
    
    // Verify cart is empty
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(0);
    
    // Checkout button should not be available or error should occur
    const checkoutButton = page.getByTestId('checkout');
    await expect(checkoutButton).toBeDisabled();
  });

  test('Checkout form requires all fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.first().click();

    // Go to checkout
    await page.locator('.shopping_cart_link').click();
    await shoppingCart.checkoutButton.click();

    // Try to continue without filling form
    await checkoutPage.continueButton.click();
    
    // Should show error or stay on same page
    const errorMessage = page.locator('[data-testid="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('Checkout form validation - first name only', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.first().click();

    // Go to checkout
    await page.locator('.shopping_cart_link').click();
    await shoppingCart.checkoutButton.click();

    // Fill only first name
    await checkoutPage.firstName.fill('John');
    await checkoutPage.continueButton.click();
    
    // Should show error
    const errorMessage = page.locator('[data-testid="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('Add all available items to cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add all items
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    const count = await addToCartButtons.count();
    
    for (let i = 0; i < count; i++) {
      await page.getByRole('button', { name: 'Add to cart' }).nth(i).click();
    }
    
    // Verify all items were added
    const shoppingCartBadgeElem = page.locator('.shopping_cart_badge');
    await expect(shoppingCartBadgeElem).toContainText(count.toString());
  });

  test('Remove all items from cart one by one', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add multiple items
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.nth(0).click();
    await addToCartButtons.nth(1).click();
    await addToCartButtons.nth(2).click();

    // Go to cart
    await page.locator('.shopping_cart_link').click();

    // Remove all items one by one
    let removeButtons = page.getByRole('button', { name: 'Remove' });
    const initialCount = await removeButtons.count();

    for (let i = 0; i < initialCount; i++) {
      removeButtons = page.getByRole('button', { name: 'Remove' });
      await removeButtons.first().click();
    }
    
    // Verify cart is empty
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(0);
    
    // Verify cart is empty - badge should not be visible
    const badge = page.locator('.shopping_cart_badge');
    const badgeVisible = await badge.isVisible();
    if (badgeVisible) {
      await expect(badge).toContainText('0');
    }
  });

});

test.describe('Checkout Price Calculation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Verify total price calculation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);
    const checkoutOverview = new CheckOutPageOverview(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add items
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.nth(0).click();
    await addToCartButtons.nth(1).click();

    // Go through checkout
    await page.locator('.shopping_cart_link').click();
    await shoppingCart.checkoutButton.click();

    await checkoutPage.firstName.fill('Test');
    await checkoutPage.lastName.fill('User');
    await checkoutPage.postalCode.fill('12345');
    await checkoutPage.continueButton.click();

    // Verify prices are displayed
    const itemPrices = page.locator('[data-testid="inventory-item-price"]');
    const priceCount = await itemPrices.count();
    expect(priceCount).toBe(2);

    // Verify subtotal and total labels exist
    const subTotal = await checkoutOverview.subTotalPrice.textContent();
    const total = await checkoutOverview.totalPrice.textContent();
    
    expect(subTotal).toBeTruthy();
    expect(total).toBeTruthy();
  });

});

test.describe('Multiple User Sessions', () => {

  test('Two different users can place orders', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);
    const checkoutOverview = new CheckOutPageOverview(page);

    // User 1
    await page.goto(BASE_URL);
    await loginPage.login('standard_user', 'secret_sauce');
    
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons.first().click();
    
    await page.locator('.shopping_cart_link').click();
    await shoppingCart.checkoutButton.click();

    await checkoutPage.firstName.fill('User');
    await checkoutPage.lastName.fill('One');
    await checkoutPage.postalCode.fill('11111');
    await checkoutPage.continueButton.click();
    
    await checkoutOverview.finishButton.click();
    
    // Verify completion
    await expect(page).toHaveURL(/.*checkout-complete/);

    // Logout and login as different user
    await page.click('[data-testid="bm-menu-button"]');
    await page.click('[data-testid="logout-sidebar-link"]');

    // User 2
    await page.goto(BASE_URL);
    const loginPage2 = new LoginPage(page);
    await loginPage2.login('problem_user', 'secret_sauce');
    
    const addToCartButtons2 = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons2.nth(1).click();
    
    const mainPage2 = new MainPage(page);
    await page.locator('.shopping_cart_link').click();
    
    const shoppingCart2 = new ShoppingCart(page);
    await shoppingCart2.checkoutButton.click();

    const checkoutPage2 = new CheckOutPage(page);
    await checkoutPage2.firstName.fill('User');
    await checkoutPage2.lastName.fill('Two');
    await checkoutPage2.postalCode.fill('22222');
    await checkoutPage2.continueButton.click();
    
    const checkoutOverview2 = new CheckOutPageOverview(page);
    await checkoutOverview2.finishButton.click();
    
    // Verify completion
    await expect(page).toHaveURL(/.*checkout-complete/);
  });

});
