# AI Tutor Agent Prompting Principles

## AGENT REPORTS - TWO LINES ONLY

Preferred report template:

```text
Done: <done; no need to list work done because ChatGPT or Claude knows the task given>
Not done: <list work not done and explain why>
```

Safety gates remain unchanged. Never auto-authorize smoke, env/secrets, deploy, real provider execution, learner/student text, production traffic, UI exposure, persistence, streaming, SDK imports, or V5 coupling.

## AGENT TASK COPY BOX

When giving a task to an agent, put the full task inside a copyable code block.

## AI TUTOR AGENT TRACKER

Maintain a simple AI Tutor Agent Tracker across phases so coordinator state does not get lost.

Required columns:

```text
Agent | Lane | Status | Done | Not Done | Blocker | Parked? | Next Action | Hard Blocks
```

Recommended optional columns:

```text
Last Updated | Wake Condition | Evidence Link
```
