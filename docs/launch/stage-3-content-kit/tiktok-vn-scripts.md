# TikTok-VN scripts — Stage 3 launch

Five short-form video scripts in Vietnamese, each under 30 seconds, each anchored to a real shipped Stage 3 capability. Hook → proof → CTA structure.

## How to use this file

- **Each script gives you a shot list, a voiceover, and an on-screen caption track.** The voiceover is the line read aloud; the caption track is the burned-in text on the video.
- **All five scripts assume vertical 1080 × 1920 capture.** The screen-recording slot inside each shot list refers to the `375 × 812` browser capture spec — pad-center on a soft gradient background per `docs/stage-3a/marketing-screenshot-spec.md` §5.
- **Pacing**: 24-frame-per-second beat. Each shot label includes a timestamp range. Total runtime is calibrated to <30 s so the video survives TikTok's full-completion algorithmic preference.
- **Captions** burned-in are mandatory (sound-off viewing is the dominant TikTok behavior). Use a high-contrast slab caption stack — black bar, white type, 64 px.
- **Tags** — every script ends with the same tag set: `#hocTiengAnh #nguoiViet #IELTS #TiengAnhCoBan #MercyBlade`. Variation dilutes; ride the same five.
- **No competitor name in any line.** Where the contrast frame matters, the generic phrasing *"app nhắc chuỗi mỗi ngày"* / *"app học theo điểm số"* substitutes.

---

## Script 1 — *"Bạn có biết mình hay mắc lỗi gì khi nói tiếng Anh?"*

**Anchor capability**: `LocalWeaknessMap` — the diagnostic frame.

**Runtime**: ~26 s.

| Time | Shot | Voiceover (VI) | On-screen caption (VI) |
|---|---|---|---|
| 0:00–0:03 | Talking-head, looking into camera. | *Bạn có biết mình hay mắc lỗi gì khi nói tiếng Anh không?* | Bạn hay mắc lỗi gì khi nói tiếng Anh? |
| 0:03–0:07 | Cutaway: phone in hand, hesitating. | *Nhiều người học cả năm mà vẫn không biết.* | Nhiều người học cả năm mà vẫn không biết. |
| 0:07–0:15 | **Screen recording**: `/weak-at` populated — three sections (*Lỗi ngữ pháp*, *Kết quả kiểm tra*, *Phát âm*), each with bilingual labels. Hold each section ~2 s. | *MercyBlade tổng hợp ba điều cụ thể trên thiết bị của bạn — ngữ pháp, trình độ, phát âm.* | Ngữ pháp · Trình độ · Phát âm |
| 0:15–0:20 | Talking-head, calmer beat. | *Không gửi lên server. Đọc trực tiếp từ máy của bạn.* | Dữ liệu ở lại trên máy. |
| 0:20–0:26 | Hand-pointing-to-phone hold on the SuggestedPracticeList card with the three rows visible. End on a black slate. | *Vào mercyblade.com — gõ /weak-at. Không cần đăng nhập.* | mercyblade.com/weak-at |

**Caption (post text)**:
> Bạn hay mắc lỗi tiếng Anh gì? Vào MercyBlade — biết cụ thể, không cần đăng nhập. #hocTiengAnh #nguoiViet #IELTS #TiengAnhCoBan #MercyBlade

**What this script intentionally does NOT do**:
- Does not promise a score improvement.
- Does not name a competitor.
- Does not show fake testimonials.

---

## Script 2 — *"Học xong rồi luyện gì tiếp theo?"*

**Anchor capability**: `SuggestedPracticeList` — the prescriptive frame (the three-row card).

**Runtime**: ~25 s.

| Time | Shot | Voiceover (VI) | On-screen caption (VI) |
|---|---|---|---|
| 0:00–0:03 | Talking-head, mid-shrug. | *Học xong một bài tiếng Anh — rồi luyện gì tiếp theo?* | Luyện gì tiếp theo? |
| 0:03–0:07 | Cutaway: scrolling endless feed of vocabulary cards, looking tired. | *Đa số app chỉ bảo "học tiếp đi". Không nói rõ học cái nào trước.* | "Học tiếp đi" — học cái nào? |
| 0:07–0:16 | **Screen recording**: scroll to *Gợi ý luyện tập* card. Hover on each of the three rows in turn — *Ngữ pháp* (indigo), *Trình độ* (amber), *Phát âm* (teal). Show the rationale text. | *MercyBlade nói rõ ba điều: ngữ pháp nào, trình độ nào, âm nào — kèm lý do.* | Ngữ pháp · Trình độ · Phát âm |
| 0:16–0:21 | **Screen recording**: tap on the *Phát âm* row → cuts to `/practice/phoneme/th` page. | *Chạm một cái là vào luyện ngay.* | Một chạm là tới luyện. |
| 0:21–0:25 | End slate. | *MercyBlade — mercyblade.com/weak-at.* | mercyblade.com/weak-at |

**Caption (post text)**:
> Học xong không biết luyện gì? MercyBlade nói rõ 3 thứ cần luyện tiếp. #hocTiengAnh #nguoiViet #IELTS #TiengAnhCoBan #MercyBlade

---

## Script 3 — *"Lỗi tiếng Anh của riêng người Việt — không phải lỗi chung chung"*

**Anchor capability**: the L1-detector pipeline + Stage 3A taxonomy. The "Vietnamese learner-language" angle is the brand thesis.

**Runtime**: ~27 s.

| Time | Shot | Voiceover (VI) | On-screen caption (VI) |
|---|---|---|---|
| 0:00–0:04 | Talking-head, direct. | *Tại sao người Việt hay quên thêm "-s" cho he, she, it?* | Tại sao? |
| 0:04–0:09 | Whiteboard cutaway, marker writing: `She go → She goes`. | *Vì tiếng Việt động từ không đổi. Tiếng Anh thì phải đổi.* | Tiếng Việt không đổi. Tiếng Anh phải đổi. |
| 0:09–0:18 | **Screen recording**: `/weak-at` populated, focus on the L1 row of the SuggestedPracticeList showing *"Hay quên thêm -s sau he, she, it."* with the EN subtitle. | *MercyBlade ghi lại đúng những lỗi tiếng Anh của người Việt — không phải lỗi chung chung của app dạy cả thế giới.* | Lỗi tiếng Anh của người Việt. |
| 0:18–0:23 | **Screen recording**: tap on the row → `/ai-tutor?focus=vi_l1_3rd_person_s` opens. | *Một chạm là vào luyện đúng cái đó với Cô Mercy.* | Luyện đúng cái đó với Cô Mercy. |
| 0:23–0:27 | End slate. | *mercyblade.com/weak-at* | mercyblade.com/weak-at |

**Caption (post text)**:
> Lỗi tiếng Anh của người Việt — không phải lỗi chung chung. MercyBlade biết rõ. #hocTiengAnh #nguoiViet #IELTS #TiengAnhCoBan #MercyBlade

---

## Script 4 — *"App học tiếng Anh có cần gửi dữ liệu lên server không?"*

**Anchor capability**: the local-only invariant — `/weak-at` reads only `localStorage`, zero outbound HTTP (verified `docs/stage-3b/qa-test-plan.md` §6).

**Runtime**: ~24 s.

| Time | Shot | Voiceover (VI) | On-screen caption (VI) |
|---|---|---|---|
| 0:00–0:04 | Talking-head, curious. | *App học tiếng Anh có cần gửi dữ liệu của bạn lên server không?* | Có cần gửi dữ liệu không? |
| 0:04–0:10 | **Screen recording**: open Chrome DevTools → Network → filter Fetch/XHR. Show empty filter. | *Mở DevTools — Network. Vào trang /weak-at trên MercyBlade.* | DevTools · Network · /weak-at |
| 0:10–0:18 | **Screen recording**: page loads, hold for ~5 s. Network panel stays at **0** Fetch/XHR requests for the surface. Zoom in on the "0 requests" indicator. | *Không có gì gửi đi. Trang đọc ngay trên máy bạn.* | 0 yêu cầu gửi đi. |
| 0:18–0:24 | Talking-head close. | *Dữ liệu học của bạn ở lại với bạn. MercyBlade — mercyblade.com.* | Dữ liệu ở lại với bạn. |

**Caption (post text)**:
> Học tiếng Anh không cần gửi dữ liệu lên server. /weak-at đọc trên máy bạn — 0 yêu cầu gửi đi. #hocTiengAnh #nguoiViet #IELTS #TiengAnhCoBan #MercyBlade

**Note for filming**: filming DevTools on a phone screen is awkward — use a desktop browser at 375 px-emulated viewport and capture full-screen. The credibility comes from showing the actual Network panel; do not stage it.

---

## Script 5 — *"Không có chuỗi học. Không có XP. Chỉ ba thứ cần luyện."*

**Anchor capability**: the design choice — `/weak-at` has no streak, no XP, no leaderboard. Per `docs/voice-guidelines-vn.md`.

**Runtime**: ~26 s.

| Time | Shot | Voiceover (VI) | On-screen caption (VI) |
|---|---|---|---|
| 0:00–0:04 | Talking-head, thoughtful. | *Cảm thấy áp lực vì chuỗi học mỗi ngày?* | Áp lực vì chuỗi học? |
| 0:04–0:09 | Cutaway: hand setting a phone face-down with a sigh. | *Nhiều app bắt bạn vào học mỗi ngày để giữ chuỗi. Học vì chuỗi, không phải vì cần.* | Học vì chuỗi — không phải vì cần. |
| 0:09–0:18 | **Screen recording**: `/weak-at` page — *Điểm yếu của bạn / What you're working on* h1. Slow pan down through LocalWeaknessMap to the SuggestedPracticeList. **No streak number anywhere. No XP. No countdown.** | *MercyBlade không có chuỗi. Không có XP. Chỉ ba thứ cụ thể bạn nên luyện tiếp theo.* | Không chuỗi · Không XP · Chỉ 3 thứ cần luyện. |
| 0:18–0:23 | Talking-head close, calm. | *Khi nào bạn rảnh — học vài phút là đủ. Mệt thì cũng không sao.* | Mệt thì cũng không sao. |
| 0:23–0:26 | End slate. | *mercyblade.com/weak-at* | mercyblade.com/weak-at |

**Caption (post text)**:
> Không có chuỗi. Không có XP. Chỉ ba thứ cần luyện tiếp. MercyBlade. #hocTiengAnh #nguoiViet #IELTS #TiengAnhCoBan #MercyBlade

**Why this script matters most**: it's the only one that names the anti-shame posture explicitly. The "Mệt thì cũng không sao" line is the canonical permission-to-rest tail from `docs/voice-guidelines-vn.md` Rule 4 — recommend filming this one first.

---

## Posting order

If only one script ships first, ship **Script 1** — it carries the diagnostic story most cleanly.

If three ship in a week:
1. Script 1 (Monday) — the diagnostic frame.
2. Script 2 (Wednesday) — the prescriptive frame.
3. Script 5 (Friday) — the anti-shame posture.

If all five ship:
1. Script 1 → Script 2 → Script 5 → Script 3 → Script 4.

Scripts 3 and 4 are the deepest (L1-thesis and privacy posture); they reward an audience that already engaged with 1 + 2 + 5. Lead with the broader hooks.

## What to do if a script feels off after recording

- **Read the VI voiceover aloud.** Does it sound like you'd say it to a friend? If not — rewrite, don't re-record. The voice fix is upstream.
- **Check `docs/copy/vi-style-guide.md` §1 anti-patterns.** "Cố lên!", "Tuyệt vời!", "rất là", "luôn luôn" creeping in is a sign of MT-feel even when you wrote it yourself.
- **Stay literal to shipped behavior.** If you say "tap the row and Mercy explains in Vietnamese", `/ai-tutor` does need to actually do that on the device used for the screen recording. Re-walk QA §2 before publishing.
