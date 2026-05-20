# Performance Testing Setup - Summary


## 📁 New Performance Testing Structure Created

```
performance-tests/
├── config/
│   └── artillery.yml          ✅ Fixed configuration (username corrected)
├── processor.js               ✅ Event processor for Artillery
├── scenarios/                 📂 Ready for additional scenario files
├── reports/                   📂 Directory for storing test reports
└── README.md                  📖 Comprehensive documentation
```

---

## 📝 New NPM Scripts Added

| Script | Purpose |
|--------|---------|
| `npm run perf:test:new` | Run performance tests from new folder |
| `npm run perf:test:with-report` | Run tests and save report with timestamp |
| `npm run perf:report:view` | View generated performance reports |

---

## 🚀 How to Use

### Run Performance Tests (New Folder)
```bash
npm run perf:test:new
```

### Run with Report Generation
```bash
npm run perf:test:with-report
```

### View Reports
```bash
npm run perf:report:view
```

---

## 📊 Test Scenarios Included

1. **Homepage Load Test** - Basic page load performance
2. **Login Flow** - Authentication performance with random user selection
3. **Full Purchase Flow** - End-to-end purchase journey
4. **Product Catalog Browse** - Sequential navigation with realistic think times
5. **Logout Flow** - Session termination

---

## ⚙️ Load Test Configuration

- **Warm-up Phase**: 30s @ 5 req/sec
- **Sustained Load**: 120s @ 15 req/sec  
- **Spike Test**: 30s @ 25 req/sec

---

## 🔄 Files Modified

✅ `/artillery.yml` - Fixed username field names
✅ `/package.json` - Added new performance test scripts

## 📦 New Files Created

✅ `/performance-tests/config/artillery.yml` - Corrected configuration
✅ `/performance-tests/processor.js` - Event processor
✅ `/performance-tests/README.md` - Documentation
✅ `/performance-tests/scenarios/` - Directory for scenarios
✅ `/performance-tests/reports/` - Directory for reports

---

