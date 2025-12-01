// Launch Report Builder - Aggregate simulation results

import type { SimulationResult } from './LaunchSimulatorCore';

export interface LaunchReport {
  timestamp: string;
  summary: {
    totalScenarios: number;
    passedScenarios: number;
    failedScenarios: number;
    totalDuration: number;
    passed: boolean;
  };
  scenarios: ScenarioReport[];
}

export interface ScenarioReport {
  name: string;
  passed: boolean;
  duration: number;
  errors: number;
  warnings: number;
  assertions: {
    total: number;
    passed: number;
    failed: number;
  };
}

export function buildLaunchReport(results: SimulationResult[]): LaunchReport {
  const scenarios: ScenarioReport[] = results.map(r => ({
    name: r.scenarioName,
    passed: r.passed,
    duration: r.duration,
    errors: r.logs.filter(l => l.level === 'error').length,
    warnings: r.logs.filter(l => l.level === 'warn').length,
    assertions: {
      total: r.assertions.length,
      passed: r.assertions.filter(a => a.passed).length,
      failed: r.assertions.filter(a => !a.passed).length,
    },
  }));

  const summary = {
    totalScenarios: results.length,
    passedScenarios: results.filter(r => r.passed).length,
    failedScenarios: results.filter(r => !r.passed).length,
    totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    passed: results.every(r => r.passed),
  };

  return {
    timestamp: new Date().toISOString(),
    summary,
    scenarios,
  };
}
