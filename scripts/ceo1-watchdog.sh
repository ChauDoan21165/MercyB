#!/bin/bash
export PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
H=/tmp/ceo1.hash; C=/tmp/ceo1.idle
CUR=$(tmux capture-pane -pt ceo1 2>/dev/null | tail -30 | md5)
if [ -z "$CUR" ]; then say "Chau, CEO one session is gone"; exit 1; fi
PREV=$(cat $H 2>/dev/null); echo "$CUR" > $H
if [ "$CUR" = "$PREV" ]; then N=$(( $(cat $C 2>/dev/null || echo 0) + 1 )); else N=0; fi
echo $N > $C
if [ $N -ge 2 ]; then
  tmux send-keys -t ceo1 "" Enter
  tmux send-keys -t ceo1 "Run your full duty cycle NOW per /Users/admin/ceo1-duty-cycle.md. Pull BACKLOG items for every idle slot. Post your STATUS heartbeat." Enter
fi
if [ $N -ge 6 ]; then say "Chau, CEO one has been idle thirty minutes, check tmux"; echo 0 > $C; fi
