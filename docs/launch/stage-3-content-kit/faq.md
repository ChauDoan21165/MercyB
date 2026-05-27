# `/weak-at` FAQ — bilingual

Frequently-asked questions anticipated from a learner visiting `/weak-at` for the first time. Each question is answered in Vietnamese first, with an English mirror underneath. Every answer is verified against shipped code on `main`.

This file is structured as a publishable FAQ. Operators can paste any section into a Facebook reply, a Zalo message, a support email, or in-product help text.

---

## Q1 — Cái trang này là gì? / What is this page?

**VI**

Trang `/weak-at` (tên tiếng Việt: *Điểm yếu của bạn*) là một bản tổng hợp ba điều mà MercyBlade quan sát được khi bạn dùng app:

1. **Lỗi ngữ pháp** — những mẫu câu tiếng Anh bạn hay gặp trục trặc gần đây (vd: quên `-s` sau he/she/it, quên `-ed` cho quá khứ).
2. **Kết quả kiểm tra** — nếu bạn đã làm bài đánh giá trình độ, các điểm cần luyện sẽ xuất hiện ở đây.
3. **Phát âm** — những âm tiếng Anh hay bị nhầm khi bạn nói nhanh.

Phía dưới còn một khối *Gợi ý luyện tập* — đúng ba dòng, mỗi dòng là một thứ cụ thể bạn nên luyện tiếp theo, kèm lý do và một chạm là vào luyện ngay.

**EN**

The `/weak-at` page (English name: *What you're working on*) is a summary of three things MercyBlade has noticed while you've been using the app:

1. **Grammar patterns** — recent English structures you've been working on (e.g. forgetting `-s` after he / she / it, forgetting `-ed` for past tense).
2. **Placement-test results** — if you've completed the level-placement assessment, the patterns it flagged show up here.
3. **Pronunciation** — English sounds that tend to get mistaken when speaking quickly.

Below that is a *Suggested practice* card — exactly three rows, each naming one specific thing to practice next, with a reason and a one-tap handoff to the corresponding practice surface.

---

## Q2 — Dữ liệu trong trang này đến từ đâu? / Where does the data on this page come from?

**VI**

Tất cả dữ liệu hiển thị trên trang `/weak-at` được đọc trực tiếp từ trình duyệt của bạn — cụ thể là `localStorage`. MercyBlade ghi lại ba loại tín hiệu trong khi bạn dùng app:

- Khi bạn viết câu hoặc nói câu mà mô-đun phát hiện lỗi (L1 detector) nhận diện một mẫu lỗi quen thuộc của người Việt → tín hiệu được lưu vào một bộ nhớ vòng 50 mục (`mb.stage3a.l1.recent`).
- Khi bạn hoàn thành bài kiểm tra trình độ (placement) → kết quả gần nhất được lưu vào `mb.stage3a.placement.snapshot`.
- Khi bạn luyện phát âm → âm và độ chính xác được lưu vào một bộ nhớ vòng 100 mục (`mb.stage3a.pronunciation.recent`).

Trang `/weak-at` chỉ đọc ba khóa này. Không có gì khác.

**EN**

All data shown on `/weak-at` is read directly from your browser — specifically, `localStorage`. MercyBlade records three kinds of signals as you use the app:

- When you write or speak a sentence and the L1 detector module recognizes a familiar Vietnamese-learner error pattern → the signal goes into a 50-entry FIFO (`mb.stage3a.l1.recent`).
- When you complete the placement test → the most recent result lands in `mb.stage3a.placement.snapshot`.
- When you practice pronunciation → the phoneme + accuracy goes into a 100-entry FIFO (`mb.stage3a.pronunciation.recent`).

The `/weak-at` page reads these three keys. Nothing else.

---

## Q3 — Có gửi gì lên server không? / Is anything sent to a server?

**VI**

Không. Trang `/weak-at` không gửi yêu cầu HTTP nào ra ngoài khi bạn xem trang.

Bạn có thể tự kiểm tra:

1. Mở Chrome DevTools (Cmd-Opt-I trên macOS, F12 trên Windows / Linux).
2. Mở tab **Network**, lọc theo **Fetch/XHR**, bật **Preserve log**.
3. Tải lại trang `/weak-at`.
4. Đếm yêu cầu phát sinh từ trang này — sẽ là 0.

Các trang khác của MercyBlade (Cô Mercy AI Tutor, thanh toán, đồng bộ tiến trình giữa các thiết bị) có gửi dữ liệu lên Supabase. Trang chẩn đoán `/weak-at` thì không cần — nên không gửi.

**EN**

No. The `/weak-at` page issues zero outbound HTTP requests while you view the surface.

You can verify this yourself:

1. Open Chrome DevTools (Cmd-Opt-I on macOS, F12 on Windows / Linux).
2. Open the **Network** tab, filter to **Fetch/XHR**, enable **Preserve log**.
3. Reload `/weak-at`.
4. Count requests originating from the page — it will be 0.

Other MercyBlade surfaces (the AI Tutor "Cô Mercy", billing, cross-device progress sync) do send data to Supabase. The `/weak-at` diagnostic surface does not need to — so it doesn't.

---

## Q4 — Tại sao trang này không có chuỗi học (streak) hay XP? / Why no streak or XP on this page?

**VI**

Có chủ ý.

MercyBlade từng làm một audit nội bộ về "shame language" (ngôn ngữ làm người học cảm thấy có lỗi) — kết quả lưu tại `docs/voice-guidelines-vn.md`. Bốn quy tắc rút ra:

1. App không tự nhắc về "mất chuỗi" trước khi người học nhắc.
2. Màu đỏ không dùng cho điểm số của riêng người học.
3. Cơ chế nghỉ phép (vacation mode, freeze day) được đưa lên hàng đầu.
4. Cho phép nghỉ phải được nói ra rõ ràng, không ngầm.

Trang `/weak-at` là một mặt **chẩn đoán + gợi ý**, không phải mặt **động lực**. Đặt một số đếm chuỗi ở đây sẽ biến nó từ "đây là điều bạn nên luyện" thành "đây là điều bạn đang chậm". Hai khung khác nhau.

MercyBlade có chuỗi học và XP ở các mặt khác — nhưng không ở đây.

**EN**

By design.

MercyBlade ran an internal "shame language" audit — the durable artifact is at `docs/voice-guidelines-vn.md`. Four rules came out of it:

1. The system never volunteers loss-framing before the learner has invoked it.
2. Red is not a failure color on a user's own scores.
3. Forgiveness mechanisms (vacation mode, freeze day) are surfaced as first-class, not buried.
4. Permission to rest is named explicitly, not implied.

`/weak-at` is a **diagnostic + suggestion** surface, not a **motivation** surface. Adding a streak counter here would shift the frame from "this is what to practice" to "this is what you're behind on". Two different frames.

MercyBlade does have streaks and XP on other surfaces — but not here.

---

## Q5 — Mình có cần đăng nhập để xem trang này không? / Do I need to sign in to see this page?

**VI**

Không. Trang `/weak-at` mở được cho khách (anonymous) — không cần đăng nhập, không cần đăng ký.

Nếu bạn chưa từng dùng app, trang sẽ hiển thị trạng thái rỗng — vì chưa có tín hiệu nào trên thiết bị này. Đó là hành vi đúng, không phải lỗi.

**EN**

No. The `/weak-at` page is anonymous-visitable — no sign-in, no sign-up required.

If you've never used the app before, the page will render an empty state — because no signals exist yet on this device. That is correct behavior, not an error.

---

## Q6 — Khác gì giữa trang `/weak-at` và Cô Mercy AI Tutor? / How is `/weak-at` different from the AI Tutor (Cô Mercy)?

**VI**

`/weak-at` là một **bản tổng hợp đứng yên** — nó nhìn lại những điều bạn đã làm và đưa ra một ảnh chụp tĩnh.

Cô Mercy AI Tutor (`/ai-tutor`) là một **cuộc hội thoại sống động** — bạn viết, Mercy phản hồi, sửa câu, giải thích, dạy mở rộng.

Hai trang nối nhau: khi bạn chạm vào dòng *Ngữ pháp* trong khối *Gợi ý luyện tập* trên `/weak-at`, app sẽ mở `/ai-tutor` với tham số `focus` chỉ đến đúng mẫu lỗi bạn vừa chọn. Đó là cách `/weak-at` "trao tay" sang luyện thực sự.

**EN**

`/weak-at` is a **static summary** — it looks at what you've done and gives you a snapshot.

The AI Tutor (Cô Mercy, at `/ai-tutor`) is a **live conversation** — you write, Mercy replies, corrects sentences, explains, teaches further.

The two are connected: tapping the *Ngữ pháp* (grammar) row in the *Gợi ý luyện tập* card on `/weak-at` opens `/ai-tutor` with a `focus` parameter pointing to the exact pattern you picked. That's how `/weak-at` hands off into actual practice.

---

## Q7 — Nếu mình chưa luyện gì cả thì trang sẽ trông như thế nào? / What does the page look like if I haven't practiced anything yet?

**VI**

Một trang trống — đúng nghĩa. Tiêu đề *Điểm yếu của bạn / What you're working on* vẫn ở trên. Bên dưới, mỗi khối hiển thị một dòng nhẹ nhàng cho biết phần đó chưa có dữ liệu. Khối *Gợi ý luyện tập* hiển thị câu:

> *Chưa có gợi ý nào — luyện thêm vài bài để Mercy hiểu bạn rõ hơn.*
>
> *Suggestions appear after a few lessons.*

Không có thông báo lỗi. Không có "bạn chưa làm gì cả". Trang chỉ đứng lặng và chờ.

Sau khi bạn dùng app vài lần (viết vài câu, thử phát âm vài lần, hoặc làm bài kiểm tra trình độ), nội dung sẽ tự xuất hiện.

**EN**

A quiet page — literally. The *Điểm yếu của bạn / What you're working on* title stays at top. Each section below shows a soft line noting that no data exists yet. The *Suggested practice* card shows:

> *Chưa có gợi ý nào — luyện thêm vài bài để Mercy hiểu bạn rõ hơn.*
>
> *Suggestions appear after a few lessons.*

No error message. No "you haven't done anything". The page just stays calm and waits.

After you use the app a handful of times (write a few sentences, try pronunciation, or take the placement test), the content shows up on its own.

---

## Q8 — Mình có thể xóa dữ liệu của trang này được không? / Can I clear the data this page reads?

**VI**

Có. Vì dữ liệu nằm hoàn toàn trên thiết bị của bạn:

- **Cách đơn giản nhất** — mở Chrome DevTools → Application → Local Storage → chọn `https://mercyblade.com` → xóa các khóa bắt đầu bằng `mb.stage3a.` và `mb.stage3b.`. Tải lại `/weak-at` — trang sẽ về trạng thái rỗng.
- **Cách triệt để hơn** — xóa toàn bộ dữ liệu trang cho `mercyblade.com` qua phần Settings của trình duyệt.
- Nếu bạn dùng MercyBlade trong chế độ ẩn danh (private / incognito), dữ liệu tự biến mất khi đóng tab.

Việc xóa dữ liệu cục bộ này **không ảnh hưởng** đến tài khoản MercyBlade của bạn (nếu có) — vì các tín hiệu ở `/weak-at` không được đồng bộ lên server.

**EN**

Yes. Because the data lives entirely on your device:

- **The easy way** — open Chrome DevTools → Application → Local Storage → select `https://mercyblade.com` → delete the keys that start with `mb.stage3a.` and `mb.stage3b.`. Reload `/weak-at` and the page will return to empty state.
- **The thorough way** — clear all site data for `mercyblade.com` via your browser's Settings.
- If you use MercyBlade in an incognito / private window, this data disappears when the tab closes anyway.

Clearing this local data **does not affect** your MercyBlade account (if you have one) — these `/weak-at` signals are not synced to a server in the first place.

---

## Q9 — Tại sao khối *Gợi ý luyện tập* chỉ có tối đa ba dòng? / Why does the Suggested Practice card show at most three rows?

**VI**

Để khỏi nhồi. Một dòng cho mỗi loại tín hiệu — ngữ pháp, trình độ, phát âm. Nếu cho nhiều hơn, hai dòng cùng loại dễ trùng nhau và làm loãng. Trang muốn mỗi dòng đáng đọc.

Nếu một trong ba loại tín hiệu không có dữ liệu trên thiết bị, dòng tương ứng đơn giản không hiện — không có placeholder. Bạn có thể thấy một dòng, hai dòng, ba dòng, hoặc không có dòng nào (trạng thái rỗng).

**EN**

To avoid noise. One row per signal kind — grammar / placement / pronunciation. More than that, and two rows of the same kind tend to dilute each other. The page wants each row to be worth reading.

If one of the three signal kinds has no data on the device, the corresponding row simply doesn't appear — no placeholder. You may see one row, two rows, three rows, or none (the empty state).

---

## Q10 — Có gì khác giữa `/weak-at` và `/progress`? / How is `/weak-at` different from `/progress`?

**VI**

- `/progress` đọc dữ liệu từ Supabase (server) — nó hiển thị tổng tiến trình của tài khoản bạn qua nhiều thiết bị, cần đăng nhập.
- `/weak-at` đọc dữ liệu cục bộ trên thiết bị này — không cần đăng nhập, không phụ thuộc server.

Cùng tồn tại, không thay thế nhau. Nếu bạn muốn nhìn tổng quan toàn bộ → `/progress`. Nếu bạn muốn biết "trên máy này gần đây mình hay sai cái gì" → `/weak-at`.

**EN**

- `/progress` reads data from Supabase (the server) — it shows your account's overall progress across devices, requires sign-in.
- `/weak-at` reads local data on this device only — no sign-in, no server dependency.

The two coexist, don't replace each other. If you want the full picture → `/progress`. If you want "what have I been getting wrong on this device recently?" → `/weak-at`.

---

## Q11 — Trang này có hiển thị theo tiếng Anh được không nếu mình thích đọc tiếng Anh hơn? / Can I see this page in English if I prefer to read in English?

**VI**

Trang không có nút chuyển ngôn ngữ. Cả tiếng Việt và tiếng Anh đều hiển thị cùng lúc trên mỗi dòng — tiếng Việt là phần chính (chữ to, đậm), tiếng Anh là phần phụ (chữ nhỏ, mờ). Vì vậy bạn vẫn đọc được tiếng Anh thoải mái, chỉ là tiếng Việt sẽ luôn xuất hiện song song.

Đó là chọn lựa thiết kế — MercyBlade là một sản phẩm Vietnamese-first, kể cả với người Việt nói tiếng Anh trôi chảy.

**EN**

The page has no language toggle. Both Vietnamese and English render at the same time on each row — Vietnamese is primary (larger, bolder), English is secondary (smaller, lighter). You can read the English comfortably; Vietnamese just sits alongside.

This is a design choice — MercyBlade is a Vietnamese-first product, including for Vietnamese learners who read English fluently.

---

## Q12 — Trang này có thay đổi gì khi MercyBlade thêm tính năng mới không? / Will this page change when MercyBlade ships new features?

**VI**

Có thể. `/weak-at` là một trang đang tiến hoá — Stage 3 (tháng 5, 2026) là phiên bản đầu tiên. Các phiên bản tiếp theo có thể thêm các loại tín hiệu khác (vd: tín hiệu từ viết, từ giao tiếp với Cô Mercy) nếu chúng vẫn giữ được nguyên tắc *local-only* và *không gây áp lực*.

Bất kỳ thay đổi nào ảnh hưởng đến việc trang có gửi dữ liệu lên server hay không sẽ được thông báo công khai trong nhật ký phát hành — đó là cam kết.

**EN**

Possibly. `/weak-at` is an evolving surface — Stage 3 (May 2026) is its first version. Future versions may add other signal kinds (e.g. signals from writing or from conversation with the AI Tutor) provided they preserve the *local-only* and *no-pressure* principles.

Any change that affects whether the page sends data to a server will be announced publicly in the release notes — that's a commitment.

---

## Where to read more

- The Stage 3 strategy entry — `STRATEGY.md` §6 (2026-05-27 entries).
- The voice / anti-shame design doc — `docs/voice-guidelines-vn.md`.
- The bilingual copy audit + style guide — `docs/copy/bilingual-audit.md`, `docs/copy/vi-style-guide.md`.
- The QA test plan that asserts the behavioral claims in this FAQ — `docs/stage-3b/qa-test-plan.md`.
- The press one-pager — `docs/launch/stage-3-content-kit/press-one-pager.md`.

If a question above is wrong because shipped behavior has changed, the FAQ is the file that's out of date — please flag it.
