#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INVENTORY_PATH = "reports/cell-inventory/vn-en-a1-inventory.json";
const INT_PROBE_PATH = "reports/cell-inventory/int-probe-vn-en-a1.json";
const VALID_STATES = new Set(["covered", "blind", "unmeasured"]);
const EXPECTED_TOTAL_CELLS = 627;
const EXPECTED_DIALOGUE_CELLS = 215;
const EXPECTED_DIALOGUE_TOTALS = {
  covered: 54,
  blind: 16,
  unmeasured: 145,
};

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function countBy(rows, getValue) {
  return rows.reduce((counts, row) => {
    const value = getValue(row);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

const inventory = readJson(INVENTORY_PATH);
const probe = readJson(INT_PROBE_PATH);
const cells = inventory.cells ?? [];
const probeCells = probe.cells ?? [];
const dialogueCells = cells.filter((cell) => cell.cell_type === "Dialogue Turn");
const missing = [];
const invalid = [];
const doubleCounted = [];

assert(cells.length === EXPECTED_TOTAL_CELLS, `expected ${EXPECTED_TOTAL_CELLS} inventory rows, found ${cells.length}`);
assert(dialogueCells.length === EXPECTED_DIALOGUE_CELLS, `expected ${EXPECTED_DIALOGUE_CELLS} dialogue rows, found ${dialogueCells.length}`);
assert(probeCells.length === EXPECTED_DIALOGUE_CELLS, `expected ${EXPECTED_DIALOGUE_CELLS} INT probe rows, found ${probeCells.length}`);

for (const cell of cells) {
  const state = cell.int_probe?.state;
  if (!state) missing.push(cell.id);
  if (state && !VALID_STATES.has(state)) invalid.push({ id: cell.id, state });
  const matchedStates = [...VALID_STATES].filter((candidate) => state === candidate);
  if (matchedStates.length !== 1) doubleCounted.push({ id: cell.id, states: matchedStates });
}

const allCellTotals = countBy(cells, (cell) => cell.int_probe?.state ?? "missing");
const dialogueTotals = countBy(dialogueCells, (cell) => cell.int_probe?.state ?? "missing");
const blindMarkers = dialogueCells.filter((cell) => cell.int_probe?.state === "blind" && cell.int_probe?.abstention_marker?.kind === "class_b_fixture_locked_abstention");

assert(missing.length === 0, `missing int_probe state rows: ${missing.join(", ")}`);
assert(invalid.length === 0, `invalid int_probe states: ${JSON.stringify(invalid)}`);
assert(doubleCounted.length === 0, `double-counted int_probe rows: ${JSON.stringify(doubleCounted)}`);
assert(Object.entries(EXPECTED_DIALOGUE_TOTALS).every(([state, expected]) => dialogueTotals[state] === expected), `dialogue totals mismatch: ${JSON.stringify(dialogueTotals)}`);
assert(blindMarkers.length === EXPECTED_DIALOGUE_TOTALS.blind, `expected ${EXPECTED_DIALOGUE_TOTALS.blind} class-B blind markers, found ${blindMarkers.length}`);

console.log(JSON.stringify({
  status: "ok",
  inventory_rows_with_int_probe_state: `${cells.length}/${EXPECTED_TOTAL_CELLS}`,
  valid_states: [...VALID_STATES],
  all_cell_totals: allCellTotals,
  dialogue_probe_totals: dialogueTotals,
  class_b_fixture_locked_blind_markers: blindMarkers.length,
  missing_rows: missing.length,
  double_counted_rows: doubleCounted.length,
}, null, 2));
