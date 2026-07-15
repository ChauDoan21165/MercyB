# Vietnamese->English A1 Cell Inventory Gaps

Source: `src/languages/vietnamese/lessons-a1.ts`

Counting rule: only `CELL` layer objects count. Workpacks, events, diagnostics, organs, tissues, and resources are excluded.

Audio finding: audio for this surface is runtime-generated or admin-generated. Admin generators persist files in Supabase Storage buckets (`audio/paths`, `audio/welcome`, `audio/warmth`), room playback resolves keys through the `room-audio` bucket, and tutor TTS can cache finalized Azure clips under `room-audio/tts-cache/{sha256}.mp3`. The Vietnamese A1 content schema has no per-cell audio resource keyed by lesson/phrase/dialogue cell address, so the world model should not claim replayable per-cell reference audio for this wedge; it can claim runtime TTS coverage unless a stable cell-addressed asset is added.

## Summary

| Question | Count |
| --- | ---: |
| Total CELL-layer cells | 627 |
| Cells with addressable reference audio | 0 |
| Cells covered only by runtime TTS | 627 |
| Cells with no audio path | 0 |
| Vocabulary items with addressable IPA in pronunciation libs | 0 |
| Vocabulary items absent from pronunciation IPA libs | 412 |
| Unique vocabulary word tokens with IPA | 48 |
| Unique vocabulary word tokens absent from IPA | 444 |
| All cells lacking IPA resource | 627 |
| Lacking translation | 0 |

## Total Cells By Layer

| Layer | Count |
| --- | ---: |
| CELL | 627 |

## Total Cells By Type

| Cell type | Count |
| --- | ---: |
| Vocabulary Item | 412 |
| Dialogue Turn | 215 |

## Audio Status

| Audio status | Count |
| --- | ---: |
| runtime_tts_only | 627 |

## IPA Status

| IPA status | Count |
| --- | ---: |
| absent | 627 |

## First 20 Without Addressable Reference Audio

1. `ac42c0db-b4d5-52af-b9ae-ea4117ff970c` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=001 Greetings > Sentence=Xin chào > Vocabulary=001 Hello > Pronunciation=seen chow > Audio=missing
2. `befee1e7-12cd-598a-9792-d6cf0e78b923` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=001 Greetings > Sentence=Chào buổi sáng > Vocabulary=002 Good morning > Pronunciation=chow boo-ee sahng > Audio=missing
3. `81ab277f-7027-5e4a-a276-ffdd02dda4e4` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=001 Greetings > Sentence=Bạn khỏe không? > Vocabulary=003 How are you? > Pronunciation=ban kweh khome > Audio=missing
4. `90fe27fc-6d1d-5863-8c0e-a5e15cd025e3` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=001 Greetings > Sentence=Tạm biệt > Vocabulary=004 Goodbye > Pronunciation=tahm byet > Audio=missing
5. `82f70c1f-0ebe-5b0f-b5cd-8a3cd4b9fb2b` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=002 Ordering Coffee And Food > Sentence=Cho tôi một cà phê sữa đá. > Vocabulary=001 One iced milk coffee, please. > Pronunciation=chaw toy moht cafe sua da > Audio=missing
6. `5ec4ed20-1698-53a0-a719-deaf99e93d9c` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=002 Ordering Coffee And Food > Sentence=Tôi muốn ăn phở. > Vocabulary=002 I want to eat pho. > Pronunciation=toy mwon an fuh > Audio=missing
7. `cf90fa98-3489-526a-91fb-3a5f556e2d60` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=002 Ordering Coffee And Food > Sentence=Không cay, làm ơn. > Vocabulary=003 No chili, please. > Pronunciation=khome kai, lam uhn > Audio=missing
8. `8628be32-6e70-5b09-9146-23d750f6305e` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=002 Ordering Coffee And Food > Sentence=Tính tiền giúp tôi. > Vocabulary=004 The bill, please. > Pronunciation=ting teen zoop toy > Audio=missing
9. `047c4e8e-c5fb-54d0-ac3f-60e2769d6d3c` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=003 Taxi And Directions > Sentence=Cho tôi đến địa chỉ này. > Vocabulary=001 Please take me to this address. > Pronunciation=chaw toy den dee-ah chee nai > Audio=missing
10. `a9ad3c81-a477-59cf-add5-52728e215a33` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=003 Taxi And Directions > Sentence=Rẽ trái. > Vocabulary=002 Turn left. > Pronunciation=zeh chai > Audio=missing
11. `a78d4aa9-cc6c-56e7-8899-e31e409aadad` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=003 Taxi And Directions > Sentence=Rẽ phải. > Vocabulary=003 Turn right. > Pronunciation=zeh fai > Audio=missing
12. `4a915c08-82ab-54ff-af9a-6510dad46fe2` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=003 Taxi And Directions > Sentence=Dừng ở đây giúp tôi. > Vocabulary=004 Stop here, please. > Pronunciation=zoong uh day zoop toy > Audio=missing
13. `29926906-d9d7-5a73-97f5-8c6b1b931cfd` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=004 Shopping And Prices > Sentence=Cái này bao nhiêu tiền? > Vocabulary=001 How much is this? > Pronunciation=kai nai bao nyew teen > Audio=missing
14. `8d395ac2-d553-5750-b866-ed3d0acc312a` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=004 Shopping And Prices > Sentence=Mắc quá. > Vocabulary=002 Too expensive. > Pronunciation=mak gwa > Audio=missing
15. `49d233ae-6625-5713-af7d-84ea6d4e332a` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=004 Shopping And Prices > Sentence=Bớt được không? > Vocabulary=003 Can you lower the price? > Pronunciation=buht duoc khome > Audio=missing
16. `146b23dd-1954-541a-a833-a1840323b818` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=004 Shopping And Prices > Sentence=Tôi lấy cái này. > Vocabulary=004 I will take this one. > Pronunciation=toy lay kai nai > Audio=missing
17. `a898b5c2-3194-57d8-8e14-54e0345c9fc0` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=005 Basic Polite Phrases > Sentence=Cảm ơn. > Vocabulary=001 Thank you. > Pronunciation=gahm uhn > Audio=missing
18. `f627d1bd-05af-5485-bdd4-0d20106b25d4` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=005 Basic Polite Phrases > Sentence=Xin lỗi. > Vocabulary=002 Sorry / excuse me. > Pronunciation=seen loy > Audio=missing
19. `ebd318a9-f0f5-52f9-bb3e-acae47527153` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=005 Basic Polite Phrases > Sentence=Làm ơn. > Vocabulary=003 Please. > Pronunciation=lam uhn > Audio=missing
20. `71410ce3-af63-5502-8a89-ae5da974630c` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=005 Basic Polite Phrases > Sentence=Không sao. > Vocabulary=004 That's okay. > Pronunciation=khome sao > Audio=missing

## First 20 Lacking IPA

1. `ac42c0db-b4d5-52af-b9ae-ea4117ff970c` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=001 Greetings > Sentence=Xin chào > Vocabulary=001 Hello > Pronunciation=seen chow > Audio=missing
2. `befee1e7-12cd-598a-9792-d6cf0e78b923` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=001 Greetings > Sentence=Chào buổi sáng > Vocabulary=002 Good morning > Pronunciation=chow boo-ee sahng > Audio=missing
3. `81ab277f-7027-5e4a-a276-ffdd02dda4e4` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=001 Greetings > Sentence=Bạn khỏe không? > Vocabulary=003 How are you? > Pronunciation=ban kweh khome > Audio=missing
4. `90fe27fc-6d1d-5863-8c0e-a5e15cd025e3` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=001 Greetings > Sentence=Tạm biệt > Vocabulary=004 Goodbye > Pronunciation=tahm byet > Audio=missing
5. `82f70c1f-0ebe-5b0f-b5cd-8a3cd4b9fb2b` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=002 Ordering Coffee And Food > Sentence=Cho tôi một cà phê sữa đá. > Vocabulary=001 One iced milk coffee, please. > Pronunciation=chaw toy moht cafe sua da > Audio=missing
6. `5ec4ed20-1698-53a0-a719-deaf99e93d9c` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=002 Ordering Coffee And Food > Sentence=Tôi muốn ăn phở. > Vocabulary=002 I want to eat pho. > Pronunciation=toy mwon an fuh > Audio=missing
7. `cf90fa98-3489-526a-91fb-3a5f556e2d60` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=002 Ordering Coffee And Food > Sentence=Không cay, làm ơn. > Vocabulary=003 No chili, please. > Pronunciation=khome kai, lam uhn > Audio=missing
8. `8628be32-6e70-5b09-9146-23d750f6305e` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=002 Ordering Coffee And Food > Sentence=Tính tiền giúp tôi. > Vocabulary=004 The bill, please. > Pronunciation=ting teen zoop toy > Audio=missing
9. `047c4e8e-c5fb-54d0-ac3f-60e2769d6d3c` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=003 Taxi And Directions > Sentence=Cho tôi đến địa chỉ này. > Vocabulary=001 Please take me to this address. > Pronunciation=chaw toy den dee-ah chee nai > Audio=missing
10. `a9ad3c81-a477-59cf-add5-52728e215a33` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=003 Taxi And Directions > Sentence=Rẽ trái. > Vocabulary=002 Turn left. > Pronunciation=zeh chai > Audio=missing
11. `a78d4aa9-cc6c-56e7-8899-e31e409aadad` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=003 Taxi And Directions > Sentence=Rẽ phải. > Vocabulary=003 Turn right. > Pronunciation=zeh fai > Audio=missing
12. `4a915c08-82ab-54ff-af9a-6510dad46fe2` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=003 Taxi And Directions > Sentence=Dừng ở đây giúp tôi. > Vocabulary=004 Stop here, please. > Pronunciation=zoong uh day zoop toy > Audio=missing
13. `29926906-d9d7-5a73-97f5-8c6b1b931cfd` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=004 Shopping And Prices > Sentence=Cái này bao nhiêu tiền? > Vocabulary=001 How much is this? > Pronunciation=kai nai bao nyew teen > Audio=missing
14. `8d395ac2-d553-5750-b866-ed3d0acc312a` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=004 Shopping And Prices > Sentence=Mắc quá. > Vocabulary=002 Too expensive. > Pronunciation=mak gwa > Audio=missing
15. `49d233ae-6625-5713-af7d-84ea6d4e332a` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=004 Shopping And Prices > Sentence=Bớt được không? > Vocabulary=003 Can you lower the price? > Pronunciation=buht duoc khome > Audio=missing
16. `146b23dd-1954-541a-a833-a1840323b818` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=004 Shopping And Prices > Sentence=Tôi lấy cái này. > Vocabulary=004 I will take this one. > Pronunciation=toy lay kai nai > Audio=missing
17. `a898b5c2-3194-57d8-8e14-54e0345c9fc0` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=005 Basic Polite Phrases > Sentence=Cảm ơn. > Vocabulary=001 Thank you. > Pronunciation=gahm uhn > Audio=missing
18. `f627d1bd-05af-5485-bdd4-0d20106b25d4` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=005 Basic Polite Phrases > Sentence=Xin lỗi. > Vocabulary=002 Sorry / excuse me. > Pronunciation=seen loy > Audio=missing
19. `ebd318a9-f0f5-52f9-bb3e-acae47527153` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=005 Basic Polite Phrases > Sentence=Làm ơn. > Vocabulary=003 Please. > Pronunciation=lam uhn > Audio=missing
20. `71410ce3-af63-5502-8a89-ae5da974630c` (Vocabulary Item) - Language=Vietnamese->English > Level=A1 > Lesson=005 Basic Polite Phrases > Sentence=Không sao. > Vocabulary=004 That's okay. > Pronunciation=khome sao > Audio=missing

## First 20 Lacking Translation

_None._
