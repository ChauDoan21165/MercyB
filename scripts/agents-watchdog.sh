#!/bin/bash
export PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
for S in $(tmux ls -F '#S' 2>/dev/null | grep -E '^a[0-9]+$'); do
  H=/tmp/agent.$S.hash; C=/tmp/agent.$S.idle
  CUR=$(tmux capture-pane -pt $S 2>/dev/null | tail -25 | md5)
  PREV=$(cat $H 2>/dev/null); echo "$CUR" > $H
  if [ "$CUR" = "$PREV" ]; then N=$(( $(cat $C 2>/dev/null || echo 0) + 1 )); else N=0; fi
  echo $N > $C
  if [ $N -ge 2 ]; then
    tmux send-keys -t $S "" Enter
    tmux send-keys -t $S "Continue your dispatched task. If finished, post your report to the board and pull the next BACKLOG item. Do not wait on CI pipelines." Enter
  fi
  if [ $N -ge 6 ]; then echo "[WATCHDOG] $S frozen 30min $(date '+%H:%M')" >> /Users/admin/agent-board.md; echo 0 > $C; fi
done
