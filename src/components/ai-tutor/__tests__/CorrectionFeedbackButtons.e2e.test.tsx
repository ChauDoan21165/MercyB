// End-to-end (client pipeline) test for Lane A correction-feedback capture.
//
// Drives the WHOLE client data path with NO mocks on the producer or the sink:
//   button tap
//     → recordLearningEvent (real, writes the localStorage queue)
//     → peekPendingEvents / ackEvents (real drain API)
//     → createLearningEventSink.flush (real batching + row mapping)
//     → insertRows (the ONLY seam — a spy standing in for the Supabase
//       `learning_events` insert)
//
// It asserts the row that reaches the sink's insert boundary is a
// `feedback_helpful` row whose `rule_or_detector_id` is populated with the id
// the correction carried. Real-DB confirmation (a row visible in prod after a
// canary tap) is the manual verification step in the MR report; this test
// proves the pipeline delivers the id end-to-end and is CI-deterministic.

import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import CorrectionFeedbackButtons from "../CorrectionFeedbackButtons";
import { clearLearningEvents } from "@/lib/tutor/learningEvents";
import {
  createLearningEventSink,
  type InsertResult,
  type LearningEventRow,
} from "@/lib/learning/eventSink";

const RULE_ID = "en_l1_register_formal_opener_peer_ban";

beforeEach(() => {
  cleanup();
  clearLearningEvents();
  window.localStorage.clear();
});
afterEach(() => cleanup());

describe("Lane A feedback capture — reaches the sink with the id populated", () => {
  it("delivers a feedback_helpful row carrying rule_or_detector_id through the real drain", async () => {
    const inserted: LearningEventRow[] = [];
    const insertRows = async (rows: LearningEventRow[]): Promise<InsertResult> => {
      inserted.push(...rows);
      return { error: null };
    };

    // Real producer default (recordLearningEvent) — no `record` override.
    render(<CorrectionFeedbackButtons ruleOrDetectorId={RULE_ID} targetLanguage="en" />);

    fireEvent.click(screen.getByTestId("correction-feedback-helpful"));

    // Real sink over the real localStorage-backed drain API. enabled:true so it
    // does not short-circuit on the (test-env) feature flag; getUserId supplies
    // the RLS user the row is written as.
    const sink = createLearningEventSink({
      enabled: true,
      insertRows,
      getUserId: async () => "user-e2e",
      appVersion: "test",
    });

    const outcome = await sink.flush();

    expect(outcome.flushed).toBe(1);
    expect(inserted).toHaveLength(1);
    const row = inserted[0];
    expect(row.event_type).toBe("feedback_helpful");
    // The non-optional contract: the id is present and correct.
    expect(row.rule_or_detector_id).toBe(RULE_ID);
    expect(row.rule_or_detector_id).toBeTruthy();
    expect(row.user_id).toBe("user-e2e");
    // Session address is carried exactly as every existing event carries it.
    expect(row.session_id).toBeTruthy();
    // The DB CHECK (feedback_% ⇒ rule_or_detector_id not null) would reject a
    // null id; assert we never hand it one.
    expect(row.rule_or_detector_id).not.toBeNull();
  });

  it("does not queue any event when the correction has no id (no buttons, nothing to drain)", async () => {
    const inserted: LearningEventRow[] = [];
    render(<CorrectionFeedbackButtons ruleOrDetectorId={null} targetLanguage="en" />);

    // No buttons exist to tap.
    expect(screen.queryByTestId("correction-feedback")).toBeNull();

    const sink = createLearningEventSink({
      enabled: true,
      insertRows: async (rows) => {
        inserted.push(...rows);
        return { error: null };
      },
      getUserId: async () => "user-e2e",
    });

    const outcome = await sink.flush();
    expect(outcome.flushed).toBe(0);
    expect(inserted).toHaveLength(0);
  });
});
