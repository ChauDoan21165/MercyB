// src/test/setup.ts

import "@testing-library/jest-dom/vitest";
import path from "node:path";
import fs from "node:fs";
import Module from "node:module";

/**
 * Vitest runs tests through Vite's resolver for ESM `import`,
 * but CommonJS `require()` uses Node's resolver which does NOT know about "@/...".
 *
 * Some legacy tests still do:
 *   require("@/lib/...")
 *
 * This patch makes Node's CJS resolver understand "@/..." by mapping it to /src.
 * It is intentionally small and only affects requests that start with "@/" or "@".
 *
 * NOTE:
 * Node's resolver will NOT automatically resolve TypeScript extensions when you pass an
 * absolute path without an extension (e.g. "/src/x/y").
 * So we add a tiny extension/index fallback for .ts/.tsx/.js/.jsx.
 */

const srcRoot = path.resolve(__dirname, ".."); // <repo>/src

// Guard so we don't patch multiple times in watch mode.
const kPatched = Symbol.for("mercy.vitest.aliasRequirePatched");

const anyModule = Module as unknown as {
  _resolveFilename: (
    request: string,
    parent: any,
    isMain: boolean,
    options: any,
  ) => string;
  [k: symbol]: boolean | undefined;
};

function resolveWithTsFallback(
  originalResolve: anyModule["_resolveFilename"],
  mapped: string,
  parent: any,
  isMain: boolean,
  options: any,
) {
  // If request already includes an extension, just try it.
  if (path.extname(mapped)) {
    return originalResolve.call(Module, mapped, parent, isMain, options);
  }

  const candidates = [
    mapped + ".ts",
    mapped + ".tsx",
    mapped + ".js",
    mapped + ".jsx",
    path.join(mapped, "index.ts"),
    path.join(mapped, "index.tsx"),
    path.join(mapped, "index.js"),
    path.join(mapped, "index.jsx"),
  ];

  const hit = candidates.find((p) => fs.existsSync(p));
  if (hit) {
    return originalResolve.call(Module, hit, parent, isMain, options);
  }

  // Fall back to Node's default behavior (will throw the normal MODULE_NOT_FOUND)
  return originalResolve.call(Module, mapped, parent, isMain, options);
}

if (!anyModule[kPatched]) {
  const originalResolve = anyModule._resolveFilename;

  anyModule._resolveFilename = function (
    request: string,
    parent: any,
    isMain: boolean,
    options: any,
  ) {
    if (request === "@") {
      // Treat "@" as the src root (rare but supported)
      return originalResolve.call(this, srcRoot, parent, isMain, options);
    }

    if (request.startsWith("@/")) {
      const mapped = path.join(srcRoot, request.slice(2)); // "@/x" -> "<srcRoot>/x"
      return resolveWithTsFallback(originalResolve, mapped, parent, isMain, options);
    }

    return originalResolve.call(this, request, parent, isMain, options);
  };

  anyModule[kPatched] = true;
}

/**
 * Optional: common DOM stubs for jsdom stability.
 * (Safe to keep; only applied if missing.)
 */
if (typeof window !== "undefined") {
  // matchMedia stub (some UI libs rely on it)
  if (!("matchMedia" in window)) {
    (window as any).matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  // ResizeObserver stub
  if (!("ResizeObserver" in window)) {
    (window as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}