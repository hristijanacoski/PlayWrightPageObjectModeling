#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Generate timestamp
const now = new Date();
const timestamp = now.getFullYear() + 
  String(now.getMonth() + 1).padStart(2, '0') + 
  String(now.getDate()).padStart(2, '0') + '-' + 
  String(now.getHours()).padStart(2, '0') + 
  String(now.getMinutes()).padStart(2, '0') + 
  String(now.getSeconds()).padStart(2, '0');

const reportName = `artillery-report-${timestamp}.json`;
const reportsDir = path.join(__dirname, '..', 'performance-tests', 'reports');

// Create reports directory if it doesn't exist
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Use relative path from performance-tests directory
const relativeReportPath = `reports/${reportName}`;

// Run artillery command
const command = `cd performance-tests && artillery run config/artillery.yml -o ${relativeReportPath}`;

console.log(`📊 Running performance tests...`);
console.log(`📁 Report will be saved to: ${path.join(reportsDir, reportName)}`);
console.log('');

try {
  execSync(command, { stdio: 'inherit', shell: true });
  console.log(`\n✅ Report saved: ${path.join(reportsDir, reportName)}`);
} catch (error) {
  console.error(`\n❌ Test failed with error`);
  process.exit(1);
}
