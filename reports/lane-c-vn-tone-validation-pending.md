# Lane C — EN→VN Vietnamese tone-contrast set: pending native validation

**Status: CHAU-VALIDATED (2026-06-05). NOT WIRED.** 14 pairs KEEP as-is;
2 replaced on Chau's call — `di/dí` → `la/lá` (above), `bà/bả` → `bò/bỏ`
(below, listen-compare only). Audio TTS step still pending.

This is a content-only handoff for the EN→VN Vietnamese tone-contrast /
listen-compare drill extension (`src/data/tone-drill/tone-contrast-extra.ts`).

Read this before anything ships:

- **Nothing here is wired into the live scorer.** `tone-contrast-extra.ts`
  is not imported by `scoreTone.ts` or any scorer / threshold file. No
  threshold logic was touched.
- **Every sample awaits Chau's native validation.** Each pair carries
  `needsChauValidation: true`. Assume NOTHING is native-clean until you
  sign off — confirm the word is real, the meaning is right, and the
  contour is natural (Northern voice).
- **hỏi/ngã remain abstained.** Pairs touching `hỏi` or `ngã` are
  `trustFloor: 'below'` + `listenCompareOnly: true`. They are
  listen-compare content only — the learner hears them, no confident
  pass/fail verdict. Southern dialect merges hỏi/ngã, so a WRONG tone
  correction here would break the trust floor. Do not promote them.
- **Audio binaries are not committed.** The TTS step (Azure vi-VN) is
  run by Chau later; this set only enumerates the syllables.
- **Trust floor is sacred:** a wrong tone correction is worse than none.
  If any word below is not certain to be real with that tone + meaning,
  drop it — do not guess.

For each syllable, "what Chau must confirm" = (1) it is a real Vietnamese
word with that tone, (2) the listed meaning is correct, (3) the Azure
vi-VN contour will sound natural to a native ear (Northern reference).

---

## ABOVE floor — ngang / sắc / huyền / nặng (scorable later, after sign-off)

| syllable | tone  | meaning (VN)              | meaning (EN)                  | trust floor | listen-compare-only | what Chau must confirm |
|----------|-------|---------------------------|-------------------------------|-------------|---------------------|------------------------|
| xe       | ngang | xe máy                    | vehicle                       | above       | no                  | nghĩa + contour |
| xé       | sắc   | xé giấy                   | to tear                       | above       | no                  | nghĩa + contour |
| an       | ngang | bình an                   | peace / safety                | above       | no                  | nghĩa + contour |
| án       | sắc   | bản án                    | sentence / verdict            | above       | no                  | nghĩa + contour |
| que      | ngang | que tăm                   | stick                         | above       | no                  | nghĩa + contour |
| quê      | huyền | quê hương                 | hometown                      | above       | no                  | nghĩa + contour |
| co       | ngang | co lại                    | to contract / shrink          | above       | no                  | nghĩa + contour |
| cò       | huyền | con cò / cò súng          | stork / trigger               | above       | no                  | nghĩa + contour |
| la       | ngang | la hét                    | to shout / yell               | above       | no                  | Chau KEEP (thay di/dí) |
| lá       | sắc   | chiếc lá                  | leaf                          | above       | no                  | Chau KEEP (thay di/dí) |
| tra      | ngang | tra từ điển               | to look up / insert           | above       | no                  | nghĩa + contour |
| trà      | huyền | uống trà                  | tea                           | above       | no                  | nghĩa + contour |
| giá      | sắc   | giá tiền / giá đỗ         | price / bean sprout           | above       | no                  | cặp tối thiểu thật? |
| già      | huyền | người già                 | old (elderly)                 | above       | no                  | nghĩa + contour |
| hoa      | ngang | bông hoa                  | flower                        | above       | no                  | nghĩa + contour |
| hóa      | sắc   | biến hóa                  | to transform / -ize           | above       | no                  | nghĩa + contour |
| ngon     | ngang | ăn ngon                   | tasty / delicious             | above       | no                  | nghĩa + contour |
| ngọn     | nặng  | ngọn cây / ngọn núi       | treetop / classifier          | above       | no                  | nghĩa + contour |
| tá       | sắc   | một tá (= 12)             | a dozen                       | above       | no                  | nghĩa + contour |
| tà       | huyền | tà ác / tà áo             | evil / slanting               | above       | no                  | nghĩa + contour |
| lo       | ngang | lo lắng                   | to worry                      | above       | no                  | nghĩa + contour |
| lọ       | nặng  | cái lọ                    | jar / bottle                  | above       | no                  | nghĩa + contour |
| thu      | ngang | mùa thu / thu tiền        | autumn / to collect           | above       | no                  | nghĩa + contour |
| thú      | sắc   | thú vật / thú vị          | animal / pleasure             | above       | no                  | nghĩa + contour |

## BELOW floor — hỏi / ngã (ABSTAINED, listen-compare only)

| syllable | tone  | meaning (VN)              | meaning (EN)                  | trust floor | listen-compare-only | what Chau must confirm |
|----------|-------|---------------------------|-------------------------------|-------------|---------------------|------------------------|
| cua      | ngang | con cua                   | crab                          | below       | yes                 | nghĩa; KHÔNG chấm điểm |
| của      | hỏi   | sở hữu                    | of / belonging to             | below       | yes                 | nghĩa; hỏi luôn abstained |
| ve       | ngang | con ve                    | cicada                        | below       | yes                 | nghĩa; KHÔNG chấm điểm |
| vẽ       | ngã   | vẽ tranh                  | to draw                       | below       | yes                 | nghĩa; ngã luôn abstained |
| bò       | huyền | con bò                    | cow                           | below       | yes                 | Chau KEEP (thay bà/bả); KHÔNG chấm điểm |
| bỏ       | hỏi   | bỏ đi                     | to drop / leave / give up     | below       | yes                 | Chau KEEP (thay bà/bả); hỏi abstained |
| củ       | hỏi   | củ khoai                  | root / tuber                  | below       | yes                 | **cặp hỏi/ngã thuần — giọng Nam gộp; KHÔNG chấm điểm** |
| cũ       | ngã   | đồ cũ                     | old (used)                    | below       | yes                 | **cặp hỏi/ngã thuần — giọng Nam gộp; KHÔNG chấm điểm** |

---

### Below-floor pairs (the abstained set, for quick scan)

- `cua-ngang-vs-hoi` — cua (ngang) vs của (hỏi)
- `ve-ngang-vs-ngax` — ve (ngang) vs vẽ (ngã)
- `bo-huyen-vs-hoi` — bò (huyền) vs bỏ (hỏi)
- `hoi-vs-nga-cua-cux` — củ (hỏi) vs cũ (ngã) — pure hỏi/ngã, Southern-merged

### Reviewer checklist

- [ ] Confirm meanings + that Northern Azure vi-VN renders each contour
      naturally.
- [ ] Confirm the below-floor pairs stay listen-compare only (never
      promoted to scored drills, scorer thresholds untouched).
- [ ] After sign-off: run the TTS step (Azure vi-VN) over
      `TONE_CONTRAST_EXTRA_SYLLABLES` and commit the audio binaries.
