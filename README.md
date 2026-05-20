# 🎭 Playwright Page Object Model Automation Framework

A scalable, production-ready end-to-end test automation framework built with **Playwright** and the **Page Object Model (POM)** design pattern — simulating real-world QA automation practices used in modern software engineering teams.

---

## 🚀 Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | Browser automation & test runner |
| JavaScript / TypeScript | Language |
| Node.js | Runtime environment |
| Page Object Model (POM) | Design pattern |
| GitHub Actions | CI/CD pipeline |
| Playwright HTML Reporter | Test reporting |

---

## 📁 Project Structure

```
├── pages/          # Page Object classes (UI abstraction layer)
├── tests/          # Test specs (organized by feature or type)
├── utils/          # Helper functions and reusable utilities
├── config/         # Environment configuration and base URLs
└── test-data/      # Static or mock test data
```

---

## 🎯 Test Strategy

The framework is structured into multiple test layers:

| Layer | Description |
|-------|-------------|
| **Smoke Tests** | Basic critical functionality validation |
| **Regression Tests** | Full feature validation |
| **E2E Tests** | Complete user workflows |

All tests are designed to be **independent**, **reusable**, **maintainable**, and **parallel executable**.

---

## ⚙️ Features

- ✅ Page Object Model architecture
- 🌐 Cross-browser testing (Chromium, Firefox, WebKit)
- ⚡ Parallel test execution
- 🔁 Test retries for flaky tests
- 📸 Screenshot capture on failure
- 🎥 Video recording on failure
- 🌍 Environment-based configuration
- 🧱 Clean separation of test layers

---

## ▶️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/example.spec.ts

# Run tests in a specific browser
npx playwright test --project=chromium

# Run tests in headed mode
npx playwright test --headed

# Run smoke tests only
npx playwright test --grep @smoke
```

---

## 📊 Reporting

This framework uses Playwright's built-in HTML reporting.

```bash
# Generate and open the HTML report
npx playwright show-report
```

Reports include:

- Test execution results
- Screenshots on failure
- Trace viewer for debugging

---

## 🔄 CI/CD Pipeline

This project is integrated with **GitHub Actions** for continuous testing.

On every push and pull request:

1. Dependencies are installed
2. Playwright browsers are installed
3. Tests are executed across all configured browsers
4. Reports are generated and stored as artifacts

See `.github/workflows/` for pipeline configuration.

---

## 🧠 Purpose

This project was built to demonstrate:

- Real-world QA automation skills
- Scalable test architecture
- CI/CD integration
- Clean code and maintainable design patterns
- Modern Playwright testing practices

---

## 📌 Roadmap

- [ ] Allure reporting integration
- [ ] API testing layer
- [ ] Visual regression testing
- [ ] Docker support
- [ ] CI/CD pipeline with test artifact uploads

---

## 👤 Author

**Hristijan Acoski**
QA Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://linkedin.com/in/your-profile)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?logo=github)](https://github.com/your-username)
