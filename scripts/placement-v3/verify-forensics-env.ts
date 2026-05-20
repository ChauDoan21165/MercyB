import process from "node:process";

type EnvCheck = {
  name: string;
  required: boolean;
  present: boolean;
  redacted: string;
  note: string;
};

const REQUIRED = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
] as const;

const PROVIDER_KEYS = ["OPENAI_API_KEY", "GEMINI_API_KEY"] as const;

function redact(value: string | undefined): string {
  if (!value) return "missing";
  const trimmed = value.trim();
  if (trimmed.length <= 8) return "[set:redacted]";
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)} (${trimmed.length} chars)`;
}

function checkEnv(name: string, required: boolean, note: string): EnvCheck {
  const value = process.env[name];
  return {
    name,
    required,
    present: Boolean(value?.trim()),
    redacted: redact(value),
    note,
  };
}

function main() {
  const checks: EnvCheck[] = [
    ...REQUIRED.map((name) =>
      checkEnv(name, true, "Required for live Supabase persistence/dashboard validation.")
    ),
    ...PROVIDER_KEYS.map((name) =>
      checkEnv(name, false, "At least one provider key is required for live provider validation.")
    ),
    checkEnv("PLACEMENT_V3_UI_ENABLED", false, "Optional Edge/runtime flag."),
    checkEnv("PLACEMENT_TEST_ENABLED", false, "Optional Edge/runtime flag."),
    checkEnv("VITE_PLACEMENT_V3_UI_ENABLED", false, "Optional browser flag."),
    checkEnv("VITE_PLACEMENT_TEST_ENABLED", false, "Optional browser flag."),
  ];

  const missingRequired = checks
    .filter((check) => check.required && !check.present)
    .map((check) => check.name);
  const providerPresent = PROVIDER_KEYS.some((name) => Boolean(process.env[name]?.trim()));

  console.log("Placement V3 forensics live-validation env check");
  console.log("No provider or Supabase network calls were made.\n");
  for (const check of checks) {
    const status = check.present ? "present" : check.required ? "missing" : "not set";
    console.log(`${check.name}: ${status} ${check.redacted}`);
    console.log(`  ${check.note}`);
  }

  const missing: string[] = [...missingRequired];
  if (!providerPresent) {
    missing.push("OPENAI_API_KEY or GEMINI_API_KEY");
  }

  if (missing.length > 0) {
    console.error("\nMissing required live-validation env:");
    for (const name of missing) {
      console.error(`- ${name}`);
    }
    process.exit(1);
  }

  console.log("\nEnvironment is ready for live-validation attempts.");
  console.log("This does not prove live provider calls or live Supabase inserts.");
}

main();
