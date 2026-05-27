# Your First Contribution

> Walkthrough for shipping your first change to MercyBlade. Written
> like a senior dev showing a junior the ropes — read straight
> through once, refer back to it the next time you sit down to ship
> something.
>
> If you haven't set up locally yet, do
> **[local-setup.md](./local-setup.md)** first. This doc assumes
> `npm run dev` works.

---

## The mindset

Before we open files: a few attitudes that make this repo easier to
work in.

**Small, focused changes.** A 50-line PR that fixes one bug ships in
hours. A 500-line PR that fixes a bug AND refactors the surrounding
area AND adds tests gets stuck in review for a week. Bundle nothing.
`PRINCIPLES.md` §3 is explicit about this.

**Read the code before you change it.** Twenty minutes of reading
saves an hour of writing the wrong fix. The repo has accumulated
load-bearing comments — the file-head block on
`src/lib/roomAudioResolver.ts`, the doctrine block on
`src/router/AnonymousOnboardingGate.tsx`, the dual-invariant note on
`MercySpeakTab.tsx` — and they exist because someone *did* "fix" the
adjacent code without reading them and broke something.

**`CLAUDE.md` is the bug-prevention manual.** The five
non-negotiables aren't aspirational; they're real, enforced, and you
will be asked to revert if you violate one.

**Diagnose, then patch.** Don't write three speculative fixes hoping
one works. Get evidence — logs, sourcemaps, a failing test, a
reproducible click path — *then* fix. Memory:
`feedback_testing_discipline`. The repo has a documented incident
where the same TTS bug was "fixed" three times because each fix was
speculation.

**Verify in the browser.** TypeScript compiling is not the same as
the feature working. For UI changes, the gate is "I clicked the
thing and saw the right thing happen", not "the test runner is
green". `CLAUDE.md` "Doing tasks" calls this out explicitly.

---

## Step 1 — pick a small task

If you have no specific task in mind, good first changes look like:

- A typo or copy fix in a Vietnamese learner-facing string.
- A missing aria-label, accessibility caption, or `alt` text.
- A unit test for an existing pure function that lacks one.
- A doc-only PR (this onboarding doc is a great example —
  improve it).
- A small refactor inside a file you're already reading (with no
  scope creep — see "Smaller is faster" above).

Avoid as a first change:

- **Anything in `src/lib/roomAudioResolver.ts`** — see CLAUDE.md.
- **Anything in `src/main.tsx`** — boot logic, fragile.
- **Anything that touches the Mercy persona** (`src/lib/teacher-mercy/`,
  `src/config/mercyPersona.ts`) — the persona is the brand.
- **Anything in `ios/` or `android/`** — these are mostly
  gitignored; touch only when you have to, and only in the
  pre-submission window. Memory:
  `feedback_native_work_phasing`.
- **Kids mode anything.** CC2's lane unless you're CC2.
- **Schema migrations.** Migrations are Chau-applied via Supabase
  SQL Editor, not via `supabase db push`. Memory:
  `project_db_schema_drift_audit`.

If you're not sure whether your change is "small": say what it is in
one sentence. If that sentence has an "and" in it, split.

---

## Step 2 — set up a worktree

Don't check out a branch in the main repo dir. Use `git worktree`:

```bash
git fetch origin
git worktree add ~/MercyB-fix-foo -b fix/foo origin/main
cd ~/MercyB-fix-foo
```

> **Why worktrees?** Two reasons. (1) If another agent is working in
> the main repo dir, your `git checkout -b` can land their next
> commit on your branch by accident. `PRINCIPLES.md` §13. (2) You
> can have multiple worktrees open at once for parallel
> investigations without re-cloning.

If you'll need `node_modules` (most TS / build / test gates do):

```bash
# Option A — symlink the shared one (fast, works for read-only gate runs)
ln -s /Users/admin/MercyB/node_modules ~/MercyB-fix-foo/node_modules

# Option B — fresh install (required if you changed package.json)
cd ~/MercyB-fix-foo && npm ci
```

Option A is faster but breaks if your change touches `package.json`
(memory: `feedback_stale_shared_node_modules_false_red`). Option B
is always safe. Pick by what your change needs.

---

## Step 3 — read before you write

Before opening the file you intend to change:

```bash
# Where is this thing actually used?
grep -rn "fromTheFunction" src

# What's the file-head doctrine?
head -50 src/lib/<the-file>.ts

# What recently changed here?
git log --oneline -10 -- src/lib/<the-file>.ts
```

If `git log` shows recent activity, read the commit messages. If the
file-head has a "DOCTRINE UPDATE" or "Hard invariant" block, read it
fully. If `grep` shows the function has zero callers, you're
probably about to "fix" dead code (memory:
`feedback_command_permissions` discusses this trap).

For UI changes, also run the dev server in another terminal and
**click through the surface you're about to change**. Take a mental
snapshot of how it works *now*. Your job is to change one specific
thing about it, not redesign it.

---

## Step 4 — make the change

The change itself should feel anticlimactic if you read carefully.
Common patterns:

- **Editing an existing function** — use `Edit` (your editor's
  standard edit), not a full rewrite. Preserve indentation.
- **Adding a new file** — only when the change is genuinely new
  scope. The repo prefers extending existing files over creating
  new ones for related logic.
- **Vietnamese copy changes** — verify against
  `src/lib/onboarding/types.ts:ONBOARDING_COPY` or the relevant
  copy source. We never invent Vietnamese; if you're not sure of
  the right phrasing, ask before guessing. Memory:
  `feedback_email_vietnamese_only` is about emails specifically but
  the principle generalises.

Avoid as you go:

- ❌ **"While I'm here" cleanup.** Tempting, but it bloats the PR
  and slows review. Leave a TODO if needed; ship one thing.
- ❌ **Adding error handling for impossible states.** `CLAUDE.md`
  "Doing tasks" calls this out — don't validate boundaries that
  framework guarantees give you.
- ❌ **Adding comments that explain WHAT the code does.** Names
  should do that. Reserve comments for WHY-this-is-not-obvious
  (workaround for a bug, hidden constraint, etc.). `CLAUDE.md`
  has the full rule.
- ❌ **Premature abstractions.** Three similar lines is better than
  a premature helper.

---

## Step 5 — run the gates

Three commands, run them all:

```bash
npm run typecheck:ci
npm run lint
npm test
```

Note that the typecheck command is **`typecheck:ci`**, not
`typecheck`. The latter excludes config files and CI will reject
type errors it caught.

For UI changes, also:

```bash
npm run dev
# … then click through the change in the browser
```

For room JSON / content changes:

```bash
npm run validate-rooms
```

If any gate fails, **fix it locally**. Don't push and hope CI sorts
itself out — CI runs the same commands and will reject the same way,
just slower. Memory: `feedback_testing_discipline`.

### What about Playwright (e2e)?

Run e2e only when your change touches the routes the e2e suite
covers — placement, room rendering, primary navigation. Otherwise
unit + lint + typecheck is enough.

```bash
npx playwright install   # once, ever — downloads ~200 MB of browsers
npx playwright test       # run all
npx playwright test -g placement   # filter by test name
```

---

## Step 6 — commit

Stage **specific files**, not `git add .`:

```bash
git add src/path/to/the/file.ts src/path/to/the/test.ts
```

`git add -A` and `git add .` are how `.env` files and large binaries
end up in PRs. Be explicit.

Commit with the noreply email and the conventional-commits prefix:

```bash
git -c user.email='239713933+ChauDoan21165@users.noreply.github.com' \
    -c user.name='Chau Doan' \
    commit -m "$(cat <<'EOF'
fix(component): one-line summary

Why this is a fix, not what the fix is — the code shows what.
Reference the issue or behavior, not the implementation detail.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Notes:

- **Use the noreply email** —
  `239713933+ChauDoan21165@users.noreply.github.com`. GitLab rejects
  pushes that expose `cd12536@gmail.com` (the public personal
  email). Memory: `feedback_commit_email_noreply`.
- **Conventional commits prefix** — `feat`, `fix`, `docs`, `chore`,
  `test`, `refactor`. Run `git log --oneline -20` to see the style.
- **Co-Authored-By trailer** — required for AI-assisted commits.
- **HEREDOC for the message** — preserves newlines reliably.
- **One concern per commit.** If you have two unrelated changes,
  make two commits (or two PRs).

If the pre-commit hook rejects your commit, read its output. It
usually points at the specific file. Common causes:

- Filename has a quote or backtick → rename.
- Room JSON is malformed → run `npm run validate-rooms` for the
  fuller diagnostic.

> **Never use `--no-verify`** to skip hooks. The hooks catch real
> issues; bypassing them is how stuff lands in main. `CLAUDE.md`'s
> "Executing actions with care" calls this out.

---

## Step 7 — push and open the merge request

```bash
git push -u origin fix/foo
```

If your dispatch (or the brief from whoever sent you here) said
"push + MR open" upfront, push **without** re-confirming.
`PRINCIPLES.md` §16 — push authorization stands for the scope you
were given. If push was not authorized, stop here and report the
diff for review.

Open the MR via `glab`:

```bash
glab mr create \
  --title "fix(component): one-line summary" \
  --target-branch main \
  --source-branch fix/foo \
  --description "$(cat <<'EOF'
## Summary

- What changed in 1–3 bullets.
- Reference the file paths, not just the abstract behavior.

## Test plan

- [x] `npm run typecheck:ci` — clean.
- [x] `npm run lint` — clean.
- [x] `npm test` — passing.
- [x] Manually verified in the browser at 375 px width.
- [ ] Reviewer eyeball pass.
EOF
)"
```

The MR description matters more than you think — it's how the
reviewer (Chau, or a future you re-reading the history) understands
*why* the change was made.

Things to include:

- **Summary** — 1–3 bullets, file paths cited.
- **Test plan** — what you ran, what's still to verify on a real
  device.

Things to leave out:

- **A diff replay.** Reviewers can read the diff.
- **Marketing copy** — *"This refactor improves maintainability by…"*.
  Just say what changed.

---

## Step 8 — wait, watch, fix

The CI pipeline runs the gates again. Expect them to pass since
they passed locally. If they don't:

- **Read the failure output, not the summary**. CI's "X failed"
  bubble doesn't tell you what.
- **Reproduce locally**. If `npm run typecheck:ci` was green on
  your machine but CI fails it, you forgot to commit a file (most
  common) or your worktree has stale state (run `git status`).
- **Fix in a new commit** on the same branch. Don't `git commit
  --amend` once the MR is open — your reviewer needs to see the
  before/after.

Once CI is green, the MR sits until Chau (or whoever reviews) merges
it. Don't keep pinging; don't `--force-push` "just to be safe".
Memory: `feedback_branch_hygiene` and the general git-safety rules
in `CLAUDE.md`.

If the reviewer comments:

- **Read the comment fully**. If it's a question, answer it; if it's
  a request, make the change.
- **Push the response as a new commit**. Reviewers re-review the
  delta, not the whole branch.

---

## Step 9 — after merge

```bash
git checkout main
git pull
```

If you used a worktree, you can remove it now:

```bash
cd ~/MercyB
git worktree remove ~/MercyB-fix-foo
```

If you're going to keep working on related changes, **don't** reuse
the same branch — start a new one off the now-up-to-date `main`.
Memory: `feedback_stacked_pr_squash_orphan`.

---

## Things that go wrong (a non-exhaustive list)

A short field guide to the failures other contributors have hit.

### "I pushed and now my branch shows ahead by 12 commits"

You based off a stale local `main`. Fix:

```bash
git fetch origin
git rebase origin/main
```

If conflicts, resolve, continue the rebase, re-push (if not yet
opened MR; otherwise just push and let the MR pick up the rebase).

### "The merge request says 'source branch does not exist'"

You didn't actually push. Run `git push -u origin <branch>` first.
(Common with stale tracking-branch state — `git status` can claim
"up to date" against a remote ref that no longer exists.)

### "CI failed but the test passes locally"

- You're on the wrong Node version. CI runs Node 22. Run `node -v`.
- You forgot to commit a file. `git status` in the worktree.
- You used `npm run typecheck` instead of `npm run typecheck:ci`.

### "I made the change but the UI didn't change"

- Hot reload isn't picking up — usually a syntax error. Check the
  terminal where `npm run dev` is running.
- You edited the wrong file. Use `grep` to find which file actually
  renders the surface.
- You're looking at the wrong port. `--strictPort` is 3107; if you
  see 3108, kill the process and restart.

### "My MR was rejected because it touched something it shouldn't"

The five non-negotiables in `CLAUDE.md` are absolute. If your "fix"
violated one (most common: re-localized kids/music audio; touched
`ios/Info.plist` outside the submission window; added a streak
guilt-trip CTA), the right move is to back out that piece and ship
the rest separately.

### "I committed `.env.local` by accident"

Bad news: do NOT push. The fix is:

```bash
git reset HEAD~1 -- .env.local   # un-stage
git restore --staged .env.local
echo .env.local >> .gitignore    # if it isn't already
git add .gitignore
git commit --amend --no-edit
```

Then verify with `git show HEAD --stat` that `.env.local` is not
in the commit. If you already pushed, alert Chau immediately —
secrets need to be rotated.

### "The dev server keeps showing stale content"

Two suspects:

1. **Browser cache** — `Cmd+Shift+R` to hard-reload, or open in an
   incognito tab.
2. **Worktree node_modules out of sync with `package.json`** —
   memory: `feedback_stale_shared_node_modules_false_red`. Run
   `rm node_modules && npm ci` in your worktree.

---

## What a successful first contribution looks like

A real example, abbreviated:

> *"Fix: aria-label missing on the audio play button in
> `KidsRoomCard.tsx`. Found while testing the kids page with a screen
> reader. One-line attribute change. typecheck:ci + lint + npm test
> all green; visually verified the button still plays. MR
> description points at the line; test plan lists what I ran. Push
> + open MR. Merged within a day."*

That's the template. Small. Specific. Verified. One concern. Read
the file before writing. Run the gates. Ship.

After three or four PRs of that shape, you'll start spotting bigger
opportunities. The repo notices small, careful contributors and
gives them more interesting work.

---

## When you get stuck

The order to ask:

1. **Re-read the relevant doc.** `CLAUDE.md` is the bug-prevention
   manual; if something feels weird, it's probably explained there.
2. **Look at the file's `git log -p`.** History tells you why the
   code looks the way it does.
3. **Search the `docs/` tree.** Many one-off discoveries got
   documented after the fact — `docs/session-summaries/`,
   `docs/runbooks/`, the `reports/` directory.
4. **Open an exploratory MR with `[WIP]`** in the title and ask in
   the description. Better to discover the wrong direction in 5
   files than 500.

Don't:

- Push speculative fixes.
- "Improve" code paths you haven't read.
- Refactor on a first contribution.
- Touch the kids surface if you aren't on the kids lane.
- Bypass hooks with `--no-verify`.

---

## You're ready

You have local setup working, you've picked a small change, you've
read this doc end-to-end. Open your worktree and start.

The first PR is the hardest. The second is half the effort. By the
fifth, you've internalized the rhythm and the gates run on autopilot.

Welcome aboard.
