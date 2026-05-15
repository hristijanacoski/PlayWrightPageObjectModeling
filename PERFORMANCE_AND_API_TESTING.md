# Performance Testing & API Testing Guide

## 📊 Performance Testing with Artillery.io

### What is Artillery?
Artillery is a modern, powerful, easy-to-use load testing toolkit. It's designed to help you catch performance regressions and locate bottlenecks.

### Installation

First, install dependencies:
```bash
npm install
```

### Running Performance Tests

#### Basic Load Test
```bash
npm run perf:test
```

#### Custom Scenarios
Edit `artillery.yml` to define custom load patterns:

```yaml
config:
  target: "https://www.saucedemo.com"
  phases:
    - duration: 60      # Duration in seconds
      arrivalRate: 10   # New users per second
      name: "Warm-up"
```

#### Load Test Phases Included

1. **Warm-up Phase** (30s, 5 users/sec)
   - Initial requests to warm up the server

2. **Sustained Load** (120s, 15 users/sec)
   - Consistent load to measure performance

3. **Spike Test** (30s, 25 users/sec)
   - Sudden surge to test peak capacity

### Test Scenarios

The `artillery.yml` includes multiple scenarios:

- **Homepage Load Test** - Basic homepage load
- **Login Flow** - Simulates user authentication
- **Full Purchase Flow** - Complete e-commerce transaction
- **Product Catalog Browse** - Product browsing patterns
- **Logout Flow** - Session cleanup

### Interpreting Results

Artillery provides:
- **Response times** (min, max, p95, p99)
- **Throughput** (requests per second)
- **Error rates**
- **Connection times**

Example output:
```
┌─────────────────────┬──────┬──────┬──────┬──────┬───────┬──────────┐
│ http.codes          │ 2xx  │ 3xx  │ 4xx  │ 5xx  │ total │ timeouts │
├─────────────────────┼──────┼──────┼──────┼──────┼───────┼──────────┤
│ All requests        │ 8000 │    0 │    0 │    0 │  8000 │        0 │
├─────────────────────┼──────┼──────┼──────┼──────┼───────┼──────────┤
│ http.response_time  │      │      │      │      │       │          │
├─────────────────────┼──────┼──────┼──────┼──────┼───────┼──────────┤
│ min                 │ 50   │      │      │      │       │          │
│ max                 │ 5000 │      │      │      │       │          │
│ median              │ 200  │      │      │      │       │          │
│ p95                 │ 800  │      │      │      │       │          │
│ p99                 │ 2000 │      │      │      │       │          │
└─────────────────────┴──────┴──────┴──────┴──────┴───────┴──────────┘
```

### Advanced Configuration

**Ramp-up Load Test:**
```yaml
phases:
  - duration: 120
    arrivalRate: 1
    rampTo: 50
    name: "Ramp-up to 50 users"
```

**Soak Testing:**
```yaml
phases:
  - duration: 600  # Run for 10 minutes
    arrivalRate: 5
    name: "Soak test"
```

---

## 🔌 API Testing with Playwright

### What's Included

The `api-tests.spec.ts` file contains comprehensive API tests covering:

1. **Homepage API Calls**
   - Homepage load test
   - Static asset loading (CSS, JS)

2. **Authentication API Tests**
   - Valid login credentials
   - Invalid login handling
   - Locked-out user scenarios
   - Validation error handling

3. **Inventory API Tests**
   - Inventory page loading
   - Product data rendering
   - Add to cart functionality
   - Remove from cart functionality

4. **Shopping Cart API Tests**
   - Cart page loading
   - Cart persistence
   - Item removal
   - Navigation

5. **Checkout API Tests**
   - Checkout form validation
   - Order summary display
   - Complete purchase flow

6. **Performance Metrics Tests**
   - Page load time validation
   - Inventory load performance
   - Network request validation

7. **Error Handling Tests**
   - 404 error handling
   - Back button functionality
   - Logout verification

### Running API Tests

```bash
# Run only API tests
npm run test:api

# Run specific test suite
npx playwright test api-tests.spec.ts --grep "Authentication"

# Run in UI mode
npx playwright test api-tests.spec.ts --ui

# Generate HTML report
npx playwright test api-tests.spec.ts
npx playwright show-report
```

### Test Patterns Used

#### 1. Network Interception
```typescript
await page.waitForResponse(response => 
  response.url().includes('/inventory') && response.status() === 200
);
```

#### 2. Performance Measurement
```typescript
const startTime = Date.now();
await page.goto(url);
const loadTime = Date.now() - startTime;
expect(loadTime).toBeLessThan(3000);
```

#### 3. Error Validation
```typescript
const errorElement = page.locator('[data-test="error"]');
await expect(errorElement).toBeVisible();
```

---

## 🚀 Running Both Together

### Complete Test Suite
```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run UI tests
npm test

# Run API tests
npm run test:api

# Run performance tests
npm run perf:test
```

### In CI/CD Pipeline

Example GitHub Actions workflow:
```yaml
- name: Run API Tests
  run: npm run test:api

- name: Run Performance Tests
  run: npm run perf:test
  
- name: Upload reports
  uses: actions/upload-artifact@v3
  with:
    name: test-reports
    path: |
      playwright-report/
      artillery-report-*.json
```

---

## 📈 Performance Benchmarks

Expected metrics for saucedemo.com:

| Metric | Target | Notes |
|--------|--------|-------|
| Homepage Load | < 5s | At 5 users/sec |
| Inventory Page | < 3s | After login |
| API Response (avg) | < 200ms | Individual endpoints |
| Error Rate | < 1% | During normal load |
| P95 Response Time | < 1000ms | 95th percentile |

---

## 🔧 Customization

### Add New Performance Scenarios

Edit `artillery.yml`:
```yaml
- name: "Your Scenario"
  flow:
    - get:
        url: "/your-endpoint"
        expect:
          - statusCode: 200
    - post:
        url: "/your-post-endpoint"
        json:
          key: "value"
```

### Add New API Tests

Edit `tests/api-tests.spec.ts`:
```typescript
test('Your new test', async ({ page }) => {
  await page.goto(BASE_URL);
  // Your test steps
  expect(result).toBe(expected);
});
```

---

## 📊 Viewing Results

### Playwright Reports
```bash
npx playwright show-report
```

### Artillery Reports
```bash
npm run perf:report
```

---

## 🐛 Troubleshooting

### Tests Failing
- Ensure site is accessible
- Check network connectivity
- Verify test credentials are correct
- Review browser console for JS errors

### Performance Issues
- Check server logs
- Monitor CPU/memory usage
- Verify network latency
- Check for bottlenecks in database queries

### Artillery Issues
```bash
# Enable debug logging
artillery run artillery.yml --debug

# Show target URL
artillery run artillery.yml --verbose
```

---

## 📚 Resources

- [Artillery Docs](https://artillery.io/docs)
- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [Sauce Labs Test Site](https://www.saucedemo.com)
