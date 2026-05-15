# 🚀 Quick Start Guide - Performance & API Testing

## What's New?

Your Playwright project now includes:

✅ **Artillery.io Performance Testing** - Load testing and performance benchmarking  
✅ **API Playwright Tests** - Comprehensive API endpoint testing  
✅ **Performance Metrics** - Response time and throughput analysis  

---

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
npx playwright install
```

### Step 2: Run API Tests
```bash
npm run test:api
```

### Step 3: Run Performance Tests
```bash
npm run perf:test
```

### Step 4: View Results
```bash
# Playwright Report
npx playwright show-report

# Performance Report
npm run perf:report
```

---

## 📁 New Files Added

| File | Purpose |
|------|---------|
| `tests/api-tests.spec.ts` | 50+ API test cases |
| `artillery.yml` | Performance test scenarios |
| `artillery-processor.js` | Custom Artillery hooks |
| `PERFORMANCE_AND_API_TESTING.md` | Detailed documentation |
| `.env.example` | Configuration template |

---

## 🧪 Test Coverage

### API Tests Include:
- ✅ Homepage & asset loading
- ✅ User authentication (valid/invalid/locked)
- ✅ Inventory management
- ✅ Shopping cart operations
- ✅ Checkout flow validation
- ✅ Performance metrics
- ✅ Error handling

### Performance Test Scenarios:
- ✅ Homepage load test
- ✅ Login flow simulation
- ✅ Full purchase flow
- ✅ Product browsing patterns
- ✅ Logout flow

---

## 📊 Available Commands

```bash
# Run tests
npm test                    # All UI tests
npm run test:api           # API tests only
npm run test:ui            # Interactive UI

# Performance testing
npm run perf:test          # Run load tests
npm run perf:report        # View results

# Reports
npx playwright show-report # UI test report
```

---

## 🎯 Example Workflow

```bash
# 1. Run API tests to validate endpoints
npm run test:api

# 2. Run performance tests to check throughput
npm run perf:test

# 3. View detailed reports
npx playwright show-report

# 4. Run against different environments
BASE_URL=https://staging.example.com npm run test:api
```

---

## 💡 Key Features

### Artillery.io Benefits
- **Load Testing**: Simulate real-world traffic
- **Performance Metrics**: P95, P99 response times
- **Trend Analysis**: Monitor performance over time
- **Error Detection**: Catch slowdowns early

### API Testing Benefits
- **Comprehensive Coverage**: 50+ test cases
- **Performance Validation**: Response time assertions
- **Error Scenarios**: Invalid inputs, edge cases
- **Integration Testing**: Full user flows

---

## 🔗 Learn More

📖 [Full Performance & API Testing Guide](./PERFORMANCE_AND_API_TESTING.md)  
📖 [Artillery Documentation](https://artillery.io/docs)  
📖 [Playwright API Docs](https://playwright.dev/docs/api-testing)  

---

## ❓ Common Questions

**Q: How often should I run performance tests?**  
A: Run before major releases and after code changes. Regular CI/CD integration recommended.

**Q: Can I test multiple environments?**  
A: Yes! Change `BASE_URL` or edit `artillery.yml` target.

**Q: How do I add custom test scenarios?**  
A: Edit `artillery.yml` to add new scenarios in the flow section.

**Q: What's a good p95 response time?**  
A: Under 1000ms is excellent for web applications.

---

## 📞 Need Help?

1. Check `PERFORMANCE_AND_API_TESTING.md` for detailed docs
2. Review test files for examples
3. Check Artillery logs: `artillery run artillery.yml --debug`

Happy testing! 🎉
