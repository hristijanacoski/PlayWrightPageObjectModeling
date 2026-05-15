import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('API Tests - Sauce Demo', () => {
  
  // Helper function to capture API responses
  async function makeAPIRequest(page, method, endpoint, data = null) {
    if (method === 'GET') {
      const response = await page.request.get(`${BASE_URL}${endpoint}`);
      return response;
    } else if (method === 'POST') {
      const response = await page.request.post(`${BASE_URL}${endpoint}`, {
        data,
      });
      return response;
    }
  }

  test.describe('Homepage API Calls', () => {
    test('Homepage loads successfully', async ({ page }) => {
        const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });

        expect(response?.status()).toBe(200);
        await expect(page).toHaveTitle(/Swag Labs/);
    });

    test('Static assets load correctly', async ({ page }) => {
      await page.goto(BASE_URL);
        // Verify there are stylesheet links and script tags present in the page
        const linkCount = await page.locator('link[rel="stylesheet"]').count();
        const scriptCount = await page.locator('script[src]').count();

        expect(linkCount).toBeGreaterThan(0);
        expect(scriptCount).toBeGreaterThan(0);
    });
  });

  test.describe('Authentication API Tests', () => {
    test('Valid login credentials accepted', async ({ page }) => {
      await page.goto(BASE_URL);

      // Intercept the login request
      const loginRequestPromise = page.waitForResponse(
        response => response.url().includes('/') && response.status() !== 404
      );

      // Perform login
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');

      // Wait for redirect to inventory page
      await page.waitForURL(/.*inventory/);
      expect(page.url()).toContain('inventory');
    });

    test('Invalid login credentials rejected', async ({ page }) => {
      await page.goto(BASE_URL);

      await page.fill('[data-test="username"]', 'invalid_user');
      await page.fill('[data-test="password"]', 'wrong_password');
      await page.click('[data-test="login-button"]');

      // Error message should appear
      const errorElement = page.locator('[data-test="error"]');
      await expect(errorElement).toBeVisible();
      expect(await errorElement.textContent()).toContain('Username and password do not match');
    });

    test('Locked out user cannot login', async ({ page }) => {
      await page.goto(BASE_URL);

      await page.fill('[data-test="username"]', 'locked_out_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');

      const errorElement = page.locator('[data-test="error"]');
      await expect(errorElement).toBeVisible();
      expect(await errorElement.textContent()).toContain('Sorry, this user has been locked out');
    });

    test('Empty credentials show validation error', async ({ page }) => {
      await page.goto(BASE_URL);

      // Try to login with empty fields
      await page.click('[data-test="login-button"]');

      const errorElement = page.locator('[data-test="error"]');
      await expect(errorElement).toBeVisible();
    });
  });

  test.describe('Inventory API Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each inventory test
      await page.goto(BASE_URL);
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL(/.*inventory/);
    });

    test('Inventory page loads with products', async ({ page }) => {
      // We're already logged in and should be on inventory page
      await expect(page).toHaveURL(/.*inventory/);

      // Verify products are visible
      const products = page.locator('.inventory_item');
      const count = await products.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Product data renders correctly', async ({ page }) => {
      // Verify product elements on inventory page
      const productName = page.locator('.inventory_item_name').first();
      const productPrice = page.locator('.inventory_item_price').first();
      const productDesc = page.locator('.inventory_item_desc').first();

      await expect(productName).toBeVisible();
      await expect(productPrice).toBeVisible();
      await expect(productDesc).toBeVisible();

      // Verify data is not empty
      expect(await productName.textContent()).toBeTruthy();
      expect(await productPrice.textContent()).toContain('$');
    });

    test('Add to cart requests succeed', async ({ page }) => {
      // Add first inventory item to cart via UI
      const firstAdd = page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' });
      await firstAdd.click();

      // Verify remove button appears for that item
      await expect(page.locator('.inventory_item').first().getByRole('button', { name: 'Remove' })).toBeVisible();

      // Check cart badge updated
      const badge = page.locator('.shopping_cart_badge');
      await expect(badge).toContainText('1');
    });

    test('Remove from cart requests succeed', async ({ page }) => {
      // Add then remove the first item
      const firstItem = page.locator('.inventory_item').first();
      await firstItem.getByRole('button', { name: 'Add to cart' }).click();

      // Remove item
      await firstItem.getByRole('button', { name: 'Remove' }).click();

      // Button should change back to "Add to cart"
      await expect(firstItem.getByRole('button', { name: 'Add to cart' })).toBeVisible();

      // Badge should disappear (no badge)
      const badge = page.locator('.shopping_cart_badge');
      await expect(badge).toHaveCount(0);
    });
  });

  test.describe('Shopping Cart API Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL(/.*inventory/);
    });

    test('Cart page loads successfully', async ({ page }) => {
      // Add one item then navigate to cart (same browser context)
      await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
      await page.goto(`${BASE_URL}/cart.html`);

      // Verify cart page by URL and visible cart list
      await expect(page).toHaveURL(/.*cart.html/);
      const cartList = page.locator('.cart_list');
      await expect(cartList).toBeVisible();
    });

    test('Cart persists added items', async ({ page }) => {
      // Add two items and navigate to cart
      const items = page.locator('.inventory_item');
      await items.nth(0).getByRole('button', { name: 'Add to cart' }).click();
      await items.nth(1).getByRole('button', { name: 'Add to cart' }).click();
      await page.goto(`${BASE_URL}/cart.html`);

      // Verify items are still there
      const cartItems = page.locator('.cart_item');
      expect(await cartItems.count()).toBe(2);
    });

    test('Remove from cart works on cart page', async ({ page }) => {
      // Add item
      await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
      await page.goto(`${BASE_URL}/cart.html`);

      // Remove item
      await page.locator('.cart_item').first().getByRole('button', { name: 'Remove' }).click();

      // Verify empty cart
      const cartItems = page.locator('.cart_item');
      expect(await cartItems.count()).toBe(0);
    });

    test('Continue shopping button navigates correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/cart.html`);
      await page.click('[data-test="continue-shopping"]');
      
      await expect(page).toHaveURL(/.*inventory/);
    });
  });

  test.describe('Checkout API Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL(/.*inventory/);

      // Add items to cart
      await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
      await page.goto(`${BASE_URL}/cart.html`);
    });

    test('Checkout step one loads', async ({ page }) => {
      // Navigate to checkout via the cart UI so session/cart state is preserved
      await page.goto(`${BASE_URL}/cart.html`);
      await page.click('#checkout');
      await expect(page).toHaveURL(/.*checkout-step-one/);
    });

    test('Checkout form submission succeeds with valid data', async ({ page }) => {
      await page.goto(`${BASE_URL}/checkout-step-one.html`);

      await page.fill('[data-test="firstName"]', 'John');
      await page.fill('[data-test="lastName"]', 'Doe');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');

      await expect(page).toHaveURL(/.*checkout-step-two/);
    });

    test('Checkout form validation works', async ({ page }) => {
      await page.goto(`${BASE_URL}/checkout-step-one.html`);

      // Try to submit without filling
      await page.click('[data-test="continue"]');

      // Error should appear
      const errorElement = page.locator('[data-test="error"]');
      await expect(errorElement).toBeVisible();
    });

    test('Checkout step two displays order summary', async ({ page }) => {
      await page.goto(`${BASE_URL}/checkout-step-one.html`);
      await page.fill('[data-test="firstName"]', 'John');
      await page.fill('[data-test="lastName"]', 'Doe');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');

      // Verify we're on step two
      await expect(page).toHaveURL(/.*checkout-step-two/);
      
      // Verify order summary displays
      const cartItems = page.locator('.cart_item');
      expect(await cartItems.count()).toBeGreaterThan(0);

      // Verify total is displayed
      const total = page.locator('.summary_total_label');
      await expect(total).toBeVisible();
    });

    test('Order completion succeeds', async ({ page }) => {
      // Go through entire checkout
      await page.goto(`${BASE_URL}/checkout-step-one.html`);
      await page.fill('[data-test="firstName"]', 'John');
      await page.fill('[data-test="lastName"]', 'Doe');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');

      // Confirm order
      await page.click('[data-test="finish"]');

      // Verify order complete page
      await expect(page).toHaveURL(/.*checkout-complete/);
      const confirmMessage = page.locator('[data-test="complete-header"]');
      await expect(confirmMessage).toBeVisible();
      expect(await confirmMessage.textContent()).toContain('Thank you for your order');
    });
  });

  test.describe('Performance Metrics API Tests', () => {
    test('Page load performance is acceptable', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      
      const loadTime = Date.now() - startTime;
      console.log(`Homepage load time: ${loadTime}ms`);
      
      // Assert that page loads in reasonable time
      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });

    test('Inventory page loads efficiently', async ({ page }) => {
      // Login first
      await page.goto(BASE_URL);
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL(/.*inventory/);

      const startTime = Date.now();
      await page.goto(`${BASE_URL}/inventory.html`, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      console.log(`Inventory page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });

    test('Network requests complete successfully', async ({ page }) => {
      const failedRequests: string[] = [];

      page.on('response', response => {
        if (response.status() >= 400) {
          failedRequests.push(`${response.url()} - ${response.status()}`);
        }
      });

      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      
      // Allow a small number of low-priority failed requests (e.g., external trackers)
      expect(failedRequests.length).toBeLessThanOrEqual(2);
    });
  });

  test.describe('Error Handling API Tests', () => {
    test('Handles 404 errors gracefully', async ({ page }) => {
      const response = await page.request.get(`${BASE_URL}/nonexistent-page`);
      expect(response.status()).toBe(404);
    });

    test('Back button works correctly', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL(/.*inventory/);

      await page.goto(`${BASE_URL}/cart.html`);
      await page.goBack();

      await expect(page).toHaveURL(/.*inventory/);
    });

    test('Logout API works correctly', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL(/.*inventory/);

      // Click menu and logout
      await page.click('[id="react-burger-menu-btn"]');
      await page.click('[id="logout_sidebar_link"]');

      await expect(page).toHaveURL(/.*\//);
      expect(page.url()).not.toContain('inventory');
    });
  });
});
