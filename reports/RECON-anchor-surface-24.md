# RECON — Anchor-Surfacing of the "24 VI-Gloss-Only" Rooms

**Agent:** anchor-surfacing-agent · **Branch:** `anchor-surface-24` off fresh `origin/main` @ `73f804b9`
**Date:** 2026-05-17 · **Scope:** Phase 1 RECON ONLY — zero room files modified, no PR.
**Inputs read:** `STRATEGY.md` (§5.6/§11), `PRINCIPLES.md` (#5/#7), `reports/RECON-cultural-retrofit.md`
(branch `cultural-retrofit-recon` @ `68855a29`), exemplar `resilience_and_adaptation_vip4`.

---

## TL;DR — the 24-room list does not survive verification

The brief assumes `RECON-cultural-retrofit.md` contains a 24-room list of rooms where a Vietnamese
cultural anchor lives only in the VI gloss. **It does not.** The recon never enumerated the 24, gave
one worked example, and that example is factually wrong. I reconstructed the scan from the recon's
documented methodology (EN-surface vs VI-gloss split, case-insensitive regex). Result:

- **The entire 471-room corpus contains only 10 rooms with *any* place/food/culture VI anchor.**
- **7 of those already surface the anchor in the English** the learner rehearses → no work needed.
  (One of the 7 is the gold-standard `resilience_and_adaptation_vip4` — the detector correctly
  classifies it as already-surfaced, which validates the detector against the recon's own exemplar.)
- **3 are `bánh mì` false positives** — `bánh mì` is simply the ordinary Vietnamese word for
  "bread," used as a 1:1 generic translation, not a cultural anchor. One of these three is the
  recon's *own acknowledged* false positive (`scipio_africanus_vip9_vol2`, "sống bằng bánh mì" =
  the biblical "live by bread alone" idiom — recon §2 row 18).
- **Net valid surfacing targets: 0.**

This is not a tooling gap. It is consistent with the recon's **own body evidence**, which the "24"
headline contradicts:

> §2 readout #1: *"zero Western defaults AND **near-zero Vietnamese anchors**."*
> §TLDR: *"**0 rooms** with phở, Honda Wave, xe máy, VinFast."*
> §4 size estimate: Phase A1 budgeted at *"~6 agent-hours"* — i.e. trivially small, consistent
> with a handful of rooms, not a substantive 24-room batch.

The "24" is an artifact of an unpreserved, over-loose regex. My widened sweep reproduces exactly how
it happens (§3 below): broaden the net even slightly and it sweeps common Vietnamese **function
words** (`quê hương` = homeland, `xa xôi` = distant, `chùa` = temple, names like `thành`/`tâm`/
`hùng`/`như`) out of the VI gloss of *placeless* history/strategy/CBT rooms — correct translations
of neutral English, not "anchors missing from the English."

**Recommendation: do not proceed to Phase 2. There is nothing to surface.** Per Principle #7
(honest uncertainty over false confidence) and the brief's explicit guard ("surface fit is worse
than neutral"), forcing `bánh mì`/name insertions to hit a number would manufacture the exact
tourist-brochure regression the brief forbids.

---

## 1. Method (reconstructed from recon §1, since the list was not preserved)

The recon branch "holds only this report" (its closing line) — no 24-room list, CSV, or appendix
exists. The recon's single illustrative example, `english_b1_b112`, claims *"EN reads generic 'I
visited my friend' while the VI gloss reads 'Tôi đã đi Đà Nẵng…'"*. On inspection, **`b112`
entry 1 EN already reads "I went to Da Nang"** — the anchor *is* on the English surface. The one
worked example does not hold up, so the list had to be rebuilt, not retrieved.

Scan (`/private/tmp/anchor_scan.py`, run in this worktree, not committed):

1. For each of 471 room JSON (`registry.json`, `guide_articles_en_vi.json` excluded, per recon §1):
   concatenate all `copy.en` + `title.en` → EN; all `copy.vi` + `title.vi` → VI.
2. **Unicode-normalize both to NFC** before matching. *(Load-bearing: the corpus mixes NFC and NFD
   encodings — `phở` raw-greps to 0 files in NFC yet exists; a naïve `\b` regex silently fails after
   a decomposed diacritic because a combining mark is a non-word char. Fixing this was required to
   get any trustworthy count at all — a concrete instance of Principle #5: diagnose before patching.)*
3. A room is **VI-gloss-only** iff VI contains ≥1 specific anchor (city / food / culture proper
   noun, word-boundary matched) **and** EN contains *none* of a deliberately broad suppressor set
   (`vietnam`, `vietnamese`, every city, `pho`, `banh mi`, `ao dai`, `tet`, `motorbike`, `honda`,
   …). Broad suppressor = conservative: **under-report, never over-report** (Principle #7).
4. Lexicon scoped to the recon's own anchor definition (§2: "place / name / food / test") and
   STRATEGY §5.6/§11 (phở, Honda Wave, áo dài, nón lá, xe máy, VinFast, Tết, lì xì, place names…).
   Currency (`đồng`) and `Grab` dropped: `đồng` matches `cộng đồng`/`đồng ý`/`đồng hành` etc.
   (caught it over-firing to 198 rooms in v1); `Grab` is a global brand.

---

## 2. The complete anchor landscape (all 10 rooms with any VI anchor)

| Room | VI anchor(s) | EN already surfaces? | Verdict |
|---|---|---|---|
| `resilience_and_adaptation_vip4` | Hà Nội / Sài Gòn | **yes** (hanoi, saigon) | already-anchored — recon's gold exemplar ✓ |
| `mentors_who_light_the_way_vip4` | Hà Nội / Sài Gòn | **yes** (hanoi, saigon, vietnam) | already-anchored (recon §2 row 11) |
| `world_cultures_kids_l2` | bánh mì / áo dài / Tết / lì xì | **yes** (lunar new year, lucky money) | already-anchored (recon §2 row 23) |
| `geography_basics_kids_l2` | Hà Nội / Hồ Chí Minh | **yes** (hanoi, ho chi minh, vietnam) | already-anchored |
| `national_megatrends_vip9` | Hồ Chí Minh | **yes** (ho chi minh, vietnam) | already-anchored |
| `english_b1_b102` | Đà Lạt | **yes** (da lat) | already-anchored |
| `english_b1_b112` | Đà Nẵng | **yes** (da nang) | already-anchored — *the recon's own example, refuted* |
| `english_a2_a212` | "bánh mì" | no | **false positive** — see §2.1 |
| `survival_resilience_vip1_srs02` | "bánh mì" | no | **false positive** — see §2.1 |
| `scipio_africanus_vip9_vol2` | "bánh mì" | no | **false positive** — recon's *own* §2 row 18 |

7 already-surfaced (no work). 3 false positives. **0 valid VI-gloss-only targets.**

### 2.1 Why the 3 `bánh mì` hits are false positives, not surfacing targets

`bánh mì` is the **standard, only** Vietnamese word for generic "bread." In all three rooms it is a
plain 1:1 translation of the English word "bread," not a Vietnamese cultural anchor that exists
"only in the VI gloss":

- **`english_a2_a212`** e[1] `story-at-the-market`
  EN: *"Nam walks to the market near his home. He buys fruit, vegetables, and **bread**."*
  VI: *"Nam đi bộ ra chợ gần nhà. Anh mua trái cây, rau và **bánh mì**."*
  → "bánh mì" here = "bread". Surfacing it ("…fruit, vegetables, and bánh mì") would inject a
  foreign word where plain "bread" is the correct, neutral meaning — the precise tourist-brochure
  failure the brief and recon §7 forbid. *(Note: this room is in fact already well-anchored — every
  entry uses Vietnamese given names Linh/Nam/Mai/Tuấn/Lan/Huy in **both** EN and VI.)*

- **`survival_resilience_vip1_srs02`** e[1]
  EN: *"Avoid fragile items like **bread** or foods with short expiration."*
  VI: *"Tránh **bánh mì** hoặc thực phẩm dễ hỏng."*
  → identical: generic "bread", emergency-kit context, no cultural anchor.

- **`scipio_africanus_vip9_vol2`** — recon §2 row 18 already documents this exact one:
  *"sống bằng bánh mì"* = the idiom "live by bread alone." Not an anchor.

All three are the same lexical family. None is a "Vietnamese cultural anchor present only in the VI
gloss." There is no English-side change to draft, because there is no anchor to surface.

---

## 3. Reproducing the recon's error — how a loose regex manufactures "24"

To confirm the "24" is a methodology artifact (not a real cohort I'm missing), I ran a deliberately
widened sweep (`/private/tmp/anchor_wide.py`): added `quê hương`/`quê nhà` (homeland), `xôi`,
`chùa`, `miền bắc/trung/nam`, and a curated Vietnamese-given-name probe.

- **Widened tokens → 24 "candidates"** — and they are all noise:
  `xôi` matched **`xa xôi`** ("distant/remote": *"triều đình xa xôi"*, *"thị trường xa xôi"*,
  *"ngọn núi xa xôi"*) in Cyrus / Genghis Khan / *meaning_of_life* — a pure substring artifact.
  `quê hương`/`quê nhà` ("homeland") and `chùa` ("temple") matched the VI glosses of
  Clausewitz / Hannibal / Napoleon / Tokugawa — correct translations of neutral English
  ("homeland", "temple"), not Vietnamese anchors. *That this widened net lands on exactly ~24
  is how the original "24" was produced.*
- **Name probe → 69 "candidates"**, dominated by `thành` (city/become/succeed), `tâm`
  (heart/center), `hùng` (heroic), `như` (like/as), `đạt` (achieve), `nghĩa` (meaning) — common
  Vietnamese **content words**, not names in context (`make_believe_kids_l1` / `opposites_matching
  _kids_l1` matched "thành" = the verb "become"). Vietnamese given names are not machine-separable
  from ordinary vocabulary without a curated allowlist — exactly the §7 "AI produces surface, not
  lived" risk the recon flagged. This is **not** an agent-automatable surface.

This is the recon's own §1 caveat realized: *"Anchor density depends entirely on threshold."* The
"24" is one specific threshold's noise floor, not a real defect cohort.

---

## 4. Verdict & recommendation (Chau decides)

**Phase 2 should not run.** There are zero rooms where a Vietnamese cultural anchor exists only in
the VI gloss. Surfacing work has no valid target. Specifically:

1. **Nothing to ship.** 7 anchored rooms already surface the anchor in EN; 3 hits are
   "bánh mì"=bread / "xa xôi"=distant artifacts. Editing any of them would *introduce* the
   tourist-brochure regression, not fix one.
2. **The recon's Phase A1 premise is void**, but its strategic core is unaffected: §2 readout #1
   ("near-zero Vietnamese anchors") and §3/§5 (the real lever is *additive authoring* of VN
   context into placeless CEFR/life-skill rooms) still stand. That is **out of this brief's scope**
   — the brief explicitly forbids adding new anchors ("only surface existing VI-side anchors";
   "substitutive work is out of scope"). The corpus is placeless, so there is nothing to surface
   and (by this brief's rules) nothing this agent may add.
3. **If cultural anchoring is still wanted**, the path is the recon §7 sequence — Chau-approved
   anchor lexicon + 5-room calibration pilot + native-review gate, applied as *additive authoring*
   under a **new, explicitly-scoped brief** — not a "surface the existing 24" task, because the 24
   do not exist.

No `TODO: native review` markers were placed in any room file, because **no room file was
touched** — there was no defensible edit to make. Marking nonexistent anchors would itself be the
false-confidence output Principle #7 prohibits.

---

## 5. Artifacts

- Scanners (kept outside the repo, not committed): `/private/tmp/anchor_scan.py`,
  `/private/tmp/anchor_diag.py`, `/private/tmp/anchor_wide.py`, `/private/tmp/_anchors.py`.
- This report: `reports/RECON-anchor-surface-24.md` (unique filename per recon-filename rule).
- Worktree `/private/tmp/MercyB-anchor-surface-24`, branch `anchor-surface-24` @ `73f804b9`.

*RECON complete. No room files modified. No PR opened. Phase 2 not entered (no valid target).
Stopping per brief for Chau's decision.*
