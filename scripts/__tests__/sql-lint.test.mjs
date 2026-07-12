import { describe, expect, it } from "vitest";

import { APPROVAL_MARKER_PREFIX, lintSqlText, stripSqlCommentsAndStrings } from "../sql-lint.mjs";

describe("sql-lint destructive SQL guard", () => {
  it("allows ordinary create/index/grant migrations", () => {
    const result = lintSqlText("create table public.x(id uuid);\ngrant select on public.x to agent_readonly;");
    expect(result.ok).toBe(true);
  });

  it("blocks destructive statements without Chau marker", () => {
    for (const sql of [
      "drop table public.x;",
      "truncate public.x;",
      "delete from public.x where true;",
      "update public.x set id = id;",
      "revoke select on public.x from anon;",
      "alter table public.x drop column y;",
    ]) {
      expect(lintSqlText(sql).ok).toBe(false);
    }
  });

  it("allows destructive statements with exact Chau marker prefix and task", () => {
    const sql = `${APPROVAL_MARKER_PREFIX}r2 cleanup\nalter table public.x drop column y;`;
    expect(lintSqlText(sql).ok).toBe(true);
  });

  it("ignores forbidden words in comments and string literals", () => {
    const stripped = stripSqlCommentsAndStrings("-- drop table x\nselect 'delete from y' as sample;");
    expect(stripped).not.toMatch(/drop table|delete from/i);
    expect(lintSqlText("-- drop table x\nselect 'delete from y' as sample;").ok).toBe(true);
  });
});
