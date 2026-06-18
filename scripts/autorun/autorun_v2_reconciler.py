#!/usr/bin/env python3
"""MercyBlade autorun V2 SQLite reconciler.

SQLite is the source of truth. The legacy autorun folders are imported as
display/migration inputs only; this script does not move old job files.
"""

from __future__ import annotations

import argparse
import datetime as dt
import fnmatch
import json
import os
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import time
from urllib.parse import quote
from pathlib import Path
from typing import Iterable


VALID_STATUSES = {"ready", "running", "done", "failed", "held"}
DEFAULT_MAX_ATTEMPTS = 2
DEFAULT_FORBIDDEN_PATHS = [
    ".env",
    ".env.*",
    "netlify.toml",
    "wrangler.toml",
    "wrangler.json",
    "wrangler.jsonc",
    "src/billing/",
    "src/store/",
    "supabase/migrations/",
    "supabase/functions/_billing/",
]


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def home_path(*parts: str) -> Path:
    return Path.home().joinpath(*parts)


def env_path(name: str, default: Path) -> Path:
    return Path(os.environ.get(name, str(default))).expanduser()


def db_path(args: argparse.Namespace) -> Path:
    return Path(args.db).expanduser() if args.db else env_path("AUTORUN_V2_DB", home_path("autorun", "jobs.db"))


def root_path(args: argparse.Namespace) -> Path:
    return Path(args.root).expanduser() if args.root else env_path("AUTORUN_V2_ROOT", home_path("autorun"))


def repo_path(args: argparse.Namespace) -> Path:
    return Path(args.repo).expanduser() if args.repo else env_path("AUTORUN_V2_REPO", home_path("MercyB"))


def connect(path: Path) -> sqlite3.Connection:
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    init_schema(conn)
    return conn


def init_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          artifact TEXT NOT NULL,
          branch TEXT,
          brief TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('ready','running','done','failed','held')),
          source_bucket TEXT,
          source_path TEXT,
          attempts INTEGER NOT NULL DEFAULT 0,
          max_attempts INTEGER NOT NULL DEFAULT 2,
          pid INTEGER,
          pgid INTEGER,
          log_path TEXT,
          last_error TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          imported_at TEXT,
          started_at TEXT,
          finished_at TEXT,
          last_verified_at TEXT,
          declared_artifact TEXT,
          declared_branch TEXT,
          actual_artifact TEXT,
          actual_branch TEXT,
          allowed_paths TEXT,
          forbidden_paths TEXT,
          verification_status TEXT,
          mismatch_reason TEXT,
          machine_id TEXT,
          ci_artifact_branch TEXT,
          ci_pipeline_url TEXT,
          ci_merge_request_url TEXT,
          ci_handoff_at TEXT,
          ci_handoff_error TEXT
        );

        CREATE TABLE IF NOT EXISTS job_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id TEXT NOT NULL,
          event TEXT NOT NULL,
          old_status TEXT,
          new_status TEXT,
          message TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
        CREATE INDEX IF NOT EXISTS idx_tasks_next_ready ON tasks(status, created_at, id);
        CREATE INDEX IF NOT EXISTS idx_job_history_task ON job_history(task_id, created_at);
        """
    )
    ensure_column(conn, "tasks", "ci_artifact_branch", "TEXT")
    ensure_column(conn, "tasks", "ci_pipeline_url", "TEXT")
    ensure_column(conn, "tasks", "ci_merge_request_url", "TEXT")
    ensure_column(conn, "tasks", "ci_handoff_at", "TEXT")
    ensure_column(conn, "tasks", "ci_handoff_error", "TEXT")
    ensure_column(conn, "tasks", "declared_artifact", "TEXT")
    ensure_column(conn, "tasks", "declared_branch", "TEXT")
    ensure_column(conn, "tasks", "actual_artifact", "TEXT")
    ensure_column(conn, "tasks", "actual_branch", "TEXT")
    ensure_column(conn, "tasks", "allowed_paths", "TEXT")
    ensure_column(conn, "tasks", "forbidden_paths", "TEXT")
    ensure_column(conn, "tasks", "verification_status", "TEXT")
    ensure_column(conn, "tasks", "mismatch_reason", "TEXT")
    ensure_column(conn, "tasks", "machine_id", "TEXT")
    conn.commit()


def ensure_column(conn: sqlite3.Connection, table: str, column: str, definition: str) -> None:
    existing = {row["name"] for row in conn.execute(f"PRAGMA table_info({table})").fetchall()}
    if column not in existing:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def history(
    conn: sqlite3.Connection,
    task_id: str,
    event: str,
    old_status: str | None,
    new_status: str | None,
    message: str = "",
) -> None:
    conn.execute(
        """
        INSERT INTO job_history(task_id, event, old_status, new_status, message, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (task_id, event, old_status, new_status, message[:2000], utc_now()),
    )


def split_paths(raw: str | None) -> list[str]:
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return [str(item).strip() for item in parsed if str(item).strip()]
    except json.JSONDecodeError:
        pass
    return [part.strip() for part in raw.split(",") if part.strip()]


def json_list(paths: list[str]) -> str:
    return json.dumps(paths, sort_keys=True, separators=(",", ":"))


def default_allowed_paths(artifact: str) -> list[str]:
    return [artifact, ".autorun/task.json", ".autorun/result.template.json", ".autorun/result.json"]


def parse_job(path: Path) -> tuple[str, str | None, str, list[str], list[str], str | None]:
    text = path.read_text(encoding="utf-8", errors="replace")
    artifact = ""
    branch = None
    allowed_paths: list[str] = []
    forbidden_paths: list[str] = []
    machine_id = None
    brief_lines: list[str] = []
    for line in text.splitlines():
        if line.startswith("ARTIFACT="):
            artifact = line.split("=", 1)[1].strip()
        elif line.startswith("BRANCH="):
            branch = line.split("=", 1)[1].strip() or None
        elif line.startswith("DECLARED_ARTIFACT="):
            artifact = line.split("=", 1)[1].strip()
        elif line.startswith("DECLARED_BRANCH="):
            branch = line.split("=", 1)[1].strip() or None
        elif line.startswith("ALLOWED_PATHS="):
            allowed_paths = split_paths(line.split("=", 1)[1].strip())
        elif line.startswith("FORBIDDEN_PATHS="):
            forbidden_paths = split_paths(line.split("=", 1)[1].strip())
        elif line.startswith("MACHINE_ID="):
            machine_id = line.split("=", 1)[1].strip() or None
        else:
            brief_lines.append(line)
    brief = "\n".join(brief_lines).strip()
    if not artifact or not brief:
        raise ValueError("job needs ARTIFACT= and non-empty brief")
    if not allowed_paths:
        allowed_paths = default_allowed_paths(artifact)
    if not forbidden_paths:
        forbidden_paths = DEFAULT_FORBIDDEN_PATHS
    return artifact, branch, brief, allowed_paths, forbidden_paths, machine_id


def status_from_bucket(bucket: str) -> str:
    if bucket in {"ready", "queue"}:
        return "ready"
    if bucket == "done":
        return "done"
    if bucket == "held":
        return "held"
    if bucket == "failed":
        return "failed"
    raise ValueError(f"unsupported bucket: {bucket}")


def iter_job_files(root: Path, buckets: Iterable[str]) -> Iterable[tuple[str, Path]]:
    for bucket in buckets:
        folder = root / bucket
        if not folder.exists():
            continue
        for path in sorted(folder.iterdir()):
            if path.is_file() and ".job" in path.name:
                yield bucket, path


def import_folders(args: argparse.Namespace) -> int:
    root = root_path(args)
    conn = connect(db_path(args))
    buckets = ["ready", "queue", "failed", "held", "done"] if args.all_buckets else ["ready", "queue"]
    imported = 0
    skipped = 0
    for bucket, path in iter_job_files(root, buckets):
        task_id = path.name
        try:
            artifact, branch, brief, allowed_paths, forbidden_paths, machine_id = parse_job(path)
        except ValueError as exc:
            skipped += 1
            print(f"skip {path}: {exc}", file=sys.stderr)
            continue
        now = utc_now()
        status = status_from_bucket(bucket)
        conn.execute(
            """
            INSERT INTO tasks(
              id, artifact, branch, brief, status, source_bucket, source_path,
              attempts, max_attempts, created_at, updated_at, imported_at,
              declared_artifact, declared_branch, allowed_paths, forbidden_paths,
              machine_id, verification_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
            ON CONFLICT(id) DO UPDATE SET
              artifact=excluded.artifact,
              branch=excluded.branch,
              brief=excluded.brief,
              source_bucket=excluded.source_bucket,
              source_path=excluded.source_path,
              declared_artifact=excluded.declared_artifact,
              declared_branch=excluded.declared_branch,
              allowed_paths=excluded.allowed_paths,
              forbidden_paths=excluded.forbidden_paths,
              machine_id=excluded.machine_id,
              updated_at=excluded.updated_at,
              imported_at=excluded.imported_at
            """,
            (
                task_id,
                artifact,
                branch,
                brief,
                status,
                bucket,
                str(path),
                args.max_attempts,
                now,
                now,
                now,
                artifact,
                branch,
                json_list(allowed_paths),
                json_list(forbidden_paths),
                machine_id,
            ),
        )
        history(conn, task_id, "import", None, status, f"imported from {bucket}: {path}")
        imported += 1
    conn.commit()
    print(f"imported={imported} skipped={skipped} db={db_path(args)} root={root}")
    return 0


def process_alive(pid: int | None, pgid: int | None) -> bool:
    targets: list[tuple[int, int]] = []
    if pgid:
        targets.append((-int(pgid), int(pgid)))
    if pid:
        targets.append((int(pid), int(pid)))
    for kill_target, _ in targets:
        try:
            os.kill(kill_target, 0)
            return True
        except ProcessLookupError:
            continue
        except PermissionError:
            return True
        except OSError:
            continue
    return False


def codex_running() -> bool:
    if os.environ.get("AUTORUN_V2_IGNORE_CODEX_RUNNING") == "1":
        return False
    proc = subprocess.run(
        ["ps", "-axo", "pid=,pgid=,command="],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        check=False,
    )
    this_pid = os.getpid()
    for line in proc.stdout.splitlines():
        parts = line.strip().split(None, 2)
        if len(parts) < 3:
            continue
        try:
            pid = int(parts[0])
        except ValueError:
            continue
        command = parts[2]
        if pid == this_pid:
            continue
        if "codex" in command and " exec" in f" {command}":
            return True
    return False


def git_fetch(repo: Path) -> None:
    proc = subprocess.run(["git", "fetch", "origin", "--quiet"], cwd=repo, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout or "git fetch failed").strip())


def remote_artifact_exists(repo: Path, branch: str | None, artifact: str) -> bool:
    if not branch:
        return False
    proc = subprocess.run(
        ["git", "ls-tree", f"origin/{branch}", artifact],
        cwd=repo,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    return proc.returncode == 0 and bool(proc.stdout.strip())


def run_git(repo: Path, args: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    proc = subprocess.run(
        ["git", *args],
        cwd=repo,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if check and proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout or f"git {' '.join(args)} failed").strip())
    return proc


def task_declared_artifact(task: sqlite3.Row) -> str:
    return task["declared_artifact"] or task["artifact"]


def task_declared_branch(task: sqlite3.Row) -> str | None:
    return task["declared_branch"] or task["branch"]


def task_allowed_paths(task: sqlite3.Row) -> list[str]:
    paths = split_paths(task["allowed_paths"])
    artifact = task_declared_artifact(task)
    return paths or default_allowed_paths(artifact)


def task_forbidden_paths(task: sqlite3.Row) -> list[str]:
    return split_paths(task["forbidden_paths"]) or DEFAULT_FORBIDDEN_PATHS


def safe_task_id(task_id: str) -> str:
    return "".join(ch if ch.isalnum() or ch in ".-_" else "_" for ch in task_id)


def worktree_path(root: Path, task_id: str) -> Path:
    return root / "worktrees" / safe_task_id(task_id)


def path_matches(path: str, rule: str) -> bool:
    normalized = path.strip().lstrip("./")
    pattern = rule.strip().lstrip("./")
    if not pattern:
        return False
    if any(ch in pattern for ch in "*?[]"):
        return fnmatch.fnmatch(normalized, pattern)
    if pattern.endswith("/"):
        return normalized.startswith(pattern)
    return normalized == pattern


def path_allowed(path: str, allowed_paths: list[str]) -> bool:
    return any(path_matches(path, rule) for rule in allowed_paths)


def changed_paths(repo: Path) -> list[str]:
    tracked = run_git(repo, ["diff", "--name-only", "HEAD"]).stdout.splitlines()
    untracked = run_git(repo, ["ls-files", "--others", "--exclude-standard"]).stdout.splitlines()
    return sorted({path for path in [*tracked, *untracked] if path})


def current_branch(repo: Path) -> str:
    return run_git(repo, ["branch", "--show-current"]).stdout.strip()


def clean_worktree(repo: Path) -> bool:
    return not run_git(repo, ["status", "--porcelain=v1"]).stdout.strip()


def ensure_clean_origin_worktree(repo: Path, worktree: Path, branch: str) -> None:
    if worktree.exists():
        run_git(repo, ["worktree", "remove", "--force", str(worktree)], check=False)
        if worktree.exists():
            shutil.rmtree(worktree)
    worktree.parent.mkdir(parents=True, exist_ok=True)
    run_git(repo, ["worktree", "add", "--detach", str(worktree), "origin/main"])
    run_git(worktree, ["checkout", "-B", branch, "origin/main"])
    if not clean_worktree(worktree):
        raise RuntimeError(f"new worktree is not clean: {worktree}")


def write_manifest_files(worktree: Path, task: sqlite3.Row) -> None:
    declared_artifact = task_declared_artifact(task)
    declared_branch = task_declared_branch(task)
    manifest_dir = worktree / ".autorun"
    manifest_dir.mkdir(parents=True, exist_ok=True)
    task_payload = {
        "schema_version": "2.2",
        "task_id": task["id"],
        "declared_artifact": declared_artifact,
        "declared_branch": declared_branch,
        "allowed_paths": task_allowed_paths(task),
        "forbidden_paths": task_forbidden_paths(task),
        "machine_id": task["machine_id"] or os.environ.get("AUTORUN_V2_MACHINE_ID") or os.uname().nodename,
        "brief": task["brief"],
    }
    result_template = {
        "schema_version": "2.2",
        "task_id": task["id"],
        "actual_artifact": declared_artifact,
        "actual_branch": declared_branch,
        "status": "done",
        "summary": "",
        "notes": "",
    }
    (manifest_dir / "task.json").write_text(json.dumps(task_payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    (manifest_dir / "result.template.json").write_text(
        json.dumps(result_template, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def codex_prompt(task: sqlite3.Row) -> str:
    return f"""Read .autorun/task.json.
Write only the declared artifact and .autorun/result.json.
Do not git checkout.
Do not git push.
Do not change branch names.

Task brief:
{task['brief']}
"""


def load_result_json(worktree: Path) -> dict[str, object]:
    result_path = worktree / ".autorun" / "result.json"
    if not result_path.exists():
        raise ValueError(".autorun/result.json is missing")
    with result_path.open("r", encoding="utf-8") as handle:
        result = json.load(handle)
    if not isinstance(result, dict):
        raise ValueError(".autorun/result.json must contain a JSON object")
    return result


def verify_worktree(worktree: Path, task: sqlite3.Row) -> tuple[str, str]:
    declared_artifact = task_declared_artifact(task)
    declared_branch = task_declared_branch(task)
    if not declared_branch:
        raise ValueError("declared_branch is required")
    result = load_result_json(worktree)
    actual_artifact = str(result.get("actual_artifact") or "")
    actual_branch = str(result.get("actual_branch") or "")
    if actual_artifact != declared_artifact:
        raise ValueError(f"actual_artifact mismatch: declared={declared_artifact} actual={actual_artifact}")
    if actual_branch and actual_branch != declared_branch:
        raise ValueError(f"actual_branch mismatch: declared={declared_branch} actual={actual_branch}")
    git_branch = current_branch(worktree)
    if git_branch != declared_branch:
        raise ValueError(f"git branch mismatch: declared={declared_branch} actual={git_branch}")
    changed = changed_paths(worktree)
    allowed = task_allowed_paths(task)
    forbidden = task_forbidden_paths(task)
    disallowed = [path for path in changed if not path_allowed(path, allowed)]
    forbidden_touched = [path for path in changed if any(path_matches(path, rule) for rule in forbidden)]
    if disallowed:
        raise ValueError(f"git diff contains paths outside allowed_paths: {', '.join(disallowed)}")
    if forbidden_touched:
        raise ValueError(f"forbidden paths touched: {', '.join(forbidden_touched)}")
    if not (worktree / declared_artifact).exists():
        raise ValueError(f"declared artifact missing on disk: {declared_artifact}")
    return actual_artifact, actual_branch or git_branch


def commit_and_push_verified(worktree: Path, task: sqlite3.Row) -> None:
    declared_branch = task_declared_branch(task)
    if not declared_branch:
        raise ValueError("declared_branch is required")
    run_git(worktree, ["add", "-A"])
    if not changed_paths(worktree):
        raise ValueError("no changes to commit after verification")
    run_git(worktree, ["commit", "-m", f"Automation V2.2 artifact {task['id']}"])
    # Branch ceiling: refuse to push if too many unmerged ops/ branches exist
    import subprocess as _sp
    _ceiling = _sp.run(
        ["git", "branch", "-r", "--no-merged", "origin/main"],
        capture_output=True, text=True, cwd=str(worktree),
    )
    _unmerged_ops = [b for b in _ceiling.stdout.splitlines() if "/ops/" in b]
    if len(_unmerged_ops) >= 10:
        raise RuntimeError(f"branch ceiling: {len(_unmerged_ops)} unmerged ops/ branches on origin (max 10), refusing push")
    run_git(worktree, ["push", "origin", f"HEAD:refs/heads/{declared_branch}"])


def transition(
    conn: sqlite3.Connection,
    task: sqlite3.Row,
    new_status: str,
    event: str,
    message: str = "",
    **fields: object,
) -> None:
    if new_status not in VALID_STATUSES:
        raise ValueError(f"bad status: {new_status}")
    old_status = task["status"]
    updates = {"status": new_status, "updated_at": utc_now(), **fields}
    assignments = ", ".join(f"{key}=?" for key in updates)
    values = list(updates.values())
    values.append(task["id"])
    conn.execute(f"UPDATE tasks SET {assignments} WHERE id=?", values)
    history(conn, task["id"], event, old_status, new_status, message)


def run_glab_api(repo: Path, args: list[str]) -> dict[str, object] | list[object] | None:
    if not shutil.which("glab"):
        raise RuntimeError("glab not found")
    proc = subprocess.run(
        ["glab", "api", *args],
        cwd=repo,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout or "glab api failed").strip())
    output = proc.stdout.strip()
    if not output:
        return None
    return json.loads(output)


def gitlab_project(repo: Path) -> str:
    env_project = os.environ.get("AUTORUN_V2_GITLAB_PROJECT")
    if env_project:
        return quote(env_project, safe="")
    proc = subprocess.run(
        ["git", "remote", "get-url", "origin"],
        cwd=repo,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or "cannot resolve git origin").strip())
    remote = proc.stdout.strip()
    if remote.startswith("git@gitlab.com:"):
        project = remote.split(":", 1)[1]
    elif "gitlab.com/" in remote:
        project = remote.split("gitlab.com/", 1)[1]
    else:
        raise RuntimeError(f"cannot resolve GitLab project from origin URL: {remote}")
    if project.endswith(".git"):
        project = project[:-4]
    return quote(project.strip("/"), safe="")


def first_url(payload: object, key: str = "web_url") -> str | None:
    if isinstance(payload, dict):
        value = payload.get(key)
        return str(value) if value else None
    if isinstance(payload, list) and payload:
        return first_url(payload[0], key)
    return None


def create_or_find_mr(repo: Path, task: sqlite3.Row, branch: str) -> str:
    project = gitlab_project(repo)
    existing = run_glab_api(
        repo,
        [
            f"projects/{project}/merge_requests?state=opened&source_branch={quote(branch, safe='')}",
        ],
    )
    existing_url = first_url(existing)
    if existing_url:
        return existing_url

    title = f"Draft: Automation V2 artifact {task['id']}"
    payload = run_glab_api(
        repo,
        [
            f"projects/{project}/merge_requests",
            "--method",
            "POST",
            "-F",
            f"source_branch={branch}",
            "-F",
            "target_branch=main",
            "-F",
            f"title={title}",
            "-F",
            "remove_source_branch=false",
        ],
    )
    url = first_url(payload)
    if not url:
        raise RuntimeError("glab api created MR without web_url")
    return url


def ci_handoff_for_task(conn: sqlite3.Connection, repo: Path, task: sqlite3.Row) -> None:
    if os.environ.get("AUTORUN_V2_ENABLE_CI_HANDOFF") != "1":
        message = "automatic CI handoff disabled; Admin handles MR or CI"
        conn.execute(
            "UPDATE tasks SET ci_handoff_error=?, updated_at=? WHERE id=?",
            (message, utc_now(), task["id"]),
        )
        history(conn, task["id"], "ci_handoff_skipped", task["status"], task["status"], message)
        return
    branch = task["ci_artifact_branch"] or task_declared_branch(task)
    if not branch:
        message = "no artifact branch recorded"
        conn.execute(
            "UPDATE tasks SET ci_handoff_error=?, updated_at=? WHERE id=?",
            (message, utc_now(), task["id"]),
        )
        history(conn, task["id"], "ci_handoff_skipped", task["status"], task["status"], message)
        return

    now = utc_now()
    try:
        project = gitlab_project(repo)
        pipeline = run_glab_api(repo, [f"projects/{project}/pipeline", "--method", "POST", "-F", f"ref={branch}"])
        pipeline_url = first_url(pipeline)
        if not pipeline_url:
            raise RuntimeError("glab api created pipeline without web_url")
        conn.execute(
            """
            UPDATE tasks
            SET ci_artifact_branch=?, ci_pipeline_url=?, ci_handoff_at=?, ci_handoff_error=NULL, updated_at=?
            WHERE id=?
            """,
            (branch, pipeline_url, now, now, task["id"]),
        )
        history(conn, task["id"], "ci_pipeline_triggered", task["status"], task["status"], pipeline_url)
        return
    except Exception as pipeline_exc:  # noqa: BLE001 - fallback is the required behavior.
        pipeline_error = str(pipeline_exc)

    try:
        mr_url = create_or_find_mr(repo, task, branch)
        conn.execute(
            """
            UPDATE tasks
            SET ci_artifact_branch=?, ci_merge_request_url=?, ci_handoff_at=?, ci_handoff_error=NULL, updated_at=?
            WHERE id=?
            """,
            (branch, mr_url, now, now, task["id"]),
        )
        history(
            conn,
            task["id"],
            "ci_mr_created",
            task["status"],
            task["status"],
            f"{mr_url}; pipeline fallback reason: {pipeline_error}",
        )
    except Exception as mr_exc:  # noqa: BLE001 - keep task done and surface retryable handoff error.
        message = f"pipeline failed: {pipeline_error}; MR failed: {mr_exc}"
        conn.execute(
            """
            UPDATE tasks
            SET ci_artifact_branch=?, ci_handoff_error=?, updated_at=?
            WHERE id=?
            """,
            (branch, message[:2000], utc_now(), task["id"]),
        )
        history(conn, task["id"], "ci_handoff_failed", task["status"], task["status"], message)


def mark_done(
    conn: sqlite3.Connection,
    repo: Path,
    task: sqlite3.Row,
    event: str,
    message: str,
    *,
    branch: str | None = None,
    artifact: str | None = None,
    **fields: object,
) -> None:
    done_branch = branch or task_declared_branch(task)
    updates = {
        "pid": None,
        "pgid": None,
        "finished_at": utc_now(),
        "last_error": None,
        "last_verified_at": utc_now(),
        "verification_status": "verified",
        "mismatch_reason": None,
        "ci_artifact_branch": done_branch,
        "ci_handoff_error": None,
        **fields,
    }
    if branch and branch != task["branch"]:
        updates["branch"] = branch
    if artifact and artifact != task["artifact"]:
        updates["artifact"] = artifact
    transition(conn, task, "done", event, message, **updates)
    fresh = conn.execute("SELECT * FROM tasks WHERE id=?", (task["id"],)).fetchone()
    if fresh:
        ci_handoff_for_task(conn, repo, fresh)


def write_notification(root: Path, task_id: str, message: str) -> Path:
    notify_dir = root / "notifications"
    notify_dir.mkdir(parents=True, exist_ok=True)
    path = notify_dir / f"{task_id}.held.txt"
    path.write_text(f"{utc_now()} {task_id} HELD {message}\n", encoding="utf-8")
    return path


def heal_or_retry_terminal(conn: sqlite3.Connection, root: Path, repo: Path, task: sqlite3.Row) -> None:
    if task["verification_status"] == "verified":
        return
    attempts = int(task["attempts"] or 0)
    max_attempts = int(task["max_attempts"] or DEFAULT_MAX_ATTEMPTS)
    if attempts < max_attempts:
        transition(
            conn,
            task,
            "ready",
            "retry_ready",
            f"strict verification not yet successful; attempts {attempts}/{max_attempts}",
            pid=None,
            pgid=None,
            last_verified_at=utc_now(),
            verification_status=None,
        )
    else:
        note = write_notification(root, task["id"], f"strict verification not successful after {attempts}/{max_attempts} attempts")
        transition(
            conn,
            task,
            "held",
            "attempts_exhausted",
            f"strict verification not successful; notification={note}",
            pid=None,
            pgid=None,
            finished_at=utc_now(),
            last_error=f"strict verification not successful after {attempts}/{max_attempts} attempts",
            last_verified_at=utc_now(),
        )


def reconcile_running(conn: sqlite3.Connection, root: Path, repo: Path) -> None:
    for task in conn.execute("SELECT * FROM tasks WHERE status='running' ORDER BY started_at, id").fetchall():
        if process_alive(task["pid"], task["pgid"]):
            continue
        worktree = worktree_path(root, task["id"])
        try:
            actual_artifact, actual_branch = verify_worktree(worktree, task)
            commit_and_push_verified(worktree, task)
            mark_done(
                conn,
                repo,
                task,
                "strict_verification_pushed",
                f"verified and pushed origin/{task_declared_branch(task)} {task_declared_artifact(task)}",
                branch=actual_branch,
                artifact=actual_artifact,
                actual_artifact=actual_artifact,
                actual_branch=actual_branch,
            )
            continue
        except Exception as exc:  # noqa: BLE001 - mismatch must be local and pre-push.
            mismatch = str(exc)
        attempts = int(task["attempts"] or 0)
        max_attempts = int(task["max_attempts"] or DEFAULT_MAX_ATTEMPTS)
        if attempts < max_attempts:
            transition(
                conn,
                task,
                "ready",
                "strict_verification_retry",
                f"pid={task['pid']} pgid={task['pgid']} dead; verification failed; attempts {attempts}/{max_attempts}: {mismatch}",
                pid=None,
                pgid=None,
                last_error=mismatch,
                last_verified_at=utc_now(),
                verification_status="mismatch",
                mismatch_reason=mismatch,
            )
        else:
            note = write_notification(root, task["id"], f"strict verification failed after {attempts}/{max_attempts} attempts: {mismatch}")
            transition(
                conn,
                task,
                "held",
                "running_dead_held",
                f"pid={task['pid']} pgid={task['pgid']} dead; notification={note}",
                pid=None,
                pgid=None,
                finished_at=utc_now(),
                last_error=mismatch,
                last_verified_at=utc_now(),
                verification_status="mismatch",
                mismatch_reason=mismatch,
            )


def reconcile_failed_and_held(conn: sqlite3.Connection, root: Path, repo: Path) -> None:
    rows = conn.execute(
        "SELECT * FROM tasks WHERE status IN ('failed','held') ORDER BY updated_at, id"
    ).fetchall()
    for task in rows:
        heal_or_retry_terminal(conn, root, repo, task)


def codex_command() -> list[str]:
    raw = os.environ.get("AUTORUN_V2_CODEX")
    if raw:
        return raw.split()
    return ["codex"]


def start_ready_task(conn: sqlite3.Connection, root: Path, repo: Path, model: str) -> bool:
    task = conn.execute("SELECT * FROM tasks WHERE status='ready' ORDER BY created_at, id LIMIT 1").fetchone()
    if not task:
        return False
    declared_branch = task_declared_branch(task)
    if not declared_branch:
        transition(
            conn,
            task,
            "held",
            "missing_declared_branch",
            "declared_branch is required for Automation V2.2",
            pid=None,
            pgid=None,
            finished_at=utc_now(),
            last_error="declared_branch is required",
            verification_status="mismatch",
            mismatch_reason="declared_branch is required",
        )
        return False
    if codex_running():
        return False
    running_count = conn.execute("SELECT COUNT(*) FROM tasks WHERE status='running'").fetchone()[0]
    if running_count:
        return False

    logs_dir = root / "logs"
    logs_dir.mkdir(parents=True, exist_ok=True)
    safe_id = safe_task_id(task["id"])
    log_path = logs_dir / f"{safe_id}.log"
    worktree = worktree_path(root, task["id"])
    try:
        ensure_clean_origin_worktree(repo, worktree, declared_branch)
        write_manifest_files(worktree, task)
    except Exception as exc:  # noqa: BLE001 - recorded for operator visibility.
        attempts = int(task["attempts"] or 0) + 1
        max_attempts = int(task["max_attempts"] or DEFAULT_MAX_ATTEMPTS)
        next_status = "ready" if attempts < max_attempts else "held"
        transition(
            conn,
            task,
            next_status,
            "worktree_prepare_failed",
            str(exc),
            attempts=attempts,
            last_error=str(exc),
            verification_status="mismatch",
            mismatch_reason=str(exc),
        )
        return False

    cmd = codex_command() + ["--model", model, "--sandbox", "danger-full-access", "exec", codex_prompt(task)]
    log_handle = log_path.open("ab")
    try:
        proc = subprocess.Popen(
            cmd,
            cwd=worktree,
            stdout=log_handle,
            stderr=subprocess.STDOUT,
            stdin=subprocess.DEVNULL,
            start_new_session=True,
            close_fds=True,
        )
    except Exception as exc:  # noqa: BLE001 - recorded for operator visibility.
        log_handle.close()
        attempts = int(task["attempts"] or 0) + 1
        max_attempts = int(task["max_attempts"] or DEFAULT_MAX_ATTEMPTS)
        next_status = "ready" if attempts < max_attempts else "held"
        note = ""
        if next_status == "held":
            note = f"; notification={write_notification(root, task['id'], f'spawn failed: {exc}')}"
        transition(
            conn,
            task,
            next_status,
            "spawn_failed",
            f"{exc}{note}",
            attempts=attempts,
            last_error=str(exc),
            log_path=str(log_path),
        )
        return False
    finally:
        try:
            log_handle.close()
        except Exception:
            pass

    pgid = os.getpgid(proc.pid)
    transition(
        conn,
        task,
        "running",
        "spawned",
        f"pid={proc.pid} pgid={pgid} log={log_path}",
        attempts=int(task["attempts"] or 0) + 1,
        pid=proc.pid,
        pgid=pgid,
        log_path=str(log_path),
        started_at=utc_now(),
        last_error=None,
        declared_artifact=task_declared_artifact(task),
        declared_branch=declared_branch,
        allowed_paths=json_list(task_allowed_paths(task)),
        forbidden_paths=json_list(task_forbidden_paths(task)),
        machine_id=task["machine_id"] or os.environ.get("AUTORUN_V2_MACHINE_ID") or os.uname().nodename,
        verification_status=None,
        mismatch_reason=None,
    )
    return True


def reconcile_once(args: argparse.Namespace) -> int:
    root = root_path(args)
    repo = repo_path(args)
    conn = connect(db_path(args))
    with conn:
        conn.execute("BEGIN IMMEDIATE")
        git_fetch(repo)
        reconcile_running(conn, root, repo)
        reconcile_failed_and_held(conn, root, repo)
        start_ready_task(conn, root, repo, args.model)
    return 0


def ci_handoff(args: argparse.Namespace) -> int:
    repo = repo_path(args)
    conn = connect(db_path(args))
    with conn:
        conn.execute("BEGIN IMMEDIATE")
        git_fetch(repo)
        rows = conn.execute(
            """
            SELECT * FROM tasks
            WHERE status='done'
              AND verification_status='verified'
              AND ci_pipeline_url IS NULL
              AND ci_merge_request_url IS NULL
            ORDER BY finished_at, updated_at, id
            """
        ).fetchall()
        for task in rows:
            ci_handoff_for_task(conn, repo, task)
    print(f"ci_handoff_scanned={len(rows)} db={db_path(args)}")
    return 0


def dry_run_temp_task(args: argparse.Namespace) -> int:
    with tempfile.TemporaryDirectory(prefix="autorun-v2-2-") as tmp_raw:
        tmp = Path(tmp_raw)
        remote = tmp / "remote.git"
        repo = tmp / "repo"
        root = tmp / "autorun"
        db = root / "jobs.db"
        fake_codex = tmp / "fake-codex"
        subprocess.run(["git", "init", "--bare", str(remote)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        subprocess.run(["git", "clone", str(remote), str(repo)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        run_git(repo, ["config", "user.email", "autorun-v2-2@example.invalid"])
        run_git(repo, ["config", "user.name", "Autorun V2.2 Test"])
        (repo / "README.md").write_text("autorun v2.2 dry run\n", encoding="utf-8")
        run_git(repo, ["add", "README.md"])
        run_git(repo, ["commit", "-m", "seed main"])
        run_git(repo, ["branch", "-M", "main"])
        run_git(repo, ["push", "origin", "main"])
        fake_codex.write_text(
            """#!/usr/bin/env python3
import json
from pathlib import Path

task = json.loads(Path(".autorun/task.json").read_text())
artifact = Path(task["declared_artifact"])
artifact.parent.mkdir(parents=True, exist_ok=True)
artifact.write_text("dry-run artifact\\n", encoding="utf-8")
Path(".autorun/result.json").write_text(json.dumps({
    "schema_version": "2.2",
    "task_id": task["task_id"],
    "actual_artifact": task["declared_artifact"],
    "actual_branch": task["declared_branch"],
    "status": "done",
    "summary": "fake codex wrote the declared artifact"
}, indent=2) + "\\n", encoding="utf-8")
""",
            encoding="utf-8",
        )
        fake_codex.chmod(0o755)

        conn = connect(db)
        now = utc_now()
        artifact = "reports/ops/autorun-v2-2-dry-run.md"
        branch = "ops/autorun-v2-2-dry-run"
        conn.execute(
            """
            INSERT INTO tasks(
              id, artifact, branch, brief, status, attempts, max_attempts,
              created_at, updated_at, declared_artifact, declared_branch,
              allowed_paths, forbidden_paths, machine_id
            )
            VALUES (?, ?, ?, ?, 'ready', 0, 1, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "dry-run-temp-task",
                artifact,
                branch,
                "Write the declared dry-run artifact.",
                now,
                now,
                artifact,
                branch,
                json_list(default_allowed_paths(artifact)),
                json_list(DEFAULT_FORBIDDEN_PATHS),
                "dry-run",
            ),
        )
        conn.commit()

        previous_codex = os.environ.get("AUTORUN_V2_CODEX")
        previous_handoff = os.environ.get("AUTORUN_V2_ENABLE_CI_HANDOFF")
        previous_ignore = os.environ.get("AUTORUN_V2_IGNORE_CODEX_RUNNING")
        os.environ["AUTORUN_V2_CODEX"] = str(fake_codex)
        os.environ["AUTORUN_V2_IGNORE_CODEX_RUNNING"] = "1"
        os.environ.pop("AUTORUN_V2_ENABLE_CI_HANDOFF", None)
        dry_args = argparse.Namespace(db=str(db), root=str(root), repo=str(repo), model=args.model)
        try:
            reconcile_once(dry_args)
            for _ in range(20):
                time.sleep(0.2)
                reconcile_once(dry_args)
                row = connect(db).execute("SELECT status, verification_status, mismatch_reason FROM tasks WHERE id=?", ("dry-run-temp-task",)).fetchone()
                if row and row["status"] == "done":
                    break
            row = connect(db).execute("SELECT * FROM tasks WHERE id=?", ("dry-run-temp-task",)).fetchone()
        finally:
            if previous_codex is None:
                os.environ.pop("AUTORUN_V2_CODEX", None)
            else:
                os.environ["AUTORUN_V2_CODEX"] = previous_codex
            if previous_handoff is None:
                os.environ.pop("AUTORUN_V2_ENABLE_CI_HANDOFF", None)
            else:
                os.environ["AUTORUN_V2_ENABLE_CI_HANDOFF"] = previous_handoff
            if previous_ignore is None:
                os.environ.pop("AUTORUN_V2_IGNORE_CODEX_RUNNING", None)
            else:
                os.environ["AUTORUN_V2_IGNORE_CODEX_RUNNING"] = previous_ignore
        if not row or row["status"] != "done" or row["verification_status"] != "verified":
            raise RuntimeError(f"dry run failed: {dict(row) if row else 'missing task'}")
        git_fetch(repo)
        if not remote_artifact_exists(repo, branch, artifact):
            raise RuntimeError("dry run branch was not pushed to temp remote")
        print(f"dry_run=ok db={db} branch={branch} artifact={artifact}")
        return 0


def print_status(args: argparse.Namespace) -> int:
    conn = connect(db_path(args))
    print(f"db={db_path(args)}")
    print("status counts:")
    summary = {
        "ready": "SELECT COUNT(*) FROM tasks WHERE status='ready'",
        "running": "SELECT COUNT(*) FROM tasks WHERE status='running'",
        "done without CI": (
            "SELECT COUNT(*) FROM tasks WHERE status='done' "
            "AND ci_pipeline_url IS NULL AND ci_merge_request_url IS NULL"
        ),
        "done with CI": (
            "SELECT COUNT(*) FROM tasks WHERE status='done' "
            "AND (ci_pipeline_url IS NOT NULL OR ci_merge_request_url IS NOT NULL)"
        ),
        "held": "SELECT COUNT(*) FROM tasks WHERE status='held'",
    }
    for label, query in summary.items():
        print(f"  {label}: {conn.execute(query).fetchone()[0]}")
    other = conn.execute("SELECT status, COUNT(*) AS count FROM tasks WHERE status NOT IN ('ready','running','done','held') GROUP BY status ORDER BY status").fetchall()
    for row in other:
        print(f"  {row['status']}: {row['count']}")
    running = conn.execute("SELECT id, pid, pgid, attempts, log_path FROM tasks WHERE status='running' ORDER BY started_at").fetchall()
    if running:
        print("running:")
        for row in running:
            alive = "alive" if process_alive(row["pid"], row["pgid"]) else "dead"
            print(f"  {row['id']} pid={row['pid']} pgid={row['pgid']} attempts={row['attempts']} {alive} log={row['log_path']}")
    queued = conn.execute("SELECT id, artifact, branch, attempts, max_attempts FROM tasks WHERE status='ready' ORDER BY created_at, id LIMIT 10").fetchall()
    if queued:
        print("next ready:")
        for row in queued:
            print(f"  {row['id']} attempts={row['attempts']}/{row['max_attempts']} origin/{row['branch']} {row['artifact']}")
    held = conn.execute("SELECT id, last_error FROM tasks WHERE status='held' ORDER BY updated_at DESC LIMIT 10").fetchall()
    if held:
        print("held:")
        for row in held:
            print(f"  {row['id']} last_error={row['last_error'] or ''}")
    done_without_ci = conn.execute(
        """
        SELECT id, branch, artifact, ci_handoff_error
        FROM tasks
        WHERE status='done' AND ci_pipeline_url IS NULL AND ci_merge_request_url IS NULL
        ORDER BY finished_at DESC, updated_at DESC, id
        LIMIT 10
        """
    ).fetchall()
    if done_without_ci:
        print("done without CI:")
        for row in done_without_ci:
            error = f" handoff_error={row['ci_handoff_error']}" if row["ci_handoff_error"] else ""
            print(f"  {row['id']} origin/{row['branch']} {row['artifact']}{error}")
    done_with_ci = conn.execute(
        """
        SELECT id, ci_artifact_branch, ci_pipeline_url, ci_merge_request_url
        FROM tasks
        WHERE status='done' AND (ci_pipeline_url IS NOT NULL OR ci_merge_request_url IS NOT NULL)
        ORDER BY ci_handoff_at DESC, updated_at DESC, id
        LIMIT 10
        """
    ).fetchall()
    if done_with_ci:
        print("done with CI:")
        for row in done_with_ci:
            url = row["ci_pipeline_url"] or row["ci_merge_request_url"]
            print(f"  {row['id']} origin/{row['ci_artifact_branch']} {url}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="MercyBlade autorun V2 SQLite reconciler")
    parser.add_argument("--db", help="SQLite database path; default $HOME/autorun/jobs.db")
    parser.add_argument("--root", help="autorun root; default $HOME/autorun")
    parser.add_argument("--repo", help="repo path; default $HOME/MercyB")
    parser.add_argument("--model", default=os.environ.get("CODEX_MODEL", "gpt-5.5"))
    sub = parser.add_subparsers(dest="command", required=True)

    import_cmd = sub.add_parser("import-folders", help="import legacy autorun folders into SQLite")
    import_cmd.add_argument("--all-buckets", action="store_true", help="also import failed, held, and done for migration visibility")
    import_cmd.add_argument("--max-attempts", type=int, default=DEFAULT_MAX_ATTEMPTS)
    import_cmd.set_defaults(func=import_folders)

    reconcile_cmd = sub.add_parser("reconcile-once", help="run one level-triggered reconcile pass")
    reconcile_cmd.set_defaults(func=reconcile_once)

    handoff_cmd = sub.add_parser("ci-handoff", help="trigger pipeline or MR for done tasks without CI handoff")
    handoff_cmd.set_defaults(func=ci_handoff)

    dry_run_cmd = sub.add_parser("dry-run-temp-task", help="run one manifest worker task against a temp DB and temp remote")
    dry_run_cmd.set_defaults(func=dry_run_temp_task)

    status_cmd = sub.add_parser("status", help="print SQLite task status")
    status_cmd.set_defaults(func=print_status)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
