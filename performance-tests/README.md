# Performance Testing with Artillery

This folder contains all performance and load testing configurations using Artillery.

## Folder Structure

```
performance-tests/
├── config/
│   └── artillery.yml          # Main Artillery configuration
├── processor.js               # Artillery event processor
├── scenarios/                 # Scenario definitions (if separated)
├── reports/                   # Generated performance test reports
└── README.md                  # This file
```

## Running Performance Tests

### Prerequisites
- Artillery must be installed: `npm install artillery`

### Run All Tests
```bash
cd performance-tests
artillery run config/artillery.yml
```

### Run with Custom Output
```bash
artillery run config/artillery.yml -o reports/test-report-$(date +%Y%m%d-%H%M%S).json
```

### View Reports
```bash
artillery report reports/test-report-*.json
```

## Test Scenarios

### 1. Homepage Load Test
- Basic GET request to home page
- Verifies 200 status code

### 2. Login Flow
- GET homepage
- POST login with random credentials
- Tests authentication performance

### 3. Full Purchase Flow
- Complete e-commerce purchase journey
- Login → Browse → Cart → Checkout
- Tests end-to-end transaction flow

### 4. Product Catalog Browse
- Login and browse product catalog
- Think times between actions (realistic user behavior)
- Tests sequential navigation

### 5. Logout Flow
- Login → Browse → Logout
- Tests session management

## Load Phases

1. **Warm-up** (30s): 5 requests/sec - System initialization
2. **Sustained Load** (120s): 15 requests/sec - Normal operation
3. **Spike Test** (30s): 25 requests/sec - Peak load scenario

## Key Fixes Applied

- ✅ Changed `user-name` to `username` in POST requests
- ✅ Updated processor path reference
- ✅ Organized configs in dedicated folders
- ✅ Created reports directory for storing test outputs

## Configuration Options

Edit `config/artillery.yml` to:
- Modify `target` URL
- Adjust load phases (duration, arrivalRate)
- Add/remove scenarios
- Update test data in variables section

## Troubleshooting

- **Connection Errors**: Verify target URL and network connectivity
- **HTTP 404**: Check endpoint paths in scenarios
- **Timeout Issues**: Increase duration in load phases or adjust arrivalRate
- **JSON Parse Errors**: Validate JSON in POST request bodies
