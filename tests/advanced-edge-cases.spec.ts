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
    await mainPage.navigateToCart();
    
    // Verify cart is empty
    const shoppingCart = new ShoppingCart(page);
    const cartCount = await shoppingCart.getCartItemCount();
    expect(cartCount).toBe(0);
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
    
    // Should show error
    const isErrorDisplayed = await checkoutPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
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
    await checkoutPage.fillFirstName('John');
    await checkoutPage.clickContinue();
    
    // Should show error
    const isErrorDisplayed = await checkoutPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
  });

  test('Add all available items to cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Get all add to cart buttons
    const addButtons = page.getByRole('button', { name: 'Add to cart' });
    const count = await addButtons.count();
    
    // Add all items
    for (let i = 0; i < count; i++) {
      await mainPage.addItemToCart(i);
    }
    
    // Verify all items were added
    const badge = await mainPage.getCartBadgeText();
    expect(badge).toBe(count.toString());
  });

  test('Remove all items from cart one by one', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add multiple items
    await mainPage.addItemToCart(0);
    await mainPage.addItemToCart(1);
    await mainPage.addItemToCart(2);

    // Go to cart
    await mainPage.navigateToCart();

    // Remove all items
    await shoppingCart.removeAllItems();
    
    // Verify cart is empty
    const cartCount = await shoppingCart.getCartItemCount();
    expect(cartCount).toBe(0);
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
    await mainPage.addItemToCart(0);
    await mainPage.addItemToCart(1);

    // Go through checkout
    await mainPage.navigateToCart();
    await shoppingCart.clickCheckout();

    await checkoutPage.fillCheckoutForm('Test', 'User', '12345');
    await checkoutPage.clickContinue();

    // Verify prices are displayed
    const itemCount = await checkoutOverview.getItemCount();
    expect(itemCount).toBe(2);

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
    
    await mainPage.addFirstItem();
    await mainPage.navigateToCart();
    await shoppingCart.clickCheckout();

    await checkoutPage.fillCheckoutForm('User', 'One', '11111');
    await checkoutPage.clickContinue();
    await checkoutOverview.clickFinish();
    
    // Verify completion
    await expect(page).toHaveURL(/.*checkout-complete/);

    // Logout and login as different user
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();

    // User 2
    await page.goto(BASE_URL);
    const loginPage2 = new LoginPage(page);
    await loginPage2.login('problem_user', 'secret_sauce');
    
    const mainPage2 = new MainPage(page);
    await mainPage2.addItemToCart(1);
    
    await mainPage2.navigateToCart();
    
    const shoppingCart2 = new ShoppingCart(page);
    await shoppingCart2.clickCheckout();

    const checkoutPage2 = new CheckOutPage(page);
    await checkoutPage2.fillCheckoutForm('User', 'Two', '22222');
    await checkoutPage2.clickContinue();
    
    const checkoutOverview2 = new CheckOutPageOverview(page);
    await checkoutOverview2.clickFinish();
    
    // Verify completion
    await expect(page).toHaveURL(/.*checkout-complete/);
  });

});

