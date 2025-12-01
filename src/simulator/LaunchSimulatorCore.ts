// Launch Simulator Core - Simulation primitives (no app-specific logic)

export interface SimulationStep {
  name: string;
  action: () => Promise<void> | void;
  expectedResult?: string;
}

export interface SimulationResult {
  scenarioName: string;
  passed: boolean;
  duration: number;
  steps: StepResult[];
  logs: SimulationLog[];
  assertions: AssertionResult[];
  error?: string;
}

export interface StepResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export interface SimulationLog {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
}

export interface AssertionResult {
  condition: boolean;
  message: string;
  passed: boolean;
}

export class LaunchSimulator {
  private results: SimulationResult[] = [];
  private currentScenario: string | null = null;
  private currentLogs: SimulationLog[] = [];
  private currentAssertions: AssertionResult[] = [];
  private scenarioStartTime: number = 0;

  async runScenario(name: string, steps: SimulationStep[]): Promise<SimulationResult> {
    this.currentScenario = name;
    this.currentLogs = [];
    this.currentAssertions = [];
    this.scenarioStartTime = Date.now();

    this.info(`Starting scenario: ${name}`);

    const stepResults: StepResult[] = [];
    let scenarioPassed = true;

    for (const step of steps) {
      const stepStartTime = Date.now();
      
      try {
        this.info(`Running step: ${step.name}`);
        await step.action();
        
        const stepDuration = Date.now() - stepStartTime;
        stepResults.push({
          name: step.name,
          passed: true,
          duration: stepDuration,
        });
        
        this.info(`Step passed: ${step.name} (${stepDuration}ms)`);
      } catch (error: any) {
        const stepDuration = Date.now() - stepStartTime;
        scenarioPassed = false;
        
        stepResults.push({
          name: step.name,
          passed: false,
          duration: stepDuration,
          error: error.message || String(error),
        });
        
        this.error(`Step failed: ${step.name} - ${error.message}`);
      }
    }

    // Check if any assertions failed
    const assertionsFailed = this.currentAssertions.some(a => !a.passed);
    if (assertionsFailed) {
      scenarioPassed = false;
    }

    const totalDuration = Date.now() - this.scenarioStartTime;

    const result: SimulationResult = {
      scenarioName: name,
      passed: scenarioPassed,
      duration: totalDuration,
      steps: stepResults,
      logs: [...this.currentLogs],
      assertions: [...this.currentAssertions],
    };

    this.results.push(result);
    this.info(`Scenario complete: ${name} - ${scenarioPassed ? 'PASSED' : 'FAILED'}`);

    return result;
  }

  assert(condition: boolean, message: string): void {
    const result: AssertionResult = {
      condition,
      message,
      passed: condition,
    };

    this.currentAssertions.push(result);

    if (!condition) {
      this.warn(`Assertion failed: ${message}`);
    } else {
      this.info(`Assertion passed: ${message}`);
    }
  }

  info(message: string): void {
    this.log('info', message);
  }

  warn(message: string): void {
    this.log('warn', message);
  }

  error(message: string): void {
    this.log('error', message);
  }

  private log(level: 'info' | 'warn' | 'error', message: string): void {
    const log: SimulationLog = {
      level,
      message,
      timestamp: Date.now(),
    };

    this.currentLogs.push(log);

    // Also log to console in dev
    if (import.meta.env.DEV) {
      const prefix = `[Simulator][${this.currentScenario}]`;
      switch (level) {
        case 'info':
          console.log(`${prefix} ${message}`);
          break;
        case 'warn':
          console.warn(`${prefix} ${message}`);
          break;
        case 'error':
          console.error(`${prefix} ${message}`);
          break;
      }
    }
  }

  getSummary() {
    const totalScenarios = this.results.length;
    const passedScenarios = this.results.filter(r => r.passed).length;
    const failedScenarios = totalScenarios - passedScenarios;
    
    const totalSteps = this.results.reduce((sum, r) => sum + r.steps.length, 0);
    const passedSteps = this.results.reduce((sum, r) => sum + r.steps.filter(s => s.passed).length, 0);
    const failedSteps = totalSteps - passedSteps;

    const totalAssertions = this.results.reduce((sum, r) => sum + r.assertions.length, 0);
    const passedAssertions = this.results.reduce((sum, r) => sum + r.assertions.filter(a => a.passed).length, 0);
    const failedAssertions = totalAssertions - passedAssertions;

    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return {
      totalScenarios,
      passedScenarios,
      failedScenarios,
      totalSteps,
      passedSteps,
      failedSteps,
      totalAssertions,
      passedAssertions,
      failedAssertions,
      totalDuration,
      allResults: this.results,
      passed: failedScenarios === 0 && failedAssertions === 0,
    };
  }

  reset(): void {
    this.results = [];
    this.currentScenario = null;
    this.currentLogs = [];
    this.currentAssertions = [];
  }
}

export const simulator = new LaunchSimulator();
