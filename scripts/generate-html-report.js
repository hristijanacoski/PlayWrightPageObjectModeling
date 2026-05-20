#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get reports directory
let reportFiles = [];
const reportsDir = path.join(__dirname, '..', 'performance-tests', 'reports');

try {
  reportFiles = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith('artillery-report-') && f.endsWith('.json'))
    .map(f => path.join(reportsDir, f))
    .sort()
    .reverse();
} catch (e) {
  console.error(`❌ Reports directory not found: ${reportsDir}`);
  process.exit(1);
}

if (reportFiles.length === 0) {
  console.error('❌ No artillery reports found in reports directory');
  process.exit(1);
}

const latestReport = reportFiles[0];
console.log(`📊 Reading report: ${path.basename(latestReport)}`);

try {
  const reportData = JSON.parse(fs.readFileSync(latestReport, 'utf8'));
  const htmlPath = latestReport.replace('.json', '.html');
  
  const html = generateHtmlReport(reportData, latestReport);
  fs.writeFileSync(htmlPath, html);
  
  console.log(`✅ HTML report generated: ${htmlPath}`);
  console.log(`📈 Open in browser to view: file:///${htmlPath.replace(/\\/g, '/')}`);
} catch (error) {
  console.error('❌ Error generating report:', error.message);
  process.exit(1);
}

function generateHtmlReport(data, reportFile) {
  const aggregate = data.aggregate || {};
  const counters = aggregate.counters || {};
  const summaries = aggregate.summaries || {};
  
  // Extract metrics from correct structure
  const httpResponseTime = summaries['http.response_time'] || {};
  
  const defaultAvgResponseTime = summaries['http.response_time.2xx']?.mean ?? summaries['http.response_time.4xx']?.mean ?? 0;
  const avgResponseTimeValue = httpResponseTime.mean ?? defaultAvgResponseTime;

  const metrics = {
    totalRequests: counters['http.requests'] || 0,
    totalResponses: counters['http.responses'] || 0,
    avgResponseTime: Math.round(avgResponseTimeValue || 0),
    medianResponseTime: Math.round(httpResponseTime.median || 0),
    p95ResponseTime: Math.round(httpResponseTime.p95 || 0),
    p99ResponseTime: Math.round(httpResponseTime.p99 || 0),
    minResponseTime: httpResponseTime.min || 0,
    maxResponseTime: httpResponseTime.max || 0,
    http200: counters['http.codes.200'] || 0,
    http404: counters['http.codes.404'] || 0,
    http405: counters['http.codes.405'] || 0,
    errors: counters['http.codes.500'] || 0,
    totalVUsers: counters['vusers.created'] || 0,
    completedVUsers: counters['vusers.completed'] || 0,
    failedVUsers: counters['vusers.failed'] || 0,
    avgSessionLength: Math.round(summaries['vusers.session_length']?.mean || 0),
  };

  const reportDate = new Date().toLocaleString();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Artillery Performance Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      padding: 20px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .header {
      background: white;
      border-radius: 10px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .header h1 {
      color: #667eea;
      margin-bottom: 10px;
      font-size: 2.5em;
    }
    
    .header p {
      color: #666;
      font-size: 1.1em;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .metric-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      border-left: 5px solid #667eea;
      transition: transform 0.2s;
    }
    
    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    }
    
    .metric-card.success {
      border-left-color: #10b981;
    }
    
    .metric-card.warning {
      border-left-color: #f59e0b;
    }
    
    .metric-card.error {
      border-left-color: #ef4444;
    }
    
    .metric-label {
      color: #666;
      font-size: 0.9em;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    
    .metric-value {
      font-size: 2em;
      font-weight: bold;
      color: #333;
    }
    
    .metric-unit {
      font-size: 0.8em;
      color: #999;
      margin-left: 5px;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .chart-container {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .chart-container h3 {
      color: #333;
      margin-bottom: 15px;
      font-size: 1.2em;
    }
    
    .chart-wrapper {
      position: relative;
      height: 300px;
    }
    
    .response-time-breakdown {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    
    .response-time-breakdown h3 {
      color: #333;
      margin-bottom: 15px;
      font-size: 1.2em;
    }
    
    .response-time-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    
    .response-time-row:last-child {
      border-bottom: none;
    }
    
    .response-time-label {
      font-weight: 500;
      color: #666;
    }
    
    .response-time-bar {
      flex: 1;
      margin: 0 20px;
      background: #f0f0f0;
      border-radius: 5px;
      height: 25px;
      overflow: hidden;
    }
    
    .response-time-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
      color: white;
      font-size: 0.85em;
      font-weight: bold;
    }
    
    .response-time-value {
      font-weight: bold;
      color: #333;
      min-width: 80px;
      text-align: right;
    }
    
    .summary-table {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      margin-top: 30px;
    }
    
    .summary-table h3 {
      color: #333;
      margin-bottom: 15px;
      font-size: 1.2em;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th {
      background: #667eea;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:nth-child(even) {
      background: #f9f9f9;
    }
    
    .footer {
      text-align: center;
      color: white;
      margin-top: 30px;
      font-size: 0.9em;
    }
    
    .status-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
    }
    
    .status-badge.pass {
      background: #d1fae5;
      color: #065f46;
    }
    
    .status-badge.fail {
      background: #fee2e2;
      color: #7f1d1d;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Performance Test Report</h1>
      <p>Generated: ${reportDate}</p>
    </div>
    
    <div class="metrics-grid">
      <div class="metric-card success">
        <div class="metric-label">Total Requests</div>
        <div class="metric-value">${metrics.totalRequests}<span class="metric-unit">req</span></div>
      </div>
      
      <div class="metric-card success">
        <div class="metric-label">Responses (Success)</div>
        <div class="metric-value">${metrics.totalResponses}<span class="metric-unit">res</span></div>
      </div>
      
      <div class="metric-card ${metrics.avgResponseTime > 100 ? 'warning' : 'success'}">
        <div class="metric-label">Avg Response Time</div>
        <div class="metric-value">${metrics.avgResponseTime}<span class="metric-unit">ms</span></div>
      </div>
      
      <div class="metric-card success">
        <div class="metric-label">Median Response Time</div>
        <div class="metric-value">${metrics.medianResponseTime}<span class="metric-unit">ms</span></div>
      </div>
      
      <div class="metric-card">
        <div class="metric-label">P95 Response Time</div>
        <div class="metric-value">${metrics.p95ResponseTime}<span class="metric-unit">ms</span></div>
      </div>
      
      <div class="metric-card">
        <div class="metric-label">P99 Response Time</div>
        <div class="metric-value">${metrics.p99ResponseTime}<span class="metric-unit">ms</span></div>
      </div>
      
      <div class="metric-card success">
        <div class="metric-label">Virtual Users Created</div>
        <div class="metric-value">${metrics.totalVUsers}<span class="metric-unit">users</span></div>
      </div>
      
      <div class="metric-card success">
        <div class="metric-label">Virtual Users Completed</div>
        <div class="metric-value">${metrics.completedVUsers}<span class="metric-unit">users</span></div>
      </div>
      
      <div class="metric-card ${metrics.failedVUsers > 0 ? 'error' : 'success'}">
        <div class="metric-label">Failed Virtual Users</div>
        <div class="metric-value">${metrics.failedVUsers}<span class="metric-unit">users</span></div>
      </div>
      
      <div class="metric-card ${metrics.errors > 0 ? 'error' : 'success'}">
        <div class="metric-label">HTTP 5xx Errors</div>
        <div class="metric-value">${metrics.errors}<span class="metric-unit">err</span></div>
      </div>
    </div>
    
    <div class="charts-grid">
      <div class="chart-container">
        <h3>HTTP Status Codes Distribution</h3>
        <div class="chart-wrapper">
          <canvas id="statusCodesChart"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Response Time Distribution (Percentiles)</h3>
        <div class="chart-wrapper">
          <canvas id="percentileChart"></canvas>
        </div>
      </div>
    </div>
    
    <div class="response-time-breakdown">
      <h3>Response Time Breakdown</h3>
      
      <div class="response-time-row">
        <div class="response-time-label">Min</div>
        <div class="response-time-bar">
          <div class="response-time-bar-fill" style="width: 5%">
            ${metrics.minResponseTime}ms
          </div>
        </div>
        <div class="response-time-value">${metrics.minResponseTime}ms</div>
      </div>
      
      <div class="response-time-row">
        <div class="response-time-label">Median</div>
        <div class="response-time-bar">
          <div class="response-time-bar-fill" style="width: ${Math.min(100, (metrics.medianResponseTime / metrics.maxResponseTime) * 100)}%">
            ${metrics.medianResponseTime}ms
          </div>
        </div>
        <div class="response-time-value">${metrics.medianResponseTime}ms</div>
      </div>
      
      <div class="response-time-row">
        <div class="response-time-label">Average</div>
        <div class="response-time-bar">
          <div class="response-time-bar-fill" style="width: ${Math.min(100, (metrics.avgResponseTime / metrics.maxResponseTime) * 100)}%">
            ${metrics.avgResponseTime}ms
          </div>
        </div>
        <div class="response-time-value">${metrics.avgResponseTime}ms</div>
      </div>
      
      <div class="response-time-row">
        <div class="response-time-label">P95</div>
        <div class="response-time-bar">
          <div class="response-time-bar-fill" style="width: ${Math.min(100, (metrics.p95ResponseTime / metrics.maxResponseTime) * 100)}%">
            ${metrics.p95ResponseTime}ms
          </div>
        </div>
        <div class="response-time-value">${metrics.p95ResponseTime}ms</div>
      </div>
      
      <div class="response-time-row">
        <div class="response-time-label">P99</div>
        <div class="response-time-bar">
          <div class="response-time-bar-fill" style="width: ${Math.min(100, (metrics.p99ResponseTime / metrics.maxResponseTime) * 100)}%">
            ${metrics.p99ResponseTime}ms
          </div>
        </div>
        <div class="response-time-value">${metrics.p99ResponseTime}ms</div>
      </div>
      
      <div class="response-time-row">
        <div class="response-time-label">Max</div>
        <div class="response-time-bar">
          <div class="response-time-bar-fill" style="width: 100%">
            ${metrics.maxResponseTime}ms
          </div>
        </div>
        <div class="response-time-value">${metrics.maxResponseTime}ms</div>
      </div>
    </div>
    
    <div class="summary-table">
      <h3>HTTP Status Code Summary</h3>
      <table>
        <thead>
          <tr>
            <th>Status Code</th>
            <th>Count</th>
            <th>Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>200 OK</td>
            <td>${metrics.http200}</td>
            <td>${Math.round((metrics.http200 / (metrics.http200 + metrics.http404 + metrics.http405 + metrics.errors)) * 100)}%</td>
            <td><span class="status-badge pass">✓ Success</span></td>
          </tr>
          <tr>
            <td>404 Not Found</td>
            <td>${metrics.http404}</td>
            <td>${Math.round((metrics.http404 / (metrics.http200 + metrics.http404 + metrics.http405 + metrics.errors)) * 100)}%</td>
            <td><span class="status-badge ${metrics.http404 > 0 ? 'fail' : 'pass'}">Client Error</span></td>
          </tr>
          <tr>
            <td>405 Method Not Allowed</td>
            <td>${metrics.http405}</td>
            <td>${Math.round((metrics.http405 / (metrics.http200 + metrics.http404 + metrics.http405 + metrics.errors)) * 100)}%</td>
            <td><span class="status-badge ${metrics.http405 > 0 ? 'fail' : 'pass'}">Client Error</span></td>
          </tr>
          <tr>
            <td>5xx Server Errors</td>
            <td>${metrics.errors}</td>
            <td>${metrics.errors > 0 ? '✗' : '0'}%</td>
            <td><span class="status-badge ${metrics.errors > 0 ? 'fail' : 'pass'}">${metrics.errors > 0 ? 'Server Error' : 'None'}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="footer">
      <p>Report generated on ${reportDate}</p>
      <p>Artillery Performance Testing Dashboard</p>
    </div>
  </div>
  
  <script>
    // Status Codes Chart
    const statusCodesCtx = document.getElementById('statusCodesChart').getContext('2d');
    new Chart(statusCodesCtx, {
      type: 'doughnut',
      data: {
        labels: ['200 OK', '404 Not Found', '405 Method Not Allowed', '5xx Errors'],
        datasets: [{
          data: [${metrics.http200}, ${metrics.http404}, ${metrics.http405}, ${metrics.errors}],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#dc2626'],
          borderColor: ['#fff'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
    
    // Percentile Chart
    const percentileCtx = document.getElementById('percentileChart').getContext('2d');
    new Chart(percentileCtx, {
      type: 'bar',
      data: {
        labels: ['Min', 'Median', 'Average', 'P95', 'P99', 'Max'],
        datasets: [{
          label: 'Response Time (ms)',
          data: [${metrics.minResponseTime}, ${metrics.medianResponseTime}, ${metrics.avgResponseTime}, ${metrics.p95ResponseTime}, ${metrics.p99ResponseTime}, ${metrics.maxResponseTime}],
          backgroundColor: ['#667eea', '#764ba2', '#667eea', '#f59e0b', '#ef4444', '#dc2626'],
          borderRadius: 5,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Response Time (ms)'
            }
          }
        }
      }
    });
  </script>
</body>
</html>`;
}
