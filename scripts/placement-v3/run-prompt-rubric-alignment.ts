#!/usr/bin/env tsx
import { printRun, runAudit, writeRun } from "./dataQualityAuditCore.js";

const run = runAudit("prompt_rubric_alignment");
const file = writeRun(run, "prompt-rubric-alignment");
printRun({ ...run, issues: run.issues, changedFilesSincePreviousRun: [...run.changedFilesSincePreviousRun, file] });
