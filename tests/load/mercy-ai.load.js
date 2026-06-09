// Load profile for the OpenAI proxy: POST /api/mercy-ai.
//
// SAFETY: this sends REAL inference requests (OpenAI cost + rate limits). Point
// BASE_URL at a staging/local target only — NEVER production. The script issues
// no database writes; it only exercises the inference endpoint.
//
// Run (k6 required):
//   LOAD_LEVEL=50  BASE_URL=https://staging.example.dev MERCY_JWT=... k6 run tests/load/mercy-ai.load.js
//   LOAD_LEVEL=200 ... ; LOAD_LEVEL=500 ...
// Override the request body to match the live contract with MERCY_AI_PAYLOAD (JSON string).

import http from "k6/http";
import { check, sleep } from "k6";
import { buildOptions } from "./lib/options.js";
import { requireBaseUrl, authHeaders, jsonPayload } from "./lib/env.js";

export const options = buildOptions(__ENV);

// Placeholder body — override with MERCY_AI_PAYLOAD to match the deployed contract.
const DEFAULT_PAYLOAD = {
  messages: [{ role: "user", content: "Hello, can we practice ordering coffee?" }],
  scenario: "food-ordering",
};

export function setup() {
  return { baseUrl: requireBaseUrl(__ENV) };
}

export default function (data) {
  const url = `${data.baseUrl}/api/mercy-ai`;
  const body = JSON.stringify(jsonPayload(__ENV, "MERCY_AI_PAYLOAD", DEFAULT_PAYLOAD));
  const res = http.post(url, body, { headers: authHeaders(__ENV), timeout: "60s" });

  check(res, {
    "status is 2xx": (r) => r.status >= 200 && r.status < 300,
    "has response body": (r) => !!r.body && r.body.length > 0,
  });

  sleep(1);
}
