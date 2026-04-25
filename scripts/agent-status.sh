#!/usr/bin/env bash
# MercyBlade Agent Status Board
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="$REPO_ROOT/.claude/agents.log"
BOARD_FILE="$REPO_ROOT/.claude/agents.txt"

mkdir -p "$REPO_ROOT/.claude"
touch "$LOG_FILE"

cmd_start() {
  local agent="$1"
  local task="$2"
  local now
  now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '{"ts":"%s","event":"start","agent":"%s","task":%s}\n' \
    "$now" "$agent" "$(printf '%s' "$task" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')" \
    >> "$LOG_FILE"
  cmd_render
}

cmd_done() {
  local agent="$1"
  local pr="${2:-}"
  local now
  now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '{"ts":"%s","event":"done","agent":"%s","pr":"%s"}\n' \
    "$now" "$agent" "$pr" \
    >> "$LOG_FILE"
  cmd_render
}

cmd_error() {
  local agent="$1"
  local note="${2:-}"
  local now
  now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '{"ts":"%s","event":"error","agent":"%s","note":%s}\n' \
    "$now" "$agent" "$(printf '%s' "$note" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')" \
    >> "$LOG_FILE"
  cmd_render
}

cmd_render() {
  python3 - "$LOG_FILE" "$BOARD_FILE" <<'PY'
import json, sys, datetime, pathlib, re

log_path = pathlib.Path(sys.argv[1])
board_path = pathlib.Path(sys.argv[2])

agents = {}

if log_path.exists():
    for line in log_path.read_text().splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        name = ev.get("agent")
        if not name:
            continue
        cur = agents.setdefault(name, {})
        cur["last_event"] = ev.get("event")
        cur["last_ts"] = ev.get("ts")
        if ev["event"] == "start":
            cur["task"] = ev.get("task", "")
            cur["start_ts"] = ev.get("ts")
            cur.pop("pr", None)
            cur.pop("note", None)
        elif ev["event"] == "done":
            cur["pr"] = ev.get("pr", "")
        elif ev["event"] == "error":
            cur["note"] = ev.get("note", "")

def fmt_duration(start_iso, end_iso):
    if not start_iso:
        return "-"
    try:
        s = datetime.datetime.fromisoformat(start_iso.replace("Z", "+00:00"))
        e = datetime.datetime.fromisoformat(end_iso.replace("Z", "+00:00")) if end_iso else datetime.datetime.now(datetime.timezone.utc)
        delta = int((e - s).total_seconds())
        if delta < 60:
            return f"{delta}s"
        m, s = divmod(delta, 60)
        return f"{m}m {s}s"
    except Exception:
        return "-"

def status_icon(state):
    return {
        "start": "RUNNING",
        "done":  "DONE   ",
        "error": "ERROR  ",
    }.get(state, "UNKNOWN")

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

lines = []
lines.append("=" * 70)
lines.append("  MercyBlade Agent Board")
lines.append(f"  Updated: {now_str}")
lines.append("=" * 70)
lines.append("")

if not agents:
    lines.append("  (no agents logged yet)")
    lines.append("")
else:
    def sort_key(name):
        m = re.match(r"CC(\d+)([a-z]?)", name)
        if m:
            return (int(m.group(1)), m.group(2))
        return (999, name)

    for name in sorted(agents.keys(), key=sort_key):
        a = agents[name]
        state = a.get("last_event", "unknown")
        task = a.get("task", "(no task)")
        end_ts = a["last_ts"] if state in ("done", "error") else None
        dur = fmt_duration(a.get("start_ts"), end_ts)

        lines.append(f"  {name:<5}  [{status_icon(state)}]  {task}")
        if a.get("pr"):
            lines.append(f"         PR:   {a['pr']}")
        if a.get("note"):
            lines.append(f"         Note: {a['note']}")
        lines.append(f"         Time: {dur}")
        lines.append("")

lines.append("=" * 70)

board_path.write_text("\n".join(lines) + "\n")
print("\n".join(lines))
PY
}

cmd_reset() {
  : > "$LOG_FILE"
  cmd_render
  echo "(agent log reset)"
}

main() {
  if [[ $# -lt 1 ]]; then
    echo "Usage: $0 {start|done|error|render|reset} [args...]"
    exit 2
  fi
  local subcommand="$1"
  shift
  case "$subcommand" in
    start)  cmd_start "$@" ;;
    done)   cmd_done "$@" ;;
    error)  cmd_error "$@" ;;
    render) cmd_render ;;
    reset)  cmd_reset ;;
    *)
      echo "Unknown subcommand: $subcommand"
      exit 2
      ;;
  esac
}

main "$@"
