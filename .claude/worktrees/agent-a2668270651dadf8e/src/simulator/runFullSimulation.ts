// Run Full Simulation - Execute all scenarios

import { simulator } from './LaunchSimulatorCore';
import { runScenario_LoadAllRooms } from './scenarios/Scenario_LoadAllRooms';
import { runScenario_TierBoundaryCheck } from './scenarios/Scenario_TierBoundaryCheck';
import { runScenario_CorruptedJSONBoot } from './scenarios/Scenario_CorruptedJSONBoot';
import { buildLaunchReport } from './LaunchReportBuilder';
import { generateHTMLReport } from './htmlReportTemplate';

export async function runFullSimulation() {
  console.log('🚀 Starting Launch Simulation...\n');

  simulator.reset();

  // Run all scenarios
  await runScenario_LoadAllRooms();
  await runScenario_TierBoundaryCheck();
  await runScenario_CorruptedJSONBoot();

  // Get summary
  const summary = simulator.getSummary();

  console.log('\n📊 Simulation Summary:');
  console.log(`   Total Scenarios: ${summary.totalScenarios}`);
  console.log(`   Passed: ${summary.passedScenarios}`);
  console.log(`   Failed: ${summary.failedScenarios}`);
  console.log(`   Total Duration: ${(summary.totalDuration / 1000).toFixed(2)}s`);
  console.log(`   Overall Status: ${summary.passed ? '✅ PASSED' : '❌ FAILED'}\n`);

  // Build report
  const report = buildLaunchReport(summary.allResults);
  const htmlReport = generateHTMLReport(report);

  // Export reports
  const jsonReport = JSON.stringify(report, null, 2);

  console.log('📄 Reports generated:');
  console.log('   - launch-report.json');
  console.log('   - launch-report.html');

  return {
    report,
    htmlReport,
    jsonReport,
    passed: summary.passed,
  };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullSimulation().then(({ passed }) => {
    process.exit(passed ? 0 : 1);
  }).catch(error => {
    console.error('❌ Simulation failed:', error);
    process.exit(1);
  });
}
