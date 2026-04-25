# Round 5 · CC4 — L1 rules Vietnamese coverage

Status as of the current commit on `content/l1-rules-vn-explanations`.

## Numbers

- **35 / 60** rules have full Vietnamese content in this PR (all currently detectable rules on `main`).
- **25 / 60** rules pending — they land on top of `shared/l1-rule-ids-round5` once CC3's branch publishes. See **Handoff** below.
- **2 / 35** entries flagged `needs_review: true` for Chau's native-speaker check.

## Handoff for the remaining 25

CC3's `content/l1-rules-new25` branch doesn't exist on origin at commit time. Plan once it lands:

1. Rebase this branch on top of `content/l1-rules-new25` (or on `shared/l1-rule-ids-round5` if CC3 publishes IDs first).
2. The `L1WeaknessTag` union grows by 25 entries.
3. The coverage test in `src/lib/feedback/__tests__/l1-vn-explanations.test.ts` (`"has exactly 35 entries — flags drift if the count changes unexpectedly"`) will fail — that's intentional. It means 25 new tags need VN content before the PR re-merges. The author of the follow-up commit adds the 25 entries and bumps the expected count to 60.
4. No detection logic is touched in the follow-up — pure content.

## `needs_review: true` — please double-check these two

Both are grammar claims in the `explanation_vi` that I'd like a native-speaker sanity pass on.

### `vi_l1_comparative_double`
> **Tâm lý người Việt nhấn 'hơn' hai lần.** Am I right that Vietnamese speakers feel the urge to emphasize "hơn" twice when they write "more taller"? This is an interpretation of the mental model, not an objective grammar fact. If the interference pattern is actually something else (e.g. just forgetting to drop one of the two English markers), replace the `example_wrong_vi_gloss` wording.

### `vi_l1_to_infinitive_after_ing`
> **"Người Việt hay mặc định chọn 'to'".** The claim is that Vietnamese learners over-generalize "to + V" from the earlier-taught pattern. Probably true from teaching experience, but it's pedagogical folk theory, not documented linguistics. Fine to keep the wording; flagging in case you want to soften to a more neutral explanation.

## Sample for tone spot-check — 5 rules

| id | name_vi | explanation_vi | example_wrong_vi_gloss |
|---|---|---|---|
| `vi_l1_past_ed` | Quên thêm -ed cho động từ quá khứ | Trong tiếng Việt, thì quá khứ được báo hiệu bằng 'đã' hoặc trạng ngữ như 'hôm qua', 'năm ngoái' — động từ giữ nguyên. Tiếng Anh phải thêm **-ed** vào chính động từ. Nếu câu nói về quá khứ, đừng quên biến đổi: work → worked, play → played. | Yesterday I work → 'Hôm qua + tôi + làm việc' (mình thấy 'hôm qua' là đủ, quên đổi work → worked) |
| `vi_l1_missing_be` | Thiếu động từ 'to be' trước tính từ | Tiếng Việt nói 'tôi mệt', 'anh ấy vui' là đủ — chủ ngữ ghép thẳng với tính từ, không cần động từ nối. Tiếng Anh cần **am / is / are** ở giữa: I am tired, he is happy. Công thức: chủ ngữ + be + tính từ. | I tired → 'Tôi + mệt' (mình nói như tiếng Việt, quên chèn 'am') |
| `vi_l1_make_vs_do` | Nhầm 'make' và 'do' | Tiếng Việt chỉ có một từ 'làm' bao quát nhiều nghĩa. Tiếng Anh tách ra: **make** là tạo ra cái mới (make a cake, make a decision); **do** là thực hiện một việc (do homework, do the dishes). Phải nhớ theo cụm, không dịch trực tiếp. | I did a cake → 'Tôi + làm + một cái + bánh' (một chữ 'làm' trong tiếng Việt → mình chọn nhầm 'did') |
| `vi_l1_since_vs_for` | Nhầm 'since' và 'for' | Tiếng Việt 'từ' và 'trong' đôi khi dùng thay nhau. Tiếng Anh tách rõ: **since** + mốc thời gian (since 2020, since Monday); **for** + khoảng thời gian (for 3 years, for two hours). Mốc điểm → since; khoảng dài → for. | I've lived here for 2020 → 'Tôi + sống ở đây + từ + 2020' ('từ 2020' là mốc điểm → đúng là 'since 2020') |
| `vi_l1_time_expressions` | Giới từ thời gian (in / on / at) | Tiếng Việt 'vào / lúc' dùng chung cho mọi thời điểm. Tiếng Anh có quy tắc rõ: **at** cho giờ (at 6pm); **on** cho ngày (on Monday, on July 5th); **in** cho tháng / năm / thế kỷ (in May, in 2024). Giờ → at; ngày → on; khoảng dài → in. | I'll see you in Monday → 'Tôi sẽ gặp bạn + vào + thứ Hai' (ngày cụ thể → phải là 'on Monday', không phải 'in') |

## All 35 entries — one-line preview

| id | name_vi | needs_review |
|---|---|---|
| vi_l1_3rd_person_s | Quên thêm -s sau he / she / it | ❌ |
| vi_l1_past_ed | Quên thêm -ed cho động từ quá khứ | ❌ |
| vi_l1_plural_s | Quên thêm -s cho danh từ số nhiều | ❌ |
| vi_l1_missing_be | Thiếu động từ 'to be' trước tính từ | ❌ |
| vi_l1_question_no_aux | Câu hỏi thiếu 'do / does / did' | ❌ |
| vi_l1_missing_article | Thiếu mạo từ a / an / the | ❌ |
| vi_l1_possessive_gender | Nhầm his / her theo giới tính | ❌ |
| vi_l1_preposition_transfer | Dùng sai giới từ theo lối tiếng Việt | ❌ |
| vi_l1_countable | Danh từ không đếm được (advice, information...) | ❌ |
| vi_l1_to_verb_confusion | Thiếu 'to' giữa hai động từ | ❌ |
| vi_l1_can_no_infinitive | Sau can / will / should phải là động từ nguyên mẫu | ❌ |
| vi_l1_double_past | Đánh dấu quá khứ hai lần | ❌ |
| vi_l1_possessive_s_missing | Quên 's để chỉ sở hữu | ❌ |
| vi_l1_comparative_double | Dùng 'more' và '-er' cùng lúc | ⚠️ review |
| vi_l1_adjective_order | Sai thứ tự tính từ đứng trước danh từ | ❌ |
| vi_l1_very_much_placement | Đặt sai vị trí 'very' và 'much' | ❌ |
| vi_l1_there_are_singular | Chia sai 'there is / there are' | ❌ |
| vi_l1_everyone_plural | 'Everyone / everybody' luôn là số ít | ❌ |
| vi_l1_make_vs_do | Nhầm 'make' và 'do' | ❌ |
| vi_l1_tag_question | Câu hỏi đuôi (tag question) | ❌ |
| vi_l1_past_perfect_missing | Thiếu quá khứ hoàn thành (had + V3) | ❌ |
| vi_l1_reported_speech | Lùi thì trong câu gián tiếp | ❌ |
| vi_l1_since_vs_for | Nhầm 'since' và 'for' | ❌ |
| vi_l1_countable_much | Dùng 'much' với danh từ đếm được | ❌ |
| vi_l1_some_vs_any | Nhầm 'some' và 'any' | ❌ |
| vi_l1_reflexive_missing | Thiếu đại từ phản thân (myself, yourself...) | ❌ |
| vi_l1_conditional_mix | Nhầm thì trong câu điều kiện | ❌ |
| vi_l1_to_infinitive_after_ing | Sau một số động từ phải dùng -ing, không dùng 'to' | ⚠️ review |
| vi_l1_passive_missing_be | Thiếu 'be' trong câu bị động | ❌ |
| vi_l1_relative_pronoun | Chọn sai đại từ quan hệ (who / which / that) | ❌ |
| vi_l1_used_to_vs_be_used_to | Nhầm 'used to' và 'be used to' | ❌ |
| vi_l1_another_vs_other | Nhầm 'another' và 'other' | ❌ |
| vi_l1_look_vs_see_vs_watch | Nhầm 'look / see / watch' | ❌ |
| vi_l1_by_vs_with | Nhầm 'by' và 'with' | ❌ |
| vi_l1_time_expressions | Giới từ thời gian (in / on / at) | ❌ |

## Guarantees (enforced by tests)

- ✅ Every one of the 35 current detector tags has `name_vi`, `explanation_vi`, `example_wrong_vi_gloss`, `needs_review`.
- ✅ Every `explanation_vi` ≤ 300 characters (mobile-display budget).
- ✅ Every `explanation_vi` contains Vietnamese diacritics — no accidental English-only strings.
- ✅ No shameful framing (`sai lầm`, `xấu hổ`, standalone `ngu`, standalone `dốt`).
- ✅ No detection-logic change, no rule-engine API change, no sentences / micro-lessons touched.
