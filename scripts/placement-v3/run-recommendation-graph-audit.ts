#!/usr/bin/env tsx
import { printRun, runAudit, writeRun } from "./dataQualityAuditCore.js";

const run = runAudit("recommendation_graph");
const file = writeRun(run, "recommendation-graph");
printRun({ ...run, issues: run.issues, changedFilesSincePreviousRun: [...run.changedFilesSincePreviousRun, file] });
