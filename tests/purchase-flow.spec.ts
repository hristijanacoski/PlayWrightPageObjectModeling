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
    await mainPage.addFirstItem();
    
    // Verify shopping cart badge shows 1 item
    const badge = await mainPage.getCartBadgeText();
    expect(badge).toBe('1');

    // Add second item to cart
    await mainPage.addItemToCartByIndex(1);
    
    // Verify shopping cart badge shows 2 items
    const badge2 = await mainPage.getCartBadgeText();
    expect(badge2).toBe('2');
  });

  test('User can view and modify shopping cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add items to cart
    await mainPage.addFirstItem();
    await mainPage.addItemToCartByIndex(1);

    // Navigate to cart
    await mainPage.navigateToCart();
    
    // Verify items are in cart
    const itemCount = await shoppingCart.getCartItemCount();
    expect(itemCount).toBe(2);

    // Remove one item
    await shoppingCart.removeFirstItem();
    
    // Verify only 1 item remains
    const remainingItems = await shoppingCart.getCartItemCount();
    expect(remainingItems).toBe(1);
  });

  test('User can proceed through checkout form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);
    const checkoutPage = new CheckOutPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item to cart
    await mainPage.addFirstItem();

    // Navigate to cart
    await mainPage.navigateToCart();

    // Click checkout
    await shoppingCart.clickCheckout();
    
    // Fill in checkout form
    await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');

    // Continue to next page
    await checkoutPage.clickContinue();
    
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
    await mainPage.addItemToCartByIndex(0);
    await mainPage.addItemToCartByIndex(1);

    // Navigate to cart
    await mainPage.navigateToCart();

    // Checkout
    await shoppingCart.clickCheckout();

    // Fill in checkout form
    await checkoutPage.fillCheckoutForm('Jane', 'Smith', '54321');
    await checkoutPage.clickContinue();

    // Verify order summary
    const itemCount = await checkoutOverview.getItemCount();
    expect(itemCount).toBeGreaterThan(0);

    // Verify subtotal and total are displayed
    const isSubtotalVisible = await checkoutOverview.isSubtotalVisible();
    const isTotalVisible = await checkoutOverview.isTotalVisible();
    expect(isSubtotalVisible).toBeTruthy();
    expect(isTotalVisible).toBeTruthy();

    // Finish purchase
    await checkoutOverview.clickFinish();

    // Verify thank you message
    const isThankYouVisible = await thankYouPage.isThankYouMessageVisible();
    expect(isThankYouVisible).toBeTruthy();
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
    await mainPage.addFirstItem();
    await mainPage.navigateToCart();
    await shoppingCart.clickCheckout();

    await checkoutPage.fillCheckoutForm('Test', 'User', '99999');
    await checkoutPage.clickContinue();
    await checkoutOverview.clickFinish();

    // Click back to products
    await thankYouPage.clickBackToProducts();
    
    // Verify we're back at inventory
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('User can continue shopping from cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    const shoppingCart = new ShoppingCart(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item to cart
    await mainPage.addFirstItem();

    // Navigate to cart
    await mainPage.navigateToCart();

    // Click continue shopping
    await shoppingCart.clickContinueShopping();
    
    // Verify we're back on inventory page
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('Cart persists across page navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item and check badge
    await mainPage.addFirstItem();
    
    const badge = await mainPage.getCartBadgeText();
    expect(badge).toBe('1');

    // Navigate away and back
    await page.goto(BASE_URL + 'inventory.html');
    
    // Verify cart badge still shows 1 item
    const badgePersist = await mainPage.getCartBadgeText();
    expect(badgePersist).toBe('1');
  });

});
