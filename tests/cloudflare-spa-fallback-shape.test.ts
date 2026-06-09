import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

describe("Cloudflare Pages SPA fallback shape", () => {
  it("does not emit static fallback files that disable Pages SPA routing", () => {
    expect(fs.existsSync(path.join(root, "public/404.html"))).toBe(false);
    expect(fs.existsSync(path.join(root, "public/_redirects"))).toBe(false);
  });

  it("keeps unknown client routes handled by the app router", () => {
    const router = fs.readFileSync(path.join(root, "src/router/AppRouter.tsx"), "utf8");
    expect(router).toContain("function NotFound()");
    expect(router).toContain('<Route path="*" element={<NotFound />} />');
  });
});
