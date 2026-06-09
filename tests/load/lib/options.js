// Shared k6 options builder for the MercyBlade API load scripts.
//
// Pick a virtual-user level with the LOAD_LEVEL env var: 50 | 200 | 500.
// Each level ramps up, holds, then ramps down, with latency + error-rate
// thresholds so a run fails loudly when the API degrades.
//
// Runtime (k6, not node): `LOAD_LEVEL=200 BASE_URL=... k6 run <script>.js`

const LEVELS = {
  "50": { vus: 50, hold: "1m" },
  "200": { vus: 200, hold: "2m" },
  "500": { vus: 500, hold: "2m" },
};

export const LOAD_LEVELS = Object.keys(LEVELS);

/**
 * Build a k6 `options` object for the chosen level. `env` is k6's `__ENV`.
 * Defaults to the 50-VU level when LOAD_LEVEL is unset or unrecognized.
 */
export function buildOptions(env) {
  const levelKey = String((env && env.LOAD_LEVEL) || "50");
  const level = LEVELS[levelKey] || LEVELS["50"];
  const rampUp = (env && env.RAMP_UP) || "30s";
  const rampDown = (env && env.RAMP_DOWN) || "30s";

  return {
    scenarios: {
      ramping: {
        executor: "ramping-vus",
        startVUs: 0,
        stages: [
          { duration: rampUp, target: level.vus },
          { duration: level.hold, target: level.vus },
          { duration: rampDown, target: 0 },
        ],
        gracefulStop: "30s",
      },
    },
    thresholds: {
      // Fail the run if more than 5% of requests error, or p95 latency exceeds 3s.
      http_req_failed: ["rate<0.05"],
      http_req_duration: ["p(95)<3000"],
    },
  };
}
