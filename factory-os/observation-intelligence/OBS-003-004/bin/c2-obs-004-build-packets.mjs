#!/usr/bin/env node
/**
 * C2-OBS-INT-PHASE2 / OBS-004 — Evidence Packet Builder (promptAssembly slice)
 *
 * Only OBS-003 replay-PASSING records become packets. For each, re-derive the
 * real input/output from the SAME reconstructed probe binding, and assemble a
 * self-contained, Judge-consumable evidence packet carrying:
 *   tm_int_id, axis, module, code_path, input, output, output_digest,
 *   replay proof (recorded vs replayed digests + per-check booleans),
 *   attribution confidence, and run_ids linking OBS-003 -> OBS-002 -> OBS-001.
 *
 * Deterministic. READ-ONLY w.r.t. inputs. No registry / counter / Judge writes.
 *
 *   cd ~/MercyB && node --import tsx \
 *     ~/ai-tutor-factory/bin/c2-obs-004-build-packets.mjs [runId]
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const HOME = process.env.HOME;
const MERCYB = `${HOME}/MercyB`;
const FACTORY = `${HOME}/ai-tutor-factory`;
const OBS_DIR = `${FACTORY}/state/observations`;

const ATTRIB = `${OBS_DIR}/OBS-002-attributions.jsonl`;
const OBS1 = `${OBS_DIR}/tm-int-observations.jsonl`;
const REPLAYS = `${OBS_DIR}/OBS-003-replays.jsonl`;
const OUT_DIR = `${OBS_DIR}/OBS-004-evidence-packets`;

const RUN_ID = process.argv[2] || "obs004-proof-run-001";
const TS = "2026-07-07T00:00:00.000Z";
const CODE = "src/lib/ai-tutor/promptAssembly.ts";
const PACKET_SCHEMA = "tm-int-obs-evidence-packet-v1";

function digest(value) {
  const s = typeof value === "string" ? value : JSON.stringify(value ?? null);
  return "sha256:" + createHash("sha256").update(s, "utf8").digest("hex");
}

const {
  assembleCefrConstraint,
  assembleContextBlock,
  assembleSystemPrompt,
  getHighSeverityL1Patterns,
  applyForbiddenVocabFilter,
  buildRefusalResponse,
  buildFallbackResponse,
  buildInvalidInputResponse,
  parseResponse,
  enforceTokenBudget,
} = await import(`${MERCYB}/src/lib/ai-tutor/promptAssembly.ts`);

const PATTERNS = getHighSeverityL1Patterns("A2");

const PROBES = {
  assembleCefrConstraint: { codePath: `${CODE}:assembleCefrConstraint`, input: ["A2"], run: () => assembleCefrConstraint("A2") },
  assembleSystemPrompt: { codePath: `${CODE}:assembleSystemPrompt`, input: ["general_chat", "A2", "Minh"], run: () => assembleSystemPrompt("general_chat", "A2", "Minh") },
  assembleSystemPromptNullCefr: { codePath: `${CODE}:assembleSystemPrompt`, input: ["general_chat", null, "Minh"], run: () => assembleSystemPrompt("general_chat", null, "Minh") },
  assembleContextBlock: {
    codePath: `${CODE}:assembleContextBlock`,
    input: [null, "A2", "Minh", "3", "thì quá khứ", "mạo từ, thì quá khứ", PATTERNS],
    run: () => assembleContextBlock(null, "A2", "Minh", "3", "thì quá khứ", "mạo từ, thì quá khứ", PATTERNS),
  },
  getHighSeverityL1Patterns: { codePath: `${CODE}:getHighSeverityL1Patterns`, input: ["A2"], run: () => getHighSeverityL1Patterns("A2") },
  applyForbiddenVocabFilter: { codePath: `${CODE}:applyForbiddenVocabFilter`, input: ["Bạn giỏi tuyệt vời, xuất sắc nhất!"], run: () => applyForbiddenVocabFilter("Bạn giỏi tuyệt vời, xuất sắc nhất!") },
  buildRefusalResponse: { codePath: `${CODE}:buildRefusalResponse`, input: ["self_harm"], run: () => buildRefusalResponse("self_harm") },
  buildFallbackResponse: { codePath: `${CODE}:buildFallbackResponse`, input: [2], run: () => buildFallbackResponse(2) },
  buildInvalidInputEmpty: { codePath: `${CODE}:buildInvalidInputResponse`, input: ["empty"], run: () => buildInvalidInputResponse("empty") },
  buildInvalidInputNonLanguage: { codePath: `${CODE}:buildInvalidInputResponse`, input: ["non_language"], run: () => buildInvalidInputResponse("non_language") },
  parseResponse: { codePath: `${CODE}:parseResponse`, input: ['{"en":"I went to the market","vi":"Tôi đã đi chợ"}'], run: () => parseResponse('{"en":"I went to the market","vi":"Tôi đã đi chợ"}') },
  enforceTokenBudget: { codePath: `${CODE}:enforceTokenBudget`, input: ["SYSTEM", [{ role: "user", content: "hello teacher" }], 4000], run: () => enforceTokenBudget("SYSTEM", [{ role: "user", content: "hello teacher" }], 4000) },
};

function readJsonl(path) {
  return readFileSync(path, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
}

function main() {
  const attributed = new Map(
    readJsonl(ATTRIB)
      .filter((r) => r.status === "attributed" && r.confidence === "high")
      .map((r) => [r.tm_int_id, r]),
  );
  const obs1ById = new Map(readJsonl(OBS1).map((o) => [o.tm_int_id, o]));
  const replays = readJsonl(REPLAYS).filter((r) => r.replay === "pass");

  mkdirSync(OUT_DIR, { recursive: true });
  const manifest = [];

  for (const rep of replays) {
    const attr = attributed.get(rep.tm_int_id);
    const obs = obs1ById.get(rep.tm_int_id);
    const probe = PROBES[rep.probe_id];
    const input = probe.input;
    const output = probe.run();
    const outDigest = digest(output);

    // Guard: packet output_digest must equal the OBS-003 replayed & OBS-001 recorded digest.
    if (outDigest !== rep.replayed_output_digest || outDigest !== obs.output_digest) {
      throw new Error(`digest drift building packet for ${rep.tm_int_id}`);
    }

    const packet = {
      schema: PACKET_SCHEMA,
      packet_id: `OBS-004-${rep.tm_int_id}`,
      created_at: TS,
      source: "tm-int-obs",
      module: rep.module,
      tm_int_id: rep.tm_int_id,
      axis: rep.axis,
      code_path: rep.resolved_code_path,
      probe_id: rep.probe_id,
      input,
      output,
      input_digest: obs.input_digest,
      output_digest: outDigest,
      attribution: {
        status: attr.status,
        confidence: attr.confidence,
        evidence: attr.evidence,
        is_covered_anchor: attr.is_covered_anchor,
        sharpened: attr.sharpened === true,
      },
      replay_proof: {
        replay: "pass",
        recorded_output_digest: obs.output_digest,
        replayed_output_digest: rep.replayed_output_digest,
        recorded_input_digest: obs.input_digest,
        replayed_input_digest: rep.replayed_input_digest,
        checks: rep.checks,
      },
      run_ids: {
        obs001: obs.run_id,
        obs002: attr.run_id,
        obs003: rep.run_id,
        obs004: RUN_ID,
      },
      lineage: [
        { stage: "OBS-001", artifact: "state/observations/tm-int-observations.jsonl", run_id: obs.run_id },
        { stage: "OBS-002", artifact: "state/observations/OBS-002-attributions.jsonl", run_id: attr.run_id },
        { stage: "OBS-003", artifact: "state/observations/OBS-003-replays.jsonl", run_id: rep.run_id },
      ],
    };

    const file = `${OUT_DIR}/${packet.packet_id}.json`;
    writeFileSync(file, JSON.stringify(packet, null, 2) + "\n", "utf8");
    manifest.push({ packet_id: packet.packet_id, tm_int_id: packet.tm_int_id, axis: packet.axis, file: `OBS-004-evidence-packets/${packet.packet_id}.json`, output_digest: packet.output_digest });
  }

  const manifestObj = {
    schema: "tm-int-obs-evidence-packet-manifest-v1",
    run_id: RUN_ID,
    created_at: TS,
    packet_count: manifest.length,
    packets: manifest,
  };
  writeFileSync(`${OUT_DIR}/manifest.json`, JSON.stringify(manifestObj, null, 2) + "\n", "utf8");

  console.log(JSON.stringify({ run_id: RUN_ID, out_dir: OUT_DIR, packet_count: manifest.length }, null, 2));
}

main();
