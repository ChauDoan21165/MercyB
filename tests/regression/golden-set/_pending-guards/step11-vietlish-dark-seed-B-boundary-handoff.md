# Step 11 → Lane B: false-positive boundary handoff

**Candidate:** `step11-vietlish-dark-seed` · **Author:** A3 (Lane A) · **Status:** dark seed, flag-gated (`step11-vietlish-dark-seed` / `VITE_VIETLISH_DARK_SEED`, default OFF), **not wired** to any learner path.

**What B is receiving:** an awkward-Vietlish DARK detector — grammatically valid English that reads non-native from VN transfer. It emits Sentry `info` beacons only; **no learner-facing output, no correction**. B's job is to validate these false-positive boundaries against real traffic before anything is promoted to a learner-facing rule.

**Why dark:** these patterns sit *past* the correction engine (every positive is left `unchanged` by `correctWithTutorRules`) and *outside* the code-switch detector (`vinglish-detector.ts` — these are all-English, no VN tokens). We have no production FP rate for them yet. The flag-gated beacon collects that rate.

## Per-pattern FP boundary (what MUST keep abstaining)

| Pattern | Confidence | Fires on | MUST NOT fire on (FP boundary) |
|---|---|---|---|
| `vietlish-opinion-calque` | 0.80 | first-person `according to me/us` | third-party/source: `according to him/her/them/the report/the data/the law/scientists` |
| `vietlish-resumptive-topic` | 0.50 | sentence-initial bare-NP topic + `, it/they/he/she + be/aux` | non-restrictive appositive/relative (`My brother, who lives in Hue, is…`; `Hanoi, the capital, is…`); any pre-comma chunk containing a verb |
| `vietlish-play-device` | 0.70 | `play + {phone, facebook, computer, internet, tiktok, zalo, youtube, laptop, ipad}` | real `play` objects: piano/guitar/football/soccer/a game/cards/chess/music/a song/a video |
| `vietlish-too-as-praise` | 0.35 | `too + {delicious, beautiful, good, cute, nice, interesting, amazing, wonderful, handsome, lovely, tasty, fun, funny, gorgeous, awesome}` with NO `to <verb>`/`for <obj>` complement | genuine excess (`too hot to drink`, `too good to be true`, `too expensive for me`); ambivalent adjectives (sweet/spicy/hot/expensive/big) are excluded by whitelist |
| `vietlish-wish-you-greeting` | 0.65 | sentence-initial subjectless `Wish you <NP/adj>` | with subject (`I/We wish you…`); counterfactual ellipsis (`Wish you were/had/would/could…`) |

## Known residual-FP risks B should watch in the wild
1. **`too-as-praise` (highest):** `too nice`/`too good` can carry a real excess reading without a `to/for` complement (`He is too nice` = a mild criticism). Expect the noisiest beacon stream here — confidence is set to 0.35 deliberately. Recommend B gate any promotion on this pattern's measured FP rate specifically.
2. **`resumptive-topic`:** casual left-dislocation (`That guy, he never replies`) is idiomatic in informal native English — it will beacon. Acceptable as dark signal; NOT promotable to a correction without a register check.
3. **`play-device`:** `play tiktok/youtube` can rarely be a real "play a TikTok/a YouTube video" command. Low volume; flagged for completeness.
4. **`opinion-calque`:** clean; lowest residual risk.
5. **`wish-you-greeting`:** card/holiday copy ("Wish you a merry Christmas" without an explicit subject in marketing slogans) may beacon. Low volume.

## What is intentionally NOT in scope (owned elsewhere / out of bounds)
- `although … but` / `even though … but` doubling → live worktree `a1/although-even-though-but`.
- `because … so` doubling → live worktree `a1/because-so-doubling`.
- existential `have` (`In my city has many…`) → live worktree `lane-a/existential-have-there-is-are`.
- `very like` → `lane-a/vietlish-very-like` (MR !381).
- Anything the correction engine already fixes (calque open/close appliance, copula-be-drop, articles, plurals, etc.).

## Integration note for promotion (later, not now)
- The flag is read self-contained in `vietlish-dark-detector.ts` (no `FEATURE_FLAGS` edit, no gate machinery touched). Promotion should register `VIETLISH_DARK_SEED` in `src/lib/featureFlags.ts` and wire `runVietlishDarkSeed` into a deduped, non-hot call site (the sink does not dedupe).
- `runVietlishDarkSeed` accepts an injectable `emit` and `enabled` for testing; default `emit` lazily loads `captureMessage` (no static Sentry dependency).
