import json
import os
import sqlite3
import subprocess
import threading
import time

root = os.path.expanduser("~/mb-loop")
db_path = os.path.join(root, "state", "queue.sqlite3")
log_dir = os.path.join(root, "logs")
tmp_dir = os.path.expanduser("~/.mbtmp")
os.makedirs(log_dir, exist_ok=True)
os.makedirs(tmp_dir, exist_ok=True)

def now():
    return int(time.time())

def connect():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("pragma busy_timeout = 5000")
    return conn

def event(conn, task_id, level, message):
    conn.execute(
        "insert into events(task_id,level,message,created_at) values(?,?,?,?)",
        (task_id, level, message, now()),
    )

def claim():
    conn = connect()
    t = now()
    conn.execute("begin immediate")
    row = conn.execute(
        "select * from tasks where status = ? order by priority asc, created_at asc limit 1",
        ("pending",),
    ).fetchone()
    if not row:
        conn.commit()
        conn.close()
        return None

    pid = os.getpid()
    pgid = os.getpgrp()
    conn.execute(
        "update tasks set status = ?, worker_pid = ?, worker_pgid = ?, attempts = attempts + 1, updated_at = ?, last_heartbeat = ? where task_id = ?",
        ("running", pid, pgid, t, t, row["task_id"]),
    )
    event(conn, row["task_id"], "info", "claimed by worker " + str(pid))
    conn.commit()
    conn.close()
    return row["task_id"]

def heartbeat(task_id, stop):
    while not stop["stop"]:
        try:
            conn = connect()
            conn.execute(
                "update tasks set last_heartbeat = ?, updated_at = ? where task_id = ?",
                (now(), now(), task_id),
            )
            conn.commit()
            conn.close()
        except Exception:
            pass
        time.sleep(10)

def run_command(command, cwd, log_path):
    env = os.environ.copy()
    env["TMPDIR"] = tmp_dir
    env["PATH"] = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

    with open(log_path, "a", encoding="utf-8") as log:
        log.write("\nRUN " + command + "\n")
        p = subprocess.run(
            command,
            cwd=cwd,
            shell=True,
            env=env,
            text=True,
            stdout=log,
            stderr=log,
        )
        return p.returncode

def verify(payload, cwd, log_path):
    missing = []
    for path in payload.get("artifacts", []):
        full = os.path.expanduser(path)
        if not os.path.isabs(full):
            full = os.path.join(cwd, path)
        if not os.path.exists(full):
            missing.append(path)

    if missing:
        return False, "missing artifacts " + ", ".join(missing)

    for command in payload.get("verify", []):
        rc = run_command(command, cwd, log_path)
        if rc != 0:
            return False, "verify failed " + command

    return True, "verified"

def complete(task_id, ok, result):
    conn = connect()
    t = now()
    row = conn.execute(
        "select attempts,max_attempts from tasks where task_id = ?",
        (task_id,),
    ).fetchone()

    status = "completed" if ok else "failed"
    if not ok and row and row["attempts"] < row["max_attempts"]:
        status = "pending"

    conn.execute(
        "update tasks set status = ?, worker_pid = null, worker_pgid = null, updated_at = ?, finished_at = ?, result = ? where task_id = ?",
        (status, t, t, result, task_id),
    )
    event(conn, task_id, "info" if ok else "error", result)
    conn.commit()
    conn.close()

def main():
    task_id = claim()
    if not task_id:
        return

    stop = {"stop": False}
    th = threading.Thread(target=heartbeat, args=(task_id, stop), daemon=True)
    th.start()

    log_path = os.path.join(log_dir, "task-" + task_id + ".log")
    ok = False
    result = "not run"

    try:
        conn = connect()
        row = conn.execute(
            "select * from tasks where task_id = ?",
            (task_id,),
        ).fetchone()
        conn.close()

        payload = json.loads(row["payload"])
        cwd = payload.get("repo") or os.path.expanduser("~/mb-loop/repo")

        if row["kind"] == "shell":
            rc = run_command(payload["command"], cwd, log_path)
            if rc == 0:
                ok, result = verify(payload, cwd, log_path)
            else:
                result = "command failed"

        elif row["kind"] == "codex":
            brief_path = os.path.join(tmp_dir, "brief-" + task_id + ".txt")
            with open(brief_path, "w", encoding="utf-8") as f:
                f.write(payload["brief"])

            extra = ""
            if not os.path.exists(os.path.join(cwd, ".git")):
                extra = " --skip-git-repo-check"

            command = (
                "codex exec --sandbox danger-full-access"
                + extra
                + " "
                + json.dumps(payload["brief"])
            )

            rc = run_command(command, cwd, log_path)
            if rc == 0:
                ok, result = verify(payload, cwd, log_path)
            else:
                result = "codex failed"

        else:
            result = "unknown kind"

    except Exception as e:
        result = "worker exception " + str(e)

    stop["stop"] = True
    complete(task_id, ok, result)

main()
