#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import process from "node:process";

export const PRICE_TEST_EVENT_TYPES = [
  "price_test_variant_exposure",
  "price_test_checkout_start",
  "price_test_checkout_complete",
];

function usage() {
  return `Usage:
  node scripts/cohort/price-test-readout.mjs \\
    --start 2026-07-01 --end 2026-07-31 \\
    --out-json reports/cohort/price-test-readout.json \\
    --out-md reports/cohort/price-test-readout.md

Environment:
  SUPABASE_URL or VITE_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
`;
}

export function parseArgs(argv) {
  const out = {
    start: null,
    end: null,
    outJson: "reports/cohort/price-test-readout.json",
    outMd: "reports/cohort/price-test-readout.md",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === "--help") return { help: true };
    if (!flag.startsWith("--")) throw new Error(`Unknown argument: ${flag}`);
    if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
    i += 1;
    if (flag === "--start") out.start = value.trim();
    else if (flag === "--end") out.end = value.trim();
    else if (flag === "--out-json") out.outJson = value.trim();
    else if (flag === "--out-md") out.outMd = value.trim();
    else throw new Error(`Unknown argument: ${flag}`);
  }
  validateDate(out.start, "--start");
  validateDate(out.end, "--end");
  return out;
}

function validateDate(value, flag) {
  if (!value) throw new Error(`${flag} is required`);
  const time = Date.parse(value);
  if (!Number.isFinite(time)) throw new Error(`${flag} must be an ISO date or timestamp`);
}

function serviceConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Missing SUPABASE_URL or VITE_SUPABASE_URL");
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return { url: url.replace(/\/$/, ""), key };
}

async function supabaseGet(path, params) {
  const { url, key } = serviceConfig();
  const query = new URLSearchParams();
  for (const [name, value] of params) query.append(name, value);
  const response = await fetch(`${url}/rest/v1/${path}?${query.toString()}`, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      accept: "application/json",
    },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Supabase GET ${path} failed: ${response.status} ${body.slice(0, 240)}`);
  }
  return response.json();
}

export async function fetchPriceTestRows({ start, end }) {
  return supabaseGet("learning_events", [
    ["select", "user_id,event_type,payload,created_at"],
    ["event_type", `in.(${PRICE_TEST_EVENT_TYPES.join(",")})`],
    ["created_at", `gte.${new Date(start).toISOString()}`],
    ["created_at", `lt.${new Date(end).toISOString()}`],
    ["order", "created_at.asc"],
    ["limit", "50000"],
  ]);
}

function variantFromRow(row) {
  const variant = row?.payload?.price_test_variant;
  return variant === "test" ? "test" : "control";
}

function emptyVariant(variant) {
  return {
    variant,
    exposures: 0,
    checkout_starts: 0,
    checkout_completes: 0,
    unique_exposed_users: 0,
    unique_checkout_start_users: 0,
    unique_checkout_complete_users: 0,
    checkout_start_rate: null,
    checkout_complete_rate: null,
  };
}

export function aggregatePriceTestRows(rows) {
  const buckets = {
    control: emptyVariant("control"),
    test: emptyVariant("test"),
  };
  const seen = {
    exposure: { control: new Set(), test: new Set() },
    start: { control: new Set(), test: new Set() },
    complete: { control: new Set(), test: new Set() },
  };

  for (const row of rows) {
    const variant = variantFromRow(row);
    const bucket = buckets[variant];
    const userId = row.user_id;
    if (row.event_type === "price_test_variant_exposure") {
      bucket.exposures += 1;
      if (userId) seen.exposure[variant].add(userId);
    } else if (row.event_type === "price_test_checkout_start") {
      bucket.checkout_starts += 1;
      if (userId) seen.start[variant].add(userId);
    } else if (row.event_type === "price_test_checkout_complete") {
      bucket.checkout_completes += 1;
      if (userId) seen.complete[variant].add(userId);
    }
  }

  return Object.fromEntries(Object.entries(buckets).map(([variant, bucket]) => {
    bucket.unique_exposed_users = seen.exposure[variant].size;
    bucket.unique_checkout_start_users = seen.start[variant].size;
    bucket.unique_checkout_complete_users = seen.complete[variant].size;
    bucket.checkout_start_rate = rate(bucket.unique_checkout_start_users, bucket.unique_exposed_users);
    bucket.checkout_complete_rate = rate(bucket.unique_checkout_complete_users, bucket.unique_exposed_users);
    return [variant, bucket];
  }));
}

function rate(numerator, denominator) {
  return denominator > 0 ? Number((numerator / denominator).toFixed(4)) : null;
}

function renderMarkdown({ start, end, rows, aggregate }) {
  const lines = [
    "# Price Test Readout",
    "",
    `Window: ${start} to ${end} (end exclusive)`,
    `Source: authenticated learning_events rows (${rows.length} total).`,
    "",
    "| Variant | Exposed users | Checkout-start users | Checkout-complete users | Start rate | Complete rate |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const variant of ["control", "test"]) {
    const item = aggregate[variant];
    lines.push(`| ${variant} | ${item.unique_exposed_users} | ${item.unique_checkout_start_users} | ${item.unique_checkout_complete_users} | ${formatRate(item.checkout_start_rate)} | ${formatRate(item.checkout_complete_rate)} |`);
  }
  lines.push("", "Notes: anonymous browser analytics may exist outside this table. This readout intentionally uses persisted first-party learning_events rows with sample sizes.");
  return `${lines.join("\n")}\n`;
}

function formatRate(value) {
  return value === null ? "n/a" : `${(value * 100).toFixed(1)}%`;
}

function writeOutputs({ outJson, outMd, payload, markdown }) {
  mkdirSync(dirname(outJson), { recursive: true });
  mkdirSync(dirname(outMd), { recursive: true });
  writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`);
  writeFileSync(outMd, markdown);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  const rows = await fetchPriceTestRows(args);
  const aggregate = aggregatePriceTestRows(rows);
  const payload = {
    generated_at: new Date().toISOString(),
    window: { start: args.start, end: args.end },
    source: "learning_events",
    sample_size_rows: rows.length,
    variants: aggregate,
  };
  const markdown = renderMarkdown({ start: args.start, end: args.end, rows, aggregate });
  writeOutputs({ outJson: args.outJson, outMd: args.outMd, payload, markdown });
  console.log(markdown);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
