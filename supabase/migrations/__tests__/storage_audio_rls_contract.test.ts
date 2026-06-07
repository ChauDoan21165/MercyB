import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_DIR = resolve(process.cwd(), "supabase/migrations");
const TIGHTEN_MIGRATION = "20260715000000_storage_audio_service_role_writes.sql";

function normalizeSql(sql: string) {
  return sql.toLowerCase().replace(/\s+/g, " ").trim();
}

function migrationSql(file: string) {
  return readFileSync(resolve(MIGRATION_DIR, file), "utf8");
}

const tightenSql = normalizeSql(migrationSql(TIGHTEN_MIGRATION));
const chainSql = normalizeSql(
  readdirSync(MIGRATION_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map(migrationSql)
    .join("\n"),
);

function finalStorageWritePolicies(sql: string) {
  const policies = new Map<string, string>();
  const statementPattern =
    /\b(drop|create)\s+policy\s+(?:if\s+exists\s+)?(?:"([^"]+)"|([a-z_][a-z0-9_ ]*))\s+[^;]*?\bon\s+storage\.objects\b[^;]*;/gi;

  for (const match of sql.matchAll(statementPattern)) {
    const statement = normalizeSql(match[0]);
    const action = match[1].toLowerCase();
    const name = normalizeSql(match[2] ?? match[3]);

    if (action === "drop") {
      policies.delete(name);
      continue;
    }

    if (
      statement.includes(" for insert ") ||
      statement.includes(" for update ") ||
      statement.includes(" for delete ")
    ) {
      policies.set(name, statement);
    }
  }

  return policies;
}

const audioBuckets = ["room-audio", "room-audio-uploads", "audio"];

function targetsAudioBucket(policySql: string) {
  return audioBuckets.some((bucket) => policySql.includes(`bucket_id = '${bucket}'`));
}

describe("storage audio RLS contract", () => {
  it("drops legacy audio write policies before recreating service-role policies", () => {
    for (const policyName of [
      "Service role can upload room audio",
      "VIP users can upload to room-audio-uploads",
      "Admins can upload room audio files",
      "Admins can delete room audio files",
      "Admin upload access for audio files",
      "Admin update access for audio files",
      "Admin delete access for audio files",
    ]) {
      expect(tightenSql).toContain(
        normalizeSql(`drop policy if exists "${policyName}" on storage.objects`),
      );
    }
  });

  it("leaves audio bucket writes service-role scoped in a reset", () => {
    const policies = finalStorageWritePolicies(chainSql);
    const audioWritePolicies = [...policies.entries()].filter(([, policySql]) =>
      targetsAudioBucket(policySql),
    );

    expect(audioWritePolicies.map(([name]) => name).sort()).toEqual([
      "service role can delete audio files",
      "service role can delete room audio uploads",
      "service role can update audio files",
      "service role can upload audio files",
      "service role can upload room audio",
      "service role can upload room audio uploads",
    ]);

    for (const [, policySql] of audioWritePolicies) {
      expect(policySql).toContain(" to service_role ");
      expect(policySql).not.toContain(" to public ");
      expect(policySql).not.toContain(" to anon ");
      expect(policySql).not.toContain(" to authenticated ");
      expect(policySql).not.toContain("auth.uid() is not null");
      expect(policySql).not.toContain("has_role(auth.uid()");
    }
  });
});
