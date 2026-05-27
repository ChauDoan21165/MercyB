# Phase-2 audit — `src/components/mercy-guide/MercySpeakTab.tsx`

**Surface:** the Speak tab inside `MercyGuidePanel` — pronunciation
practice with mic recording, scoring, and per-word/per-phoneme
breakdown. Where Vietnamese learners hear themselves and Mercy back
to back.

**Priority:** **HIGH** — paired with `AiTutor.tsx` as the
`mercy-guide/` top-priority surface in
`docs/copy/bilingual-audit.md` §281. Highest-VI-density single file
in the `mercy-guide/` directory.

**Scope:** every bilingual + VI-only chrome string. Cataloged 32
distinct surfaces (error messages, comparison errors, word/phoneme
breakdown chrome, listening pulse labels, diagnostic copy).

**Method:** verdict column per `docs/copy/bilingual-audit.md` §Method.
Adds an *ordering* column to flag the VI · EN vs EN · VI
inconsistency (see Cross-cutting observation #2).

**Conclusion:** **27/32 OK + 5 revision candidates** (3 awkward,
1 MT-feel, 1 EN-fallback-in-VI surface). Plus one cross-cutting
ordering inconsistency that Phase-2 should normalize.

---

## Catalog

### Recognition error messages (lines 422–438)

The mic-error envelope: every variant is an inline-bilingual single
string separated by ` / ` so the user gets both languages without a
layout split. The pattern is consistent and the VI halves are
well-crafted; this is one of the strongest error-message surfaces
in the codebase.

| Loc | VI | EN | Order | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 426 | `Cần quyền dùng micro. Mở quyền trong trình duyệt rồi thử lại.` | `Microphone access was blocked.` | VI / EN | **OK** — action-led VI ("Need mic permission. Open it in the browser then try again."); the EN passive ("was blocked") is by design — explains the state, doesn't blame the user. | — |
| 428 | `Chưa nghe thấy bạn. Nói to hơn hoặc gần micro hơn nhé.` | `We didn't hear you — speak louder or closer to the mic.` | VI / EN | **OK** — strong line. `Chưa nghe thấy bạn` is the kindness frame ("haven't heard you yet" — leaves room for the next try, not "we couldn't hear you"). The `nhé` particle warms the imperative. Exemplary error copy. | — |
| 430 | `Không tìm thấy micro.` | `No microphone found.` | VI / EN | **OK** — pithy, factual. | — |
| 432 | `Lỗi mạng. Thử lại.` | `Network problem. Please try again.` | VI / EN | **OK** — telegraphic VI matches the technical-error register. The VI's missing "please" is correct per `vi-style-guide.md` §3 ("Quý khách vui lòng" anti-pattern). | — |
| 434 | `Đã dừng.` | `Stopped.` | VI / EN | **OK** — past-aspect, concise. | — |
| 437–438 | `Lỗi nhận giọng nói${error?: ` + ${error}` : ""}.` | `Speech recognition failed${...}.` | VI / EN | **OK** — `nhận giọng nói` is a slight calque on "voice recognition" but it's now the standard VI tech term; natural. | — |

### Comparison panel errors (lines 1125–1185)

| Loc | VI | EN | Order | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 1125 | `Hãy thu âm trước` | `Record first` | VI · EN | **awkward** — `Hãy` imperative without softener. Per `vi-style-guide.md` §1 ("Imperatives without softener (Hãy làm…!) → soft imperative or invitation"). The EN `Record first` is itself a bare imperative, but VI's `Hãy` adds a school-teacher flavor the EN doesn't carry. | `Thu âm trước` (drop `Hãy`) or `Hãy thu âm trước nhé` (add `nhé`) |
| 1130 | `Chưa có ghi âm` | `No recording` | VI · EN | **OK** — `Chưa có` is the natural negative-existence form. | — |
| 1159 | `Mercy chưa sẵn sàng tạo giọng so sánh` | `Mercy reference unavailable` | VI · EN | **OK** with note — VI ("Mercy isn't ready to make the comparison voice") is verbose vs. the terse EN ("Mercy reference unavailable"). A tighter VI like `Mercy chưa có giọng so sánh` would match the EN's directness. Minor. | (optional) `Mercy chưa có giọng so sánh` |
| 1165 | `Không tải được giọng Mercy` | `Mercy audio fetch failed` | VI · EN | **OK** — `Không tải được` is the standard idiom. | — |
| 1172 | `Không phân tích được giọng Mercy` | `Mercy audio decode failed` | VI · EN | **OK** — pattern-match of 1165. | — |
| 1185 | `Có lỗi khi tạo giọng so sánh` | `Comparison failed` | VI · EN | **OK** — neutral, factual. | — |

### Per-word + per-phoneme breakdown chrome (lines 1646–1736)

| Loc | VI | EN | Order | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 1646 | `Chi tiết` | `Tap a word` | VI · EN | **OK** with note — the VI labels the surface ("Details") while the EN provides the touch affordance ("Tap a word"). Asymmetric: VI doesn't tell the user how to use the surface. Acceptable as a design choice — VI heading, EN affordance — but a Phase-2 author could align them either way. | (optional) `Chạm vào từ · Tap a word` (mirror) |
| 1682 | `Đóng` | `Close` | VI · EN | **OK** — standard. | — |
| 1715 (aria-label template) | `Phát âm /${phoneme}/` | `Play /${phoneme}/` | VI · EN | **OK** — aria-label only; both halves audible to screen readers. | — |
| 1726 | `Âm /{phoneme}/ giống trong từ` | — (VI-only fragment heading) | VI-only | **OK** — sentence fragment that leads into a word list. Natural fragment usage in VI. | — |
| 1736 (aria-label template) | `Phát âm "${word}"` | `Play "${word}"` | VI · EN | **OK** — pattern-match of 1715. | — |

### Mobile audio retest section (lines 1769, 1820–1828)

| Loc | VI | EN | Order | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 1769 | `Kiểm tra âm thanh mobile` | `Mobile audio retest` | **EN · VI** | **MT-feel** — `mobile` is left untranslated in the VI, creating a half-translated string (`vi-style-guide.md` §3 anti-pattern "Half-translated UI elements"). Also reverses the VI-primary ordering used elsewhere in the file. | `Kiểm tra lại âm thanh trên di động` (full VI) or `Kiểm tra lại âm thanh điện thoại` |
| 1825 | `Đã sao chép chẩn đoán ẩn danh` | `Copied anonymized diagnostics` | **EN · VI** | **OK** copy / **flagged** ordering — `Đã sao chép chẩn đoán ẩn danh` is natural; `chẩn đoán` ("diagnosis") is medical-tinged but acceptable in tech context. The EN-first ordering is the cross-cutting issue. | (ordering) flip to VI · EN |
| 1827 | `Không sao chép được chẩn đoán. Hãy thử lại.` | `Diagnostics copy failed. Please try again.` | **EN · VI** | **awkward** copy + **flagged** ordering — `Hãy thử lại` repeats the bare-imperative `Hãy` anti-pattern from line 1125. VI repeats the noun ("chẩn đoán") which the EN drops via ellipsis. | `Không sao chép được. Thử lại nhé.` (drop the noun repetition + add `nhé`) |
| 1828 | `Ẩn danh, chỉ 5 sự kiện gần nhất` | `Anonymized, last 5 events only` | **EN · VI** | **OK** copy / **flagged** ordering — natural VI fragment. | (ordering) flip to VI · EN |

### Listening / recording pulse + actions (lines 1976–2256)

| Loc | VI | EN | Order | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 1976 | `Đang nghe... / Listening` (when active) or `You` (fallback) | (inline) | VI / EN active; **`You` fallback is English-only** | **awkward** — the active-listening label is bilingual + on-voice, but the fallback "You" is English-only. A Vietnamese learner sees `You` as the speaker label outside the listening window — register mismatch. | Fallback should be `Bạn` (VI-only) or `Bạn · You` (bilingual). The active label `Đang nghe... / Listening` is fine. |
| 2006 | `Lặp lại` | `Repeat` | VI · EN | **OK** — standard. | — |
| 2103 | `Đang nghe` | `Listening` | VI / EN | **OK** — pulse-pill label, no ellipsis (the ellipsis is on the 1976 conversational header — the pill is a status badge, terse is right). | — |
| 2206 | `So sánh với Mercy` | — (VI-only heading) | VI-only | **OK** — natural heading, "Compare with Mercy". `vi-style-guide.md` §2 permits VI-only on Mercy-conversational surfaces. | — |
| 2212 | `Mở · Open ▾` | (inline) | VI · EN | **OK** — standard expand-toggle. | — |
| 2230 | `Đóng · Close` | (inline) | VI · EN | **OK** — pattern-match of 1682. Duplicate copy is fine — separate UI sites. | — |
| 2256 | `Lặp lại · Repeat` | (inline) | VI · EN | **OK** — pattern-match of 2006. | — |

---

## Cross-cutting observations

1. **The recognition-error envelope (lines 422–438) is the strongest
   error-message surface in the codebase audited so far.** Six
   strings, all on-voice, kindness-framed (`Chưa nghe thấy bạn`,
   `nhé` particle), action-led. Worth promoting to
   `vi-style-guide.md` §6 exemplars when this MR lands.

2. **Ordering inconsistency: VI · EN vs EN · VI.** The file uses
   `VI · EN` (and `VI / EN` for error messages) almost everywhere,
   *except* for four strings in the mobile-diagnostics surface
   (lines 1769, 1825, 1827, 1828) which flip to `EN · VI`. Per
   `vi-style-guide.md` §2, VI must visually dominate. The four
   reversed entries should flip to `VI · EN`. This is the single
   most consequential Phase-2 revision in this file — a one-time
   edit that re-establishes the VI-primary contract on the only
   surface where it currently breaks.

3. **The `Hãy` bare imperative appears twice (lines 1125, 1827).**
   Per `vi-style-guide.md` §1, this is an anti-pattern. Drop or add
   a softener (`nhé`). Both can be fixed in passing during the
   ordering normalization.

4. **One English-only fallback in a Vietnamese-primary surface**
   (line 1976, the `"You"` fallback speaker label). Easiest fix in
   the file — change the literal to `Bạn` or `Bạn · You`.

5. **No shame triggers.** No "kém", "tệ", "sai" framing; no
   countdown patterns; no comparison shaming. The pronunciation-
   score display (per-word score 0–100) sits outside this string
   audit's scope but should be verified against
   `docs/voice-guidelines-vn.md` in a follow-up.

6. **No MT-feel patterns beyond the single `mobile` calque** on
   line 1769. The file reads as if a Vietnamese-native author
   wrote it (which is the C8 audit's bar).

## References

- `docs/copy/bilingual-audit.md` §281 (mercy-guide/ top priority).
- `docs/copy/vi-style-guide.md` §1 (Mercy voice anti-patterns),
  §2 (bilingual pairing — VI must dominate), §3 (MT tells).
- `src/components/mercy-guide/MercyGuidePanel.tsx` — the parent
  panel; sampled in the C8 audit at 2 VI lines, no revisions needed.
