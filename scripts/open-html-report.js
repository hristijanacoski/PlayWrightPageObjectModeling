#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const reportsDir = path.join(__dirname, '..', 'performance-tests', 'reports');

// Find latest HTML report
let htmlFiles = [];
try {
  htmlFiles = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith('artillery-report-') && f.endsWith('.html'))
    .map(f => path.join(reportsDir, f))
    .sort()
    .reverse();
} catch (e) {
  console.error(`❌ Reports directory not found: ${reportsDir}`);
  process.exit(1);
}

if (htmlFiles.length === 0) {
  console.error('❌ No HTML reports found. Run: npm run perf:report:html');
  process.exit(1);
}

const latestReport = htmlFiles[0];
console.log(`📊 Opening report: ${path.basename(latestReport)}`);
console.log(`📈 File: ${latestReport}`);

// Open in default browser
const isWin = process.platform === 'win32';
const isOsx = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

let openCommand;
if (isWin) {
  openCommand = `start "" "${latestReport}"`;
} else if (isOsx) {
  openCommand = `open "${latestReport}"`;
} else if (isLinux) {
  openCommand = `xdg-open "${latestReport}"`;
}

if (openCommand) {
  exec(openCommand, (err) => {
    if (err) {
      console.log(`\n✅ Report ready! Open manually: file:///${latestReport.replace(/\\/g, '/')}`);
    } else {
      console.log(`✅ Report opened in browser!`);
    }
  });
} else {
  console.log(`\n✅ Open in browser: file:///${latestReport.replace(/\\/g, '/')}`);
}
