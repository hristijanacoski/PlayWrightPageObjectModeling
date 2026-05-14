# 🎭 Playwright Automation Framework — Page Object Model

Automated UI test suite built with **Playwright + TypeScript**, 
structured using the **Page Object Model (POM)** architecture 
and integrated with **GitHub Actions CI/CD**.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Playwright | Browser automation & UI testing |
| TypeScript | Strongly-typed test code |
| Page Object Model | Maintainable test architecture |
| GitHub Actions | CI/CD pipeline for automated test runs |

---

## 📁 Project Structure
├── PageObj/          # Page Object classes
├── tests/            # Test specs
├── .github/workflows # CI/CD pipeline
├── playwright.config.ts
└── package.json
---

## ▶️ How to Run

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npx playwright test

# Run tests with UI mode
npx playwright test --ui

# View test report
npx playwright show-report
```

---

## ✅ What This Covers

- Page Object Model (POM) design pattern for reusable, maintainable selectors
- End-to-end UI test scenarios
- Automated regression runs via GitHub Actions on every push
- TypeScript for type safety and better code quality

---

## 👤 Author

**Hristijan Acoski** — QA Engineer  
[LinkedIn](https://www.linkedin.com/in/hristijanacoski) · 
[GitHub](https://github.com/hristijanacoski)
