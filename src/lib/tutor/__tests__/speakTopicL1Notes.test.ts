import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";

// Quality guard for Vietnamese→English L1-interference notes across the speak-topic
// library. l1InterferenceNotes is an OPTIONAL field, so these tests assert INVARIANTS
// on whatever notes exist (well-formed, unique ids per topic, follow-up ids unique) —
// they do not require every topic to carry notes. This locks in the L1 content quality
// added in the overnight deepening pass and guards against empty / duplicate-id regressions.

const topicsWithNotes = SPEAK_TOPIC_LIBRARY.filter(
  (topic) => (topic.l1InterferenceNotes?.length ?? 0) > 0,
);

describe("speak-topic L1-interference notes — quality invariants", () => {
  it("has at least one topic carrying L1 notes (sanity)", () => {
    expect(topicsWithNotes.length).toBeGreaterThan(0);
  });

  it("every L1 note is well-formed (non-empty id, label, and a substantive note)", () => {
    for (const topic of topicsWithNotes) {
      for (const note of topic.l1InterferenceNotes ?? []) {
        expect(note.id.trim().length, `${topic.id} note id`).toBeGreaterThan(0);
        expect(note.label.trim().length, `${topic.id} note label`).toBeGreaterThan(0);
        // A real interference note, not a stub.
        expect(note.note.trim().length, `${topic.id} note body`).toBeGreaterThan(20);
      }
    }
  });

  it("keeps L1 note ids unique within each topic", () => {
    for (const topic of topicsWithNotes) {
      const ids = (topic.l1InterferenceNotes ?? []).map((note) => note.id);
      expect(new Set(ids).size, `${topic.id} duplicate L1 note ids`).toBe(ids.length);
    }
  });

  it("keeps follow-up ids unique within each topic", () => {
    for (const topic of SPEAK_TOPIC_LIBRARY) {
      const ids = topic.followUps.map((followUp) => followUp.id);
      expect(new Set(ids).size, `${topic.id} duplicate follow-up ids`).toBe(ids.length);
    }
  });

  // NOTE: a library-wide topic-id uniqueness assertion is intentionally NOT included
  // here. There is a pre-existing duplicate (`topic-banking-bills` is defined both
  // inline in SPEAK_TOPIC_LIBRARY and in an auto-registered module), reported separately
  // for the content owner. This file's scope is L1-note quality, not that dedup fix.
});
