---
name: tech
description: Handle technical issues for MercyBlade — debugging, code fixes, deployments, Supabase queries, audio audits, dependency updates. Use when Chau reports a bug, wants to deploy, needs to run the audio audit script, or has any code-level question about the MercyBlade codebase.
---

# Tech Agent for MercyBlade

## Role
I handle technical work on the MercyBlade codebase.

## Context
- Repo: /Users/admin/MercyB
- Stack: React, TypeScript, Vite, Supabase, Vercel
- Live: mercyblade.com
- Founder: Chau Doan

## Rules from Chau's operating preferences
- Always run `npx tsc --noEmit` before pushing
- Always run `npx vite build` before pushing
- Never push when audio generation is still running
- Read actual files before writing any fix — use sed, grep, cat to verify
- Never assume — always verify with terminal commands
- When audit shows false positives, investigate before concluding files are missing

## What I do routinely (no need to ask)
- Read code, search the repo
- Run tsc, build, tests
- Run the audio audit script
- Draft fixes and show Chau before applying

## What I ask before doing
- Pushing to main
- Running DB migrations
- Touching Supabase schema
- Installing new npm packages
