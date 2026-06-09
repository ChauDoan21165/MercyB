#!/bin/bash
cd /Users/admin/MercyB && git fetch origin --quiet
echo "══ AGENT DIAG $(date '+%m-%d %H:%M') | Disk free: $(df -h / | awk 'NR==2{print $4}') ══"
echo "── TMUX SESSIONS + IDLE COUNTERS (each unit = 5min frozen) ──"
for S in $(tmux ls -F '#S' 2>/dev/null); do echo "$S: idle=$(cat /tmp/agent.$S.idle 2>/dev/null || cat /tmp/ceo1.idle 2>/dev/null || echo '?')"; done
echo "── OPEN MRs ──"
glab mr list -s opened --per-page 15 2>/dev/null | head -20
echo "── MERGED TO MAIN LAST 6H ──"
git log origin/main --since="6 hours ago" --oneline | head -25
echo "── MERGE COUNT 6H: $(git log origin/main --since='6 hours ago' --oneline | grep -c 'Merge branch') ──"
echo "── UNMERGED BRANCHES (recent first, ahead-count) ──"
for b in $(git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/remotes/origin | grep -v 'origin/main' | head -12); do
  A=$(git rev-list --count origin/main..$b 2>/dev/null)
  [ "$A" != "0" ] && echo "$b: $A ahead, last commit $(git log -1 --format='%cr' $b)"
done
echo "── CI: LAST 5 PIPELINES ──"
glab ci list --per-page 5 2>/dev/null
echo "── BOARD: LAST CEO-1 HEARTBEAT ──"
grep '\[CEO-1 STATUS\]' /Users/admin/agent-board.md | tail -1
echo "── BOARD: WATCHDOG FLAGS (last 5) ──"
grep '\[WATCHDOG\]' /Users/admin/agent-board.md | tail -5
echo "── BACKLOG DEPTH: $(sed -n '/═══ BACKLOG/,/END BACKLOG/p' /Users/admin/agent-board.md | grep -c '^-') items ──"
echo "── TS LINES (full repo): $(git ls-files '*.ts' '*.tsx' | tr '\n' '\0' | xargs -0 cat 2>/dev/null | wc -l | tr -d ' ') ──"
echo "══ END DIAG ══"
