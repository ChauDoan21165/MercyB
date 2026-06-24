// src/pages/languages/__tests__/RussianPunjabiVisibility.test.ts
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../../../..");

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

describe("Russian and Punjabi public language visibility", () => {
  it("exposes Russian and Punjabi cards on the /languages index", () => {
    const indexSource = read("src/pages/languages/LanguagesIndexPage.tsx");

    expect(indexSource).toContain("/languages/russian");
    expect(indexSource).toContain("/languages/punjabi");
    expect(indexSource).toMatch(/Russian/);
    expect(indexSource).toMatch(/Punjabi/);
  });

  it("registers Russian and Punjabi public routes", () => {
    const routerSource = read("src/router/AppRouter.tsx");

    expect(routerSource).toMatch(/RussianLessonsPage/);
    expect(routerSource).toMatch(/PunjabiLessonsPage/);
    expect(routerSource).toMatch(/path=["']\/languages\/russian["']/);
    expect(routerSource).toMatch(/path=["']\/languages\/punjabi["']/);
  });

  it("has public page components and source lesson folders", () => {
    expect(fs.existsSync(path.join(root, "src/pages/languages/RussianLessonsPage.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(root, "src/pages/languages/PunjabiLessonsPage.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(root, "src/languages/russian"))).toBe(true);
    expect(fs.existsSync(path.join(root, "src/languages/punjabi"))).toBe(true);
  });
});
