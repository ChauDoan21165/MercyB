// Load profile for text-to-speech: POST /api/tts.
//
// SAFETY: this sends REAL TTS synthesis requests (Azure Speech cost + rate
// limits). Point BASE_URL at a staging/local target only — NEVER production.
// The script issues no database writes; it only exercises the TTS endpoint.
//
// Run (k6 required):
//   LOAD_LEVEL=50  BASE_URL=https://staging.example.dev MERCY_JWT=... k6 run tests/load/tts.load.js
//   LOAD_LEVEL=200 ... ; LOAD_LEVEL=500 ...
// Override the request body to match the live contract with TTS_PAYLOAD (JSON string).

import http from "k6/http";
import { check, sleep } from "k6";
import { buildOptions } from "./lib/options.js";
import { requireBaseUrl, authHeaders, jsonPayload } from "./lib/env.js";

export const options = buildOptions(__ENV);

// Placeholder body — override with TTS_PAYLOAD to match the deployed contract.
// Vietnamese text intentionally pairs with a Vietnamese language hint so the
// route exercises language-aware voice routing under load.
const DEFAULT_PAYLOAD = {
  text: "Hôm nay trời đẹp.",
  language: "vi-VN",
};

export function setup() {
  return { baseUrl: requireBaseUrl(__ENV) };
}

export default function (data) {
  const url = `${data.baseUrl}/api/tts`;
  const body = JSON.stringify(jsonPayload(__ENV, "TTS_PAYLOAD", DEFAULT_PAYLOAD));
  const res = http.post(url, body, { headers: authHeaders(__ENV), timeout: "60s" });

  check(res, {
    "status is 2xx": (r) => r.status >= 200 && r.status < 300,
    "has audio or url body": (r) => !!r.body && r.body.length > 0,
  });

  sleep(1);
}
