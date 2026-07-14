#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INVENTORY_PATH = "reports/cell-inventory/vn-en-a1-inventory.json";
const AUDIO_MAP_PATH = "reports/cell-inventory/audio-map-vn-en-a1.json";
const OUTPUT_JSON_PATH = "reports/cell-inventory/audio-link-vn-en-a1.json";
const OUTPUT_MD_PATH = "reports/cell-inventory/audio-link-vn-en-a1.md";
const EXPECTED_TOTAL_CELLS = 627;
const EXPECTED_VOCABULARY_CELLS = 412;
const EXPECTED_DIALOGUE_CELLS = 215;
const EXPECTED_TUPLES_PER_CELL = 1;

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function writeText(relativePath, text) {
  fs.writeFileSync(path.join(ROOT, relativePath), text);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function countBy(items, getValue) {
  return items.reduce((counts, item) => {
    const value = getValue(item);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function onlyEnglishTargetTuple(cell) {
  const tuples = Array.isArray(cell?.tuples) ? cell.tuples : [];
  assert(tuples.length === EXPECTED_TUPLES_PER_CELL, `expected exactly one tuple for ${cell?.cell_id}, found ${tuples.length}`);
  const tuple = tuples[0];
  assert(tuple?.role === "english_target", `expected english_target tuple for ${cell?.cell_id}`);
  assert(tuple?.voice === "en-US-AvaMultilingualNeural", `unexpected voice for ${cell?.cell_id}: ${tuple?.voice}`);
  assert(tuple?.language === "en", `unexpected tuple language for ${cell?.cell_id}: ${tuple?.language}`);
  assert(typeof tuple?.text === "string" && tuple.text.trim().length > 0, `missing tuple text for ${cell?.cell_id}`);
  assert(typeof tuple?.sha256 === "string" && /^[0-9a-f]{64}$/.test(tuple.sha256), `invalid sha256 for ${cell?.cell_id}`);
  assert(typeof tuple?.url === "string" && tuple.url.endsWith(`/tts-cache/${tuple.sha256}.mp3`), `url/hash mismatch for ${cell?.cell_id}`);
  return tuple;
}

function buildAudioLink() {
  const inventory = readJson(INVENTORY_PATH);
  const audioMap = readJson(AUDIO_MAP_PATH);
  const inventoryCells = Array.isArray(inventory?.cells) ? inventory.cells : [];
  const audioCells = Array.isArray(audioMap?.cells) ? audioMap.cells : [];

  assert(inventoryCells.length === EXPECTED_TOTAL_CELLS, `expected ${EXPECTED_TOTAL_CELLS} inventory cells, found ${inventoryCells.length}`);
  assert(audioCells.length === EXPECTED_TOTAL_CELLS, `expected ${EXPECTED_TOTAL_CELLS} audio-map cells, found ${audioCells.length}`);

  const audioByCellId = new Map();
  const duplicateAudioIds = [];
  for (const cell of audioCells) {
    if (audioByCellId.has(cell.cell_id)) duplicateAudioIds.push(cell.cell_id);
    audioByCellId.set(cell.cell_id, cell);
  }
  assert(duplicateAudioIds.length === 0, `duplicate audio-map cell ids: ${duplicateAudioIds.join(", ")}`);

  const links = [];
  for (const inventoryCell of inventoryCells) {
    const audioCell = audioByCellId.get(inventoryCell.id);
    assert(audioCell, `missing audio-map row for inventory cell ${inventoryCell.id}`);
    assert(audioCell.address_hash === inventoryCell.address_hash, `address_hash mismatch for ${inventoryCell.id}`);
    assert(audioCell.cell_type === inventoryCell.cell_type, `cell_type mismatch for ${inventoryCell.id}`);
    const tuple = onlyEnglishTargetTuple(audioCell);

    links.push({
      cell_id: inventoryCell.id,
      address_hash: inventoryCell.address_hash,
      legacy_cell_id: audioCell.legacy_cell_id,
      cell_type: inventoryCell.cell_type,
      source_file: inventoryCell.source_file,
      source_object: audioCell.source_object,
      address: inventoryCell.address,
      audio_status_before_link: inventoryCell.audio_status,
      link_status: "cache_addressable",
      link_authority: {
        kind: "deterministic_tts_cache_tuple",
        map_source: AUDIO_MAP_PATH,
        inventory_source: INVENTORY_PATH,
        canonical_key: "cell_id",
        lineage_key: "address_hash",
        bucket_presence_asserted: true,
      },
      tuple: {
        role: tuple.role,
        voice: tuple.voice,
        language: tuple.language,
        source_field: tuple.source_field,
        text: tuple.text,
        sha256: tuple.sha256,
        url: tuple.url,
      },
      int_probe: inventoryCell.int_probe ?? null,
    });
  }

  const cellsByType = countBy(links, (link) => link.cell_type);
  assert(cellsByType["Vocabulary Item"] === EXPECTED_VOCABULARY_CELLS, `expected ${EXPECTED_VOCABULARY_CELLS} vocabulary links, found ${cellsByType["Vocabulary Item"] ?? 0}`);
  assert(cellsByType["Dialogue Turn"] === EXPECTED_DIALOGUE_CELLS, `expected ${EXPECTED_DIALOGUE_CELLS} dialogue links, found ${cellsByType["Dialogue Turn"] ?? 0}`);
  assert(links.every((link) => link.link_status === "cache_addressable"), "not all links are cache_addressable");

  const dialogueLinks = links.filter((link) => link.cell_type === "Dialogue Turn");
  const intProbeStates = countBy(links, (link) => link.int_probe?.state ?? "missing");
  const dialogueIntProbeStates = countBy(dialogueLinks, (link) => link.int_probe?.state ?? "missing");

  return {
    metadata: {
      generated_by: "scripts/cell-os/build-audio-link-vn-en-a1.mjs",
      work_package: "WP-AUDIO-LINK-1",
      inventory_source: INVENTORY_PATH,
      audio_map_source: AUDIO_MAP_PATH,
      wedge: inventory.metadata?.wedge ?? null,
      link_model_note: "This artifact links canonical WP-CELL-ID-1 UUIDs to deterministic Azure TTS cache URLs. It does not mutate lesson source objects and does not recategorize these as checked-in reference audio assets.",
      cache_authority_note: "Bucket presence is inherited from the merged audio reconciliation report: all 627 current hashes returned HTTP 200 in production at reconciliation time.",
      amendments: [
        "canonical UUID cell_id is the primary join key; legacy vi-en:A1 addresses are retained only as lineage",
        "phrases arrays are counted as vocabulary cells",
        "audio linkage is cache_addressable, not checked_in_reference audio",
        "only English target TTS tuples are emitted for this wedge",
        "INT fold-in state is preserved from the merged inventory and is not re-probed",
      ],
    },
    summary: {
      total_cells: links.length,
      cells_by_type: cellsByType,
      link_status: countBy(links, (link) => link.link_status),
      tuples: links.length,
      english_target_tuples: links.filter((link) => link.tuple.role === "english_target").length,
      vietnamese_tts_cache_tuples: links.filter((link) => link.tuple.language === "vi").length,
      source_audio_status_before_link: countBy(links, (link) => link.audio_status_before_link),
      int_probe_states: intProbeStates,
      dialogue_int_probe_states: dialogueIntProbeStates,
    },
    links,
  };
}

function renderMarkdown(artifact) {
  const { summary, metadata, links } = artifact;
  const samples = links.slice(0, 10).map((link) =>
    `| \`${link.cell_id}\` | \`${link.address_hash}\` | ${link.cell_type} | ${link.tuple.text.replaceAll("|", "\\|")} | \`${link.tuple.sha256}\` |`
  ).join("\n");

  return `# VN->EN A1 Audio Link

Work package: \`${metadata.work_package}\`

Inventory source: \`${metadata.inventory_source}\`

Audio-map source: \`${metadata.audio_map_source}\`

## Verdict

All ${summary.total_cells} canonical VN->EN A1 cells are linked by persisted UUID to deterministic English-target Azure TTS cache URLs. The link is \`cache_addressable\`: it is a committed, replayable cache-address tuple, not a checked-in per-cell reference audio asset and not a lesson-source mutation.

## Summary

| Metric | Count |
| --- | ---: |
| Total linked cells | ${summary.total_cells} |
| Vocabulary Item links | ${summary.cells_by_type["Vocabulary Item"] ?? 0} |
| Dialogue Turn links | ${summary.cells_by_type["Dialogue Turn"] ?? 0} |
| Cache-addressable links | ${summary.link_status.cache_addressable ?? 0} |
| English target tuples | ${summary.english_target_tuples} |
| Vietnamese TTS cache tuples | ${summary.vietnamese_tts_cache_tuples} |
| Runtime-TTS-only source cells before link | ${summary.source_audio_status_before_link.runtime_tts_only ?? 0} |

## Amendments Folded In

${metadata.amendments.map((item) => `- ${item}`).join("\n")}

## INT State Preservation

| State | All cells | Dialogue cells |
| --- | ---: | ---: |
| covered | ${summary.int_probe_states.covered ?? 0} | ${summary.dialogue_int_probe_states.covered ?? 0} |
| blind | ${summary.int_probe_states.blind ?? 0} | ${summary.dialogue_int_probe_states.blind ?? 0} |
| unmeasured | ${summary.int_probe_states.unmeasured ?? 0} | ${summary.dialogue_int_probe_states.unmeasured ?? 0} |

## First 10 Links

| Cell UUID | Legacy address | Type | Tuple text | Hash |
| --- | --- | --- | --- | --- |
${samples}
`;
}

const artifact = buildAudioLink();
writeText(OUTPUT_JSON_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
writeText(OUTPUT_MD_PATH, renderMarkdown(artifact));

console.log(JSON.stringify({
  status: "ok",
  output_json: OUTPUT_JSON_PATH,
  output_markdown: OUTPUT_MD_PATH,
  total_cells: artifact.summary.total_cells,
  cache_addressable: artifact.summary.link_status.cache_addressable,
  english_target_tuples: artifact.summary.english_target_tuples,
  vietnamese_tts_cache_tuples: artifact.summary.vietnamese_tts_cache_tuples,
}, null, 2));
