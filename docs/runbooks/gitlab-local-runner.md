# GitLab Local Runner Validation

MercyB heavy validation jobs run on the local Mac runner only when the
job explicitly requests all three tags:

- `local`
- `mac`
- `mercyb`

Keep the local runner setting **Run untagged jobs** disabled. The CI file
does not rely on untagged pickup for local execution, and enabling it can
make the Mac runner catch unrelated jobs.

Shared-runner fallback jobs are intentionally separate and untagged. To
use them, start a pipeline with:

```text
MERCYB_SHARED_RUNNER_FALLBACK=1
```

That variable suppresses the tagged local jobs and exposes manual
`*:shared-fallback` jobs instead. Approve those manual jobs only when the
local runner is unavailable or intentionally bypassed.

For merge requests, heavy jobs use `rules:changes` so docs-only or
unrelated changes do not spend local runner time. Pushes to `main`,
`develop`, and `release/*` still run full validation regardless of the
diff shape.
