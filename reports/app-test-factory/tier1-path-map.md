# Tier-1 path map — app-test factory (SL-001)

- **Base URL:** https://mercyblade.com
- **Crawled at:** 2026-07-10T16:18:32.245Z
- **Auth mode:** anonymous
- **Totals:** 172 crawled — ✅ 136 pass · 🔒 0 gated (expected) · ❌ 36 fail (of which 36 are NEW, non-known-defect)
- **Known defects reproduced:** (none this run)
- **Un-crawlable routes (explicit gaps):** 41

## ❌ NEW failures (not previously known) — action needed

### `/languages/thai-english`  _(kind: public, landed: /languages/thai-english/)_
- **blank-render** — #root did not render any content
  - repro: Open https://mercyblade.com/languages/thai-english in a logged-out browser and observe: a blank page (the SPA shell never mounted #root)

### `/listening`  _(kind: auth, landed: /listening)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/listening in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/listening in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/listening in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/listening in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/listening in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/mercy/chat`  _(kind: auth, landed: /mercy/chat)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mercy/chat in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mercy/chat in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mercy/chat in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mercy/chat in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/mock-interview`  _(kind: auth, landed: /mock-interview)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/mock-interview/community`  _(kind: auth, landed: /mock-interview/community)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview/community in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview/community in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview/community in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview/community in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/mock-interview/submit-prompt`  _(kind: auth, landed: /mock-interview/submit-prompt)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview/submit-prompt in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview/submit-prompt in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/mock-interview/submit-prompt in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/onboarding`  _(kind: public, landed: /onboarding)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/onboarding in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/onboarding in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/onboarding in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/pack/nail-tech`  _(kind: auth, landed: /pack/nail-tech)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/pack/nail-tech in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/pack/nail-tech in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/pack/nail-tech in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/placement`  _(kind: auth, landed: /placement)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/placement/results`  _(kind: auth, landed: /placement/results)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/results in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/results in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/results in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/placement/resume`  _(kind: auth, landed: /placement/resume)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/resume in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/resume in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/resume in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/placement/skip`  _(kind: auth, landed: /placement/skip)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/skip in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/skip in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/placement/test`  _(kind: auth, landed: /placement/test)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/test in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/test in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/placement/who`  _(kind: auth, landed: /placement/who)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/placement/who in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/pricing`  _(kind: public, landed: /pricing)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/pricing in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/progress/play`  _(kind: auth, landed: /progress/play)_
- **not-found-404** — route rendered the NotFound (404) page
  - repro: Open https://mercyblade.com/progress/play in a logged-out browser and observe: the app's 404 'Không tìm thấy trang.' page — the route is not wired

### `/rooms/addiction_support_free`  _(kind: public, landed: /rooms/addiction_support_free)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/rooms/addiction_support_free in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/seo/hoc-tieng-anh-cho-nguoi-viet`  _(kind: public, landed: /seo/hoc-tieng-anh-cho-nguoi-viet)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/seo/hoc-tieng-anh-cho-nguoi-viet in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/seo/hoc-tieng-anh-mien-phi`  _(kind: public, landed: /seo/hoc-tieng-anh-mien-phi)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/seo/hoc-tieng-anh-mien-phi in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/seo/loi-tieng-anh-nguoi-viet-hay-sai`  _(kind: public, landed: /seo/loi-tieng-anh-nguoi-viet-hay-sai)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/seo/loi-tieng-anh-nguoi-viet-hay-sai in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/seo/phong-van-tieng-anh`  _(kind: public, landed: /seo/phong-van-tieng-anh)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/seo/phong-van-tieng-anh in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/seo/sua-phat-am-tieng-anh`  _(kind: public, landed: /seo/sua-phat-am-tieng-anh)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/seo/sua-phat-am-tieng-anh in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/share/progress`  _(kind: auth, landed: /share/progress)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/share/progress in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/signup`  _(kind: public, landed: /signup)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/signup in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/speak`  _(kind: auth, landed: /speak)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/speak in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/speech/history`  _(kind: auth, landed: /speech/history)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/speech/history in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/stories/share`  _(kind: public, landed: /stories/share)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/stories/share in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/support`  _(kind: public, landed: /support)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/support in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/teacher`  _(kind: auth, landed: /teacher)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/teacher in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/terms`  _(kind: public, landed: /terms)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/terms in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/tiers`  _(kind: auth, landed: /tiers)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/tiers in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/unsubscribe`  _(kind: auth, landed: /unsubscribe)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/unsubscribe in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/vocabulary`  _(kind: auth, landed: /vocabulary)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/vocabulary in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/vocabulary/review`  _(kind: auth, landed: /vocabulary/review)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/vocabulary/review in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/weak-at`  _(kind: auth, landed: /weak-at)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/weak-at in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

### `/writing`  _(kind: auth, landed: /writing)_
- **console-error** — Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
  - repro: Open https://mercyblade.com/writing in a logged-out browser and observe: console error: Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

## 🔁 Known-defect reproductions (seeded fixtures)

_(no seeded known defect fired on the crawled routes this run)_

## 🔒 Gated routes (redirected to sign-in as expected)

_(none)_

## ✅ Passing routes

`/`, `/account`, `/account/notifications`, `/account/push-preferences`, `/account/security`, `/admin`, `/admin/access-codes`, `/admin/analytics`, `/admin/audio-coverage`, `/admin/behavioral`, `/admin/cost-monitoring`, `/admin/feature-flags`, `/admin/feedback`, `/admin/feedback-triage`, `/admin/frontend-perf`, `/admin/interview-prompts`, `/admin/latency`, `/admin/payments`, `/admin/pending-sentences`, `/admin/placement-forensics`, `/admin/retention`, `/admin/room-load-diagnostics`, `/admin/slo`, `/admin/stories`, `/admin/subscriptions`, `/admin/teacher-feedback`, `/admin/users`, `/ai-tutor`, `/auth`, `/auth/callback`, `/auth/challenge`, `/auth/recover`, `/auth/save-progress`, `/auth/security`, `/billing`, `/billing/success`, `/blog`, `/blog/weekly-digest`, `/certificates`, `/challenge`, `/challenge/history`, `/chat/addiction_support_free`, `/contribute`, `/contribute/my-submissions`, `/corporate`, `/corporate/join`, `/corporate/setup`, `/culture/vn`, `/exam-prep/ielts/listening`, `/exam-prep/ielts/reading`, `/exam-prep/ielts/speaking`, `/exam-prep/ielts/writing`, `/exam-prep/toefl/listening`, `/exam-prep/toefl/reading`, `/exam-prep/toefl/speaking`, `/exam-prep/toefl/writing`, `/exam-prep/toeic`, `/exam/ielts`, `/exam/ielts/estimator`, `/exam/ielts/listening`, `/exam/ielts/reading`, `/exam/ielts/speaking`, `/exam/ielts/writing`, `/exam/toefl`, `/exam/toefl/estimator`, `/exam/toefl/listening`, `/exam/toefl/reading`, `/exam/toefl/speaking`, `/exam/toefl/writing`, `/exam/toeic`, `/exam/toeic/estimator`, `/exam/vstep`, `/exam/vstep/listening`, `/exam/vstep/reading`, `/exam/vstep/speaking`, `/exam/vstep/writing`, `/family`, `/gift`, `/gift/my`, `/gift/redeem`, `/groups`, `/groups/new`, `/interview`, `/kids/vi-english`, `/languages`, `/languages/arabic`, `/languages/chinese`, `/languages/french`, `/languages/german`, `/languages/hindi`, `/languages/indonesian`, `/languages/italian`, `/languages/japanese`, `/languages/korean`, `/languages/portuguese`, `/languages/punjabi`, `/languages/russian`, `/languages/spanish`, `/languages/swahili`, `/languages/thai`, `/languages/turkish`, `/languages/urdu`, `/languages/vietnamese`, `/leaderboard`, `/leaderboard/referral`, `/legal/content-advisory`, `/legal/privacy`, `/legal/terms`, `/mercy`, `/practice/pronunciation`, `/privacy`, `/professions`, `/professions/customer-service`, `/professions/drivers`, `/professions/healthcare`, `/professions/hospitality`, `/professions/nail-tech`, `/professions/restaurant`, `/professions/tech-worker`, `/progress`, `/promo-code`, `/pronunciation/srs`, `/referral`, `/referral/invite-family`, `/reset-password`, `/roadmap`, `/roleplay`, `/room`, `/room/addiction_support_free`, `/room/room/addiction_support_free`, `/rooms`, `/rooms/room/addiction_support_free`, `/signin`, `/stories`, `/writing-feedback`, `/xp`

## ⏭️ Un-crawlable routes (reported, not silently dropped)

- `/__sentry-smoke-test` — dev-only
- `/admin/slo/:sloId` — unresolvable-param::sloId
- `/blog/:slug` — unresolvable-param::slug
- `/blog/weekly-digest/:weekStart` — unresolvable-param::weekStart
- `/cert/:code` — unresolvable-param::code
- `/culture/vn/:packId` — unresolvable-param::packId
- `/dev/api` — dev-only
- `/dev/audio-test` — dev-only
- `/exam-prep/ielts/listening/:itemId` — unresolvable-param::itemId
- `/exam-prep/ielts/reading/:passageId` — unresolvable-param::passageId
- `/exam-prep/ielts/speaking/:topicId` — unresolvable-param::topicId
- `/exam-prep/ielts/writing/:topicId` — unresolvable-param::topicId
- `/exam-prep/toefl/listening/:itemId` — unresolvable-param::itemId
- `/exam-prep/toefl/reading/:passageId` — unresolvable-param::passageId
- `/exam-prep/toefl/speaking/:topicId` — unresolvable-param::topicId
- `/exam-prep/toefl/writing/:topicId` — unresolvable-param::topicId
- `/exam/toeic/practice/:sectionId` — unresolvable-param::sectionId
- `/groups/:id` — unresolvable-param::id
- `/ielts/writing/topic/:topicId` — unresolvable-param::topicId
- `/interview/:slug` — unresolvable-param::slug
- `/interview/:slug/summary` — unresolvable-param::slug
- `/invite/:token` — unresolvable-param::token
- `/learn/:native/:target` — unresolvable-param::native
- `/learn/:native/english` — unresolvable-param::native
- `/listening/:clipId` — unresolvable-param::clipId
- `/login` — redirect
- `/mock-interview/:scenarioId` — unresolvable-param::scenarioId
- `/parent/:learnerId` — unresolvable-param::learnerId
- `/placement/results/:sessionId` — unresolvable-param::sessionId
- `/placement/test/:sessionId` — unresolvable-param::sessionId
- `/practice/phoneme/:phonemeSlug` — unresolvable-param::phonemeSlug
- `/redeem` — redirect
- `/review/*` — feature-flag-gated
- `/stories/:storyId` — unresolvable-param::storyId
- `/tiers/:tierId` — unresolvable-param::tierId
- `/toeic/practice/:itemId` — unresolvable-param::itemId
- `/u/:username` — unresolvable-param::username
- `/upgrade` — redirect
- `/vstep/speaking/:topicId` — unresolvable-param::topicId
- `/writing/:promptId` — unresolvable-param::promptId
- `review/:itemId` — unresolvable-param::itemId
