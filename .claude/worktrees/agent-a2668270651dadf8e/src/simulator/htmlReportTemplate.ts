// HTML Report Template - Generate HTML report

import type { LaunchReport } from './LaunchReportBuilder';

export function generateHTMLReport(report: LaunchReport): string {
  const statusColor = report.summary.passed ? '#22c55e' : '#ef4444';
  const statusText = report.summary.passed ? 'PASSED' : 'FAILED';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Launch Simulation Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #000;
      color: #fff;
      padding: 40px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 48px; margin-bottom: 20px; }
    .status {
      display: inline-block;
      padding: 10px 20px;
      background: ${statusColor};
      border-radius: 8px;
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 40px;
    }
    .summary {
      background: #111;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 40px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .summary-item {
      text-align: center;
      padding: 20px;
      background: #1a1a1a;
      border-radius: 8px;
    }
    .summary-value {
      font-size: 36px;
      font-weight: bold;
      color: ${statusColor};
    }
    .summary-label {
      font-size: 14px;
      color: #999;
      margin-top: 5px;
    }
    .scenarios {
      display: grid;
      gap: 20px;
    }
    .scenario {
      background: #111;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 20px;
    }
    .scenario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .scenario-name {
      font-size: 20px;
      font-weight: bold;
    }
    .scenario-badge {
      padding: 5px 15px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
    }
    .passed { background: #22c55e; color: #000; }
    .failed { background: #ef4444; color: #fff; }
    .scenario-stats {
      display: flex;
      gap: 30px;
      font-size: 14px;
      color: #999;
    }
    .stat-item { display: flex; align-items: center; gap: 5px; }
    .timestamp {
      text-align: center;
      margin-top: 40px;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Launch Simulation Report</h1>
    <div class="status">${statusText}</div>

    <div class="summary">
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-value">${report.summary.totalScenarios}</div>
          <div class="summary-label">Total Scenarios</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${report.summary.passedScenarios}</div>
          <div class="summary-label">Passed</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${report.summary.failedScenarios}</div>
          <div class="summary-label">Failed</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${(report.summary.totalDuration / 1000).toFixed(1)}s</div>
          <div class="summary-label">Total Duration</div>
        </div>
      </div>
    </div>

    <div class="scenarios">
      ${report.scenarios.map(scenario => `
        <div class="scenario">
          <div class="scenario-header">
            <div class="scenario-name">${scenario.name}</div>
            <div class="scenario-badge ${scenario.passed ? 'passed' : 'failed'}">
              ${scenario.passed ? 'PASSED' : 'FAILED'}
            </div>
          </div>
          <div class="scenario-stats">
            <div class="stat-item">
              ⏱️ ${(scenario.duration / 1000).toFixed(2)}s
            </div>
            <div class="stat-item">
              ✅ ${scenario.assertions.passed} / ${scenario.assertions.total} assertions
            </div>
            <div class="stat-item">
              ⚠️ ${scenario.warnings} warnings
            </div>
            <div class="stat-item">
              ❌ ${scenario.errors} errors
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="timestamp">
      Generated: ${new Date(report.timestamp).toLocaleString()}
    </div>
  </div>
</body>
</html>
  `.trim();
}
