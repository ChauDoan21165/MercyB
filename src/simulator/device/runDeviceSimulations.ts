#!/usr/bin/env node
// Run all device simulations

import { simulator } from '../LaunchSimulatorCore';
import { runScenario_iPhoneSE_OnboardingChat } from '../scenarios/device/Scenario_iPhoneSE_OnboardingChat';
import { runScenario_AndroidLowEnd_KidsAudio } from '../scenarios/device/Scenario_AndroidLowEnd_KidsAudio';

async function main() {
  console.log('🎯 Starting Device Simulations\n');
  console.log('================================\n');

  simulator.reset();

  // Run all device scenarios
  await runScenario_iPhoneSE_OnboardingChat();
  await runScenario_AndroidLowEnd_KidsAudio();

  // Get summary
  const summary = simulator.getSummary();

  console.log('\n📊 Device Simulation Summary:');
  console.log(`   Total Scenarios: ${summary.totalScenarios}`);
  console.log(`   Passed: ${summary.passedScenarios}`);
  console.log(`   Failed: ${summary.failedScenarios}`);
  console.log(`   Total Duration: ${(summary.totalDuration / 1000).toFixed(2)}s`);
  console.log(`   Overall Status: ${summary.passed ? '✅ PASSED' : '❌ FAILED'}\n`);

  // Export report
  const reportPath = './device-sim-report.json';
  const fs = require('fs');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`📄 Report written to: ${reportPath}\n`);

  process.exit(summary.passed ? 0 : 1);
}

main().catch(error => {
  console.error('❌ Device simulation failed:', error);
  process.exit(1);
});
