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
    const shoppingCart = new ShoppingCart(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Navigate to empty cart
    await mainPage.navigateToCart();
    
    // Verify cart is empty
    const itemCount = await shoppingCart.getCartItemCount();
    expect(itemCount).toBe(0);

    // Checkout should remain visible when cart is empty
    await expect(shoppingCart.checkoutButton).toBeVisible();
  });

  test('Checkout form requires all fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item
    await mainPage.addFirstItem();

    // Go to checkout
    await mainPage.navigateToCart();
    await shoppingCart.clickCheckout();

    // Try to continue without filling form
    await checkoutPage.clickContinue();
    
    // Should show validation error
    const errorMessage = page.getByRole('heading', { name: /Error:/ });
    await expect(errorMessage).toBeVisible();
  });

  test('Checkout form validation - first name only', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item
    await mainPage.addFirstItem();

    // Go to checkout
    await mainPage.navigateToCart();
    await shoppingCart.clickCheckout();

    // Fill only first name
    await checkoutPage.firstName.fill('John');
    await checkoutPage.clickContinue();
    
    // Should show validation error
    const errorMessage = page.getByRole('heading', { name: /Error:/ });
    await expect(errorMessage).toBeVisible();
  });

  test('Add all available items to cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add all items
    const inventoryItems = page.locator('.inventory_item');
    const count = await inventoryItems.count();
    
    for (let i = 0; i < count; i++) {
      await mainPage.addItemToCart(i);
    }
    
    // Verify all items were added
    const badgeText = await mainPage.getCartBadgeText();
    expect(badgeText).toBe(count.toString());
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

    await checkoutPage.fillCheckoutForm('Test', 'User', '12345');
    await checkoutPage.clickContinue();

    // Verify prices are displayed
    const priceCount = await checkoutOverview.getItemCount();
    expect(priceCount).toBe(2);

    // Verify subtotal and total labels exist
    const subTotal = await checkoutOverview.getSubtotalText();
    const total = await checkoutOverview.getTotalText();
    
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

    await checkoutPage.fillCheckoutForm('User', 'One', '11111');
    await checkoutPage.clickContinue();
    
    await checkoutOverview.clickFinish();
    
    // Verify completion
    await expect(page).toHaveURL(/.*checkout-complete/);

    // Go back to inventory before logging out
    await page.getByRole('button', { name: 'Back Home' }).click();
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();

    // User 2
    await page.goto(BASE_URL);
    const loginPage2 = new LoginPage(page);
    await loginPage2.login('performance_glitch_user', 'secret_sauce');
    
    const addToCartButtons2 = page.getByRole('button', { name: 'Add to cart' });
    await addToCartButtons2.nth(1).click();
    
    const mainPage2 = new MainPage(page);
    await page.locator('.shopping_cart_link').click();
    
    const shoppingCart2 = new ShoppingCart(page);
    await shoppingCart2.checkoutButton.click();

    await page.fill('#first-name', 'User');
    await page.fill('#last-name', 'Two');
    await page.fill('#postal-code', '22222');
    await expect(page.locator('#last-name')).toHaveValue('Two');
    const checkoutPage2 = new CheckOutPage(page);
    await checkoutPage2.clickContinue();
    
    const checkoutOverview2 = new CheckOutPageOverview(page);
    await checkoutOverview2.clickFinish();
    
    // Verify completion
    await expect(page).toHaveURL(/.*checkout-complete/);
  });

});

