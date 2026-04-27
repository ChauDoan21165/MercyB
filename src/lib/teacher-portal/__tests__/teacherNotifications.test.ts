// Sanity tests for the teacher-notifications edge function source.
//
// We can't easily run the Deno-only edge function in vitest, so we
// parse the function source as text and assert the contracts the spec
// requires:
//   - Three actions are routed (feedback_submitted, revision_requested,
//     content_updated).
//   - Vietnamese subjects include the content_id + content_type.
//   - From-address is admin@mercyblade.com per project_sending_address.
//
// This is a textual contract test, not a runtime test. It catches the
// most common drifts: missing action branch, English-only subject, or
// the wrong sender.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { describe, expect, it } from "vitest";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const fnSrcPath = path.resolve(
  here,
  "../../../../supabase/functions/teacher-notifications/index.ts",
);

function readSource(): string {
  return fs.readFileSync(fnSrcPath, "utf8");
}

describe("teacher-notifications edge function", () => {
  it("routes all three required actions", () => {
    const src = readSource();
    expect(src).toMatch(/case "feedback_submitted"/);
    expect(src).toMatch(/case "revision_requested"/);
    expect(src).toMatch(/case "content_updated"/);
  });

  it("uses admin@mercyblade.com as the from-address (project_sending_address rule)", () => {
    const src = readSource();
    expect(src).toMatch(/admin@mercyblade\.com/);
    expect(src).not.toMatch(/from:.*hello@mercyblade\.com/i);
  });

  it("builds a Vietnamese subject for feedback_submitted that contains content_type and content_id", () => {
    const src = readSource();
    // Subject builder must interpolate both fields.
    const block =
      src.match(/buildSubjectFeedbackSubmitted[\s\S]*?return\s+`([^`]*?)`/m)?.[1] ?? "";
    expect(block).toMatch(/Có phản hồi mới từ giáo viên/);
    expect(block).toMatch(/\$\{payload\.content_type\}/);
    expect(block).toMatch(/\$\{payload\.content_id\}/);
  });

  it("requires admin level >= 5 for any action", () => {
    const src = readSource();
    expect(src).toMatch(/Admin level 5\+ required/);
  });

  it("requires reviewer_id for revision_requested and content_updated", () => {
    const src = readSource();
    expect(src).toMatch(/reviewer_id required for revision_requested/);
    expect(src).toMatch(/reviewer_id required for content_updated/);
  });

  it("uses Vietnamese-primary copy in all email bodies", () => {
    const src = readSource();
    // Each body builder should start with "Chào …"
    expect(src).toMatch(/buildBodyFeedbackSubmitted[\s\S]*?Chào quản trị viên/);
    expect(src).toMatch(/buildBodyRevisionRequested[\s\S]*?Chào giáo viên/);
    expect(src).toMatch(/buildBodyContentUpdated[\s\S]*?Chào giáo viên/);
  });
});
