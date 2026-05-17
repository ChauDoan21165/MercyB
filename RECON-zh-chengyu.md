# RECON — Chinese C2 `idiom_glosses[*].example_en` raw-chengyu defect

**Agent:** F (zh-chengyu-fix-agent)
**Branch:** `zh-c2-chengyu-cleanup` (off `origin/main`)
**Date:** 2026-05-17
**Phase:** 1 (recon only — no source edits yet)

---

## 1. Scope & defect class

`src/languages/chinese/lessons-c2.ts` has **45** `example_en` fields, **all 45 inside `idiom_glosses[]`** (14 idiom-gloss blocks across 14 lessons, current ids 102–115). **All 45 are defective**: the English example slot embeds the raw chengyu (Chinese characters) inline instead of an idiomatic English illustration of the idiom's meaning.

This defeats the purpose of `example_en` for an English-speaking learner — they hit Chinese characters they cannot read in the field meant to *show the meaning in English*. Same defect class as German C1 **PR #530**.

The Chinese chengyu is **correctly preserved** in the sibling `example` field (target-language slot) for every entry — those stay untouched. Only `example_en` is rewritten.

Detection: regex `[㐀-䶿一-鿿豈-﫿　-〿＀-￯]` over each `example_en` → 45/45 hit.

## 2. Coordination & Phase-2 gate (READ BEFORE PHASE 2)

- The **survival-cleanup agent** holds branch `survival-cleanup/zh-c2-id-collision` with **OPEN PR #542**: *"fix(chinese): renumber C2 ids 102–121 → 142–161 — resolve C1/C2 collision"*. **Not yet merged.**
- PR #542 changes only the `"id":` field values (offset **+40**). It does **not** touch `idiom_glosses` / `example_en`, so the two changesets edit disjoint lines → rebase should be clean, but **Phase 2 must rebase off `main` after #542 merges** (per brief) so the renumber is picked up.
- **ID mapping** (so this recon stays valid post-merge): each affected lesson `id N` (102–115) → `id N+40` (142–155).

| Current id | Post-#542 id | Idiom block size |
|---|---|---|
| 102 | 142 | 4 |
| 103 | 143 | 4 |
| 104 | 144 | 4 |
| 105 | 145 | 4 |
| 106 | 146 | 4 |
| 107 | 147 | 4 |
| 108 | 148 | 4 |
| 109 | 149 | 4 |
| 110 | 150 | 4 |
| 111 | 151 | 4 |
| 112 | 152 | 2 |
| 113 | 153 | 1 |
| 114 | 154 | 1 |
| 115 | 155 | 1 |

Phase-2 editing is keyed on the `idiom` string + the exact current `example_en` string (unique per entry), **not** on lesson id — so it is robust whether #542 has merged or not.

## 3. Drafting principle

For each entry: write an idiomatic English sentence that **illustrates the idiom's meaning in use**, parallel to the preserved Chinese `example`. No Chinese characters. Meaning-first over literal; vivid imagery kept only where it reads as natural English (e.g. "cutting the foot to fit the shoe"). Proper nouns romanized (Wang Guowei, Qian Zhongshu, Records of the Grand Historian, Jin Ping Mei, government work report). Academic register retained — these are C2 literary-criticism phrases.

No external English-language standard gloss exists for most of these as *example sentences* (they are academic-critical collocations, not common-speech idioms); dictionary glosses informed the `meaning_en` (already present and clean) and the drafts below parallel that meaning. **Drafts produced by agent; native review recommended before mass adoption.**

---

## 4. The 45 — current (defective) → proposed `example_en`

Match key = (`idiom`, current `example_en`). `example` (zh) shown for parallel; it is **unchanged**.

### Lesson 102 → 142 — Presenting a literary research hypothesis

**1. 草蛇灰线** — *foreshadowing thread that surfaces briefly, vanishes, resurfaces*
- example (zh, kept): `曹雪芹之笔法, 草蛇灰线, 伏脉千里, 非细读不能察。`
- current: `Cao Xueqin's brushwork — 草蛇灰线, 伏脉千里 — cannot be discerned without close reading.`
- **proposed:** `Cao Xueqin's brushwork lays a faint, intermittent foreshadowing thread that runs for a thousand pages and cannot be discerned without close reading.`

**2. 伏脉千里** — *a plot-thread laid early surfaces much later*
- example (zh, kept): `脂批屡称此处'伏脉千里', 提示读者警觉后文呼应。`
- current: `The Zhiyanzhai commentary repeatedly calls this passage '伏脉千里', alerting the reader to watch for the later echo.`
- **proposed:** `The Zhiyanzhai commentary repeatedly notes a buried thread here, alerting the reader to watch for its echo a thousand pages on.`

**3. 言近旨远** — *plain words, far-reaching meaning*
- example (zh, kept): `庄子寓言, 言近旨远, 字简意丰。`
- current: `Zhuangzi's parables are 言近旨远 — the words are spare yet the meaning is rich.`
- **proposed:** `Zhuangzi's parables use spare, homely words yet carry a meaning that reaches far beyond them.`

**4. 钩沉索隐** — *recovering obscure or lost material*
- example (zh, kept): `王国维治学钩沉索隐, 于敦煌残卷中发覆甚多。`
- current: `Wang Guowei's scholarship was 钩沉索隐 — from the Dunhuang fragments he uncovered a great deal.`
- **proposed:** `Wang Guowei's scholarship dredged up the sunken and sought out the hidden, recovering a great deal from the Dunhuang fragments.`

### Lesson 103 → 143 — Citation conventions in literary criticism

**5. 断章取义** — *wrenching a passage out of context to suit oneself*
- example (zh, kept): `引王国维'有我之境'而不及'无我之境', 实属断章取义。`
- current: `Quoting Wang Guowei's '有我之境' while omitting the '无我之境' is in fact 断章取义.`
- **proposed:** `Citing Wang Guowei on the "self-present realm" while omitting the "self-absent realm" wrenches the passage out of context to suit the argument.`

**6. 旁征博引** — *wide-ranging, multi-source quotation*
- example (zh, kept): `钱钟书《管锥编》旁征博引, 涵盖中西经史子集。`
- current: `钱钟书's 《管锥编》 is 旁征博引, spanning Chinese and Western 经史子集.`
- **proposed:** `Qian Zhongshu's Guanzhui Bian quotes widely and draws on many sources, spanning the Chinese and Western classics.`

**7. 言出有典** — *every utterance is canonically grounded*
- example (zh, kept): `其论虽简, 然言出有典, 字字有据。`
- current: `His argument is brief, yet 言出有典 — every word has its grounds.`
- **proposed:** `His argument is brief, yet every line is canonically grounded — not a word without its source.`

**8. 有据可查** — *backed by verifiable evidence*
- example (zh, kept): `全章引证, 件件有据可查, 无一虚言。`
- current: `The whole chapter is documented — every item is 有据可查, not one word is empty.`
- **proposed:** `The whole chapter is documented — every claim can be checked against a source, with not one empty word.`

### Lesson 104 → 144 — Literary debate and counter-argument

**9. 众说纷纭** — *many conflicting opinions*
- example (zh, kept): `关于此诗作年, 学界历来众说纷纭, 莫衷一是。`
- current: `On this poem's date of composition the field has always been 众说纷纭, with no consensus.`
- **proposed:** `On this poem's date of composition the field has always held many conflicting opinions, with no consensus.`

**10. 以今律古** — *judging the classical by present-day standards (anachronism)*
- example (zh, kept): `以现代narrative theory强解《史记》, 不免以今律古之嫌。`
- current: `Forcing modern narrative theory onto the 《史记》 risks the charge of 以今律古.`
- **proposed:** `Forcing modern narrative theory onto the Records of the Grand Historian risks the charge of judging the ancient by today's standards.`

**11. 貌合神离** — *alike in form, different in spirit*
- example (zh, kept): `王维之'空山'与王国维之'境界', 貌合神离, 不可等量齐观。`
- current: `Wang Wei's '空山' and Wang Guowei's '境界' are 貌合神离 and cannot be equated.`
- **proposed:** `Wang Wei's "empty mountain" and Wang Guowei's "realm" look alike on the surface but differ at heart, and cannot be equated.`

**12. 君子之争** — *disagreeing without disrespect*
- example (zh, kept): `二人辩驳虽烈, 却不失君子之争之风。`
- current: `Though their rebuttals were fierce, the two never lost the spirit of 君子之争.`
- **proposed:** `Though their rebuttals were fierce, the two never lost the gentlemanly spirit of disagreeing without disrespect.`

### Lesson 105 → 145 — Hedging in literary research

**13. 言之凿凿** — *excessive certainty (ironic over-claim flag)*
- example (zh, kept): `该作者言之凿凿, 然其据实不充, 终成空言。`
- current: `The author writes 言之凿凿, yet the evidence is thin, so it ends as empty assertion.`
- **proposed:** `The author writes with iron certainty, yet the evidence is thin, so the claim ends as empty assertion.`

**14. 莫衷一是** — *no consensus on whose view to follow*
- example (zh, kept): `对于《金瓶梅》之作者归属, 学界至今莫衷一是。`
- current: `On the authorship of 《金瓶梅》 the field is still 莫衷一是.`
- **proposed:** `On the authorship of the Jin Ping Mei the field still cannot settle on a single view.`

**15. 言不轻发** — *weighing one's words; not speaking carelessly*
- example (zh, kept): `钱钟书治学严谨, 言不轻发, 每立一论必有据。`
- current: `钱钟书's scholarship is rigorous and 言不轻发 — every thesis he advances has grounds.`
- **proposed:** `Qian Zhongshu's scholarship is rigorous and never speaks carelessly — every thesis he advances is grounded.`

**16. 尚需斟酌** — *still needs to be weighed*
- example (zh, kept): `结论部分之措辞尚需斟酌, 建议加入更多 hedge。`
- current: `The wording of the conclusion is 尚需斟酌; I suggest adding more hedging.`
- **proposed:** `The wording of the conclusion still needs to be weighed; I suggest adding more hedging.`

### Lesson 106 → 146 — Defining classical critical concepts

**17. 顾名思义** — *just as the name suggests*
- example (zh, kept): `所谓'意境', 顾名思义, 即指意与境互融而成之审美整体。`
- current: `The so-called '意境', 顾名思义, refers to the aesthetic whole formed by the fusion of 意 and 境.`
- **proposed:** `The term "aesthetic conception", as its name suggests, refers to the aesthetic whole formed when feeling and scene fuse.`

**18. 立锥之地** — *the minimum ground on which to stand (basis of an argument)*
- example (zh, kept): `概念若不明确, 论证便失其立锥之地。`
- current: `If the concept is undefined, the argument loses its 立锥之地.`
- **proposed:** `If the concept is left undefined, the argument has no ground to stand on.`

**19. 形似神异** — *alike in form but different in spirit*
- example (zh, kept): `意境与境界, 形似神异, 不可混为一谈。`
- current: `意境 and 境界 are 形似神异 and must not be conflated.`
- **proposed:** `"Aesthetic conception" and "realm" resemble each other in form but diverge in spirit, and must not be conflated.`

**20. 一脉相承** — *one continuous lineage handed down*
- example (zh, kept): `从王昌龄到王国维, 意境之论一脉相承, 而代有损益。`
- current: `From Wang Changling to Wang Guowei the discourse of 意境 is 一脉相承, with each age adding and subtracting.`
- **proposed:** `From Wang Changling to Wang Guowei the discourse of aesthetic conception descends in one continuous line, each age adding to and subtracting from it.`

### Lesson 107 → 147 — Comparing literary critical methodologies

**21. 各有千秋** — *each side has its own strength*
- example (zh, kept): `文本细读、接受美学、互文性三种方法各有千秋, 适用场景不同。`
- current: `Close reading, reception aesthetics and intertextuality 各有千秋, each suited to different scenarios.`
- **proposed:** `Close reading, reception aesthetics and intertextuality each have their own strengths, suited to different scenarios.`

**22. 相辅相成** — *complementing one another*
- example (zh, kept): `理论与实证相辅相成, 缺一不可。`
- current: `Theory and empirical evidence are 相辅相成 and neither can be dispensed with.`
- **proposed:** `Theory and empirical evidence complement and complete each other; neither can be dispensed with.`

**23. 殊途同归** — *different paths arriving at the same goal*
- example (zh, kept): `二位学者所取路径迥异, 而结论 殊途同归, 实可互为印证。`
- current: `The two scholars took sharply different routes, yet their conclusions are 殊途同归 and can corroborate each other.`
- **proposed:** `The two scholars took sharply different routes, yet their conclusions converge on the same point and can corroborate each other.`

**24. 各擅胜场** — *each excels in its own domain*
- example (zh, kept): `三种方法论各擅胜场, 不必互相凌驾。`
- current: `The three methodologies 各擅胜场 and need not override one another.`
- **proposed:** `Each of the three methodologies excels in its own domain, and none need override the others.`

### Lesson 108 → 148 — Critiquing a literary translation study

**25. 瑕不掩瑜** — *a flaw does not obscure the merit*
- example (zh, kept): `该研究虽存在若干局限, 然瑕不掩瑜, 仍具相当贡献。`
- current: `Although the study has several limitations, 瑕不掩瑜 — it still makes a considerable contribution.`
- **proposed:** `Although the study has several limitations, the flaws do not obscure its merit — it still makes a considerable contribution.`

**26. 见仁见智** — *legitimate disagreement; each sees it their own way*
- example (zh, kept): `形似与神似之取舍, 学界历来见仁见智。`
- current: `On the trade-off between 形似 and 神似 the field has always been 见仁见智.`
- **proposed:** `On the trade-off between formal and spiritual fidelity, the field has always granted that reasonable scholars see it differently.`

**27. 大相径庭** — *vastly different*
- example (zh, kept): `二位 译者 之 风格 大相径庭, 一忠 形 一忠 神。`
- current: `The two translators' styles are 大相径庭 — one is faithful to the form, the other to the spirit.`
- **proposed:** `The two translators' styles diverge enormously — one is faithful to the form, the other to the spirit.`

**28. 力所不逮** — *one's power does not extend that far*
- example (zh, kept): `唐诗外译之难, 在于多 dimension 之 同时 转化, 单一 framework 力所不逮。`
- current: `The difficulty of translating Tang poetry abroad lies in transforming many dimensions at once — a single framework is 力所不逮.`
- **proposed:** `The difficulty of translating Tang poetry abroad lies in transforming many dimensions at once — beyond the reach of any single framework.`

### Lesson 109 → 149 — Conference Q&A register in literature

**29. 抛砖引玉** — *a modest offering meant to draw out better thought from others*
- example (zh, kept): `笔者今日所言, 不过抛砖引玉, 望诸位多加指教。`
- current: `What I have said today is merely 抛砖引玉; I hope the assembled scholars will offer their guidance.`
- **proposed:** `What I have said today is offered only to draw out far better thoughts from others; I hope the assembled scholars will share their guidance.`

**30. 不吝赐教** — *not sparing one's instruction (humble request for guidance)*
- example (zh, kept): `笔者拙文若有不足之处, 望诸位评委不吝赐教。`
- current: `If my modest paper has shortcomings, I hope the committee will 不吝赐教.`
- **proposed:** `If my modest paper has shortcomings, I hope the committee will not spare their guidance.`

**31. 不揣冒昧** — *at the risk of presumption (before a bold question)*
- example (zh, kept): `学生不揣冒昧, 想请教教授一个问题...`
- current: `学生不揣冒昧, may I put a question to the professor…`
- **proposed:** `At the risk of presumption, may I put a question to the professor…`

**32. 略陈管见** — *briefly setting out one's limited opinion (humble)*
- example (zh, kept): `笔者于此略陈管见, 不当之处, 敬请指正。`
- current: `Here I 略陈管见; where it is inapt, I respectfully ask for correction.`
- **proposed:** `Here I will briefly set out my limited view; where it is inapt, I respectfully ask for correction.`

### Lesson 110 → 150 — Writing literary research abstracts

**33. 开宗明义** — *stating the main thesis at the very outset*
- example (zh, kept): `摘要应开宗明义, 第一句即点出研究核心贡献。`
- current: `An abstract should 开宗明义 — the first sentence must state the study's core contribution.`
- **proposed:** `An abstract should state its thesis at the very outset — the first sentence must name the study's core contribution.`

**34. 言简意赅** — *few words but full meaning*
- example (zh, kept): `该摘要言简意赅, 紧扣四要素, 堪称典范。`
- current: `This abstract is 言简意赅, holding tight to the four elements — a model of its kind.`
- **proposed:** `This abstract says much in few words, holding tight to the four required elements — a model of its kind.`

**35. 画龙点睛** — *the finishing touch that brings the whole alive*
- example (zh, kept): `结论一段堪称画龙点睛, 升华了全文论证。`
- current: `The closing paragraph is 画龙点睛, lifting the whole argument.`
- **proposed:** `The closing paragraph supplies the finishing touch that brings the whole argument to life.`

**36. 画蛇添足** — *a needless addition that spoils the whole*
- example (zh, kept): `abstract最后两句在重复结论, 实属画蛇添足。`
- current: `The last two sentences of the abstract merely repeat the conclusion — sheer 画蛇添足.`
- **proposed:** `The last two sentences of the abstract merely repeat the conclusion — a superfluous addition that only weakens it.`

### Lesson 111 → 151 — Peer review of literary research papers

**37. 字斟句酌** — *deliberating over each word and sentence*
- example (zh, kept): `评审意见之撰写, 务必字斟句酌, 切忌情绪用事。`
- current: `A review must be written 字斟句酌 — never let emotion take over.`
- **proposed:** `A review must be written weighing every word and phrase — never letting emotion take over.`

**38. 实事求是** — *seeking truth from facts*
- example (zh, kept): `审稿人当本着实事求是之原则, 客观评价手稿。`
- current: `A reviewer should evaluate a manuscript objectively, on the principle of 实事求是.`
- **proposed:** `A reviewer should evaluate a manuscript objectively, on the principle of seeking truth from facts.`

**39. 直言不讳** — *speaking straight without taboo*
- example (zh, kept): `该审稿人直言不讳, 指出了本稿的核心methodology问题。`
- current: `The reviewer was 直言不讳 and identified the manuscript's core methodology problem.`
- **proposed:** `The reviewer spoke plainly and without reservation, identifying the manuscript's core methodology problem.`

**40. 客观公正** — *objective and fair*
- example (zh, kept): `评审过程必须坚持客观公正, 不受外部因素影响。`
- current: `The review process must uphold 客观公正 and not be swayed by external factors.`
- **proposed:** `The review process must remain objective and fair, unswayed by external factors.`

### Lesson 112 → 152 — Art criticism methodology

**41. 心物一元** — *mind and matter as one (Zong Baihua)*
- example (zh, kept): `宗白华以'心物一元'概括中国艺术精神, 为本土批评提供了迥异于西方主客二分的出发点。`
- current: `Zong Baihua sums up the spirit of Chinese art as '心物一元', giving native criticism a starting point quite unlike the Western subject–object split.`
- **proposed:** `Zong Baihua sums up the spirit of Chinese art as the oneness of mind and matter, giving native criticism a starting point quite unlike the Western subject–object split.`

**42. 削足适履** — *forcing a phenomenon into an ill-fitting frame*
- example (zh, kept): `以西式观念强行分析中国水墨, 难免削足适履之嫌。`
- current: `Forcing Chinese ink-painting into Western concepts can hardly escape the charge of 削足适履.`
- **proposed:** `Forcing Chinese ink-painting into Western concepts can hardly escape the charge of cutting the foot to fit the shoe.`

### Lesson 113 → 153 — Writing film criticism

**43. 不着一字, 尽得风流** — *conveying everything through image, not a single word of dialogue*
- example (zh, kept): `侯孝贤之抒情, 可谓'不着一字, 尽得风流' — 无需对白, 仅凭镜头之停留与风之吹拂, 便已传递一切。`
- current: `Hou Hsiao-hsien's lyricism is, one may say, '不着一字, 尽得风流' — needing no dialogue, the lingering of the shot and the blowing of the wind already convey everything.`
- **proposed:** `Hou Hsiao-hsien's lyricism, one might say, captures everything without uttering a word — needing no dialogue, the lingering shot and the stirring wind already convey it all.`

### Lesson 114 → 154 — Analyzing political speeches

**44. 起承转合** — *the four-part classical structure: opening, development, turn, close*
- example (zh, kept): `政府工作报告之段落结构, 依然恪守着起承转合之古法 — 只是其'转'往往极隐, 非细察不能见。`
- current: `The paragraph structure of the 政府工作报告 still keeps to the old method of 起承转合 — only its 'turn' is often so concealed that it cannot be seen without close scrutiny.`
- **proposed:** `The paragraph structure of the government work report still keeps to the old four-part method — opening, development, turn, and close — only its "turn" is so concealed it cannot be seen without close scrutiny.`

### Lesson 115 → 155 — Civic deliberation and public reason

**45. 求同存异** — *seek common ground while accepting differences*
- example (zh, kept): `社区议事之要义, 不在争出是非, 而在求同存异 — 找出大家都能接受的'最小公约数'。`
- current: `The essence of community deliberation lies not in arguing out right and wrong but in 求同存异 — finding the 'least common denominator' everyone can accept.`
- **proposed:** `The essence of community deliberation lies not in arguing out who is right but in seeking common ground while accepting differences — finding the "least common denominator" everyone can accept.`

---

## 5. Phase-2 plan (gated on PR #542 merge)

1. Wait for PR #542 to merge (or branch off `survival-cleanup/zh-c2-id-collision`). Check survival-cleanup status before starting.
2. `git fetch origin && git rebase origin/main` to pick up the renumber.
3. Apply 45 string replacements in `src/languages/chinese/lessons-c2.ts`, keyed on the unique current `example_en` string per entry (id-independent → safe regardless of #542 state). `example` (zh) untouched.
4. Re-run `node` extraction → assert 0/45 contain CJK; assert all 45 `example` (zh) unchanged.
5. Gates: `npm run typecheck:ci` · `npm run lint` · `npm run build` · `npx vitest run` — all exit 0.
6. Single PR. Body line: *"Drafts produced by agent; native review recommended before mass adoption to user base."* + note the #542 dependency. Merge stays Chau's.

## 6. Verification snapshot (Phase 1)

- `grep -c 'example_en' src/languages/chinese/lessons-c2.ts` → **45**
- Extraction script (`/tmp/extract-chengyu.mjs`, bracket-matched JSON parse): **45/45** contain CJK (defect), **0** clean.
- All 45 sit in `idiom_glosses[]`; no `example_en` elsewhere in the file.
- All sibling `example` (zh) fields are correctly target-language and will be preserved.
