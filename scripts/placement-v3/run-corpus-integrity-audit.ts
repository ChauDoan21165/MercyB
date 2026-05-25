#!/usr/bin/env tsx
import { printRun, runAudit, writeRun } from "./dataQualityAuditCore.js";

const run = runAudit("corpus_integrity");
const file = writeRun(run, "corpus-integrity");
printRun({ ...run, issues: run.issues, changedFilesSincePreviousRun: [...run.changedFilesSincePreviousRun, file] });
