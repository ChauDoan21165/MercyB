#!/usr/bin/env tsx
import { printRun, runAudit, writeRun } from "./dataQualityAuditCore.js";

const run = runAudit("taxonomy_consistency");
const file = writeRun(run, "taxonomy-consistency");
printRun({ ...run, issues: run.issues, changedFilesSincePreviousRun: [...run.changedFilesSincePreviousRun, file] });
