// PATH: src/test/setup.ts

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
    parent: unknown,
    isMain: boolean,
    options: unknown,
  ) => string;
  [k: symbol]: boolean | undefined;
};

function resolveWithTsFallback(
  originalResolve: typeof anyModule._resolveFilename,
  mapped: string,
  parent: unknown,
  isMain: boolean,
  options: unknown,
) {
  if (path.extname(mapped)) {
    return originalResolve.call(Module, mapped, parent, isMain, options);
  }

  const candidates = [
    `${mapped}.ts`,
    `${mapped}.tsx`,
    `${mapped}.js`,
    `${mapped}.jsx`,
    path.join(mapped, "index.ts"),
    path.join(mapped, "index.tsx"),
    path.join(mapped, "index.js"),
    path.join(mapped, "index.jsx"),
  ];

  const hit = candidates.find((candidate) => fs.existsSync(candidate));
  if (hit) {
    return originalResolve.call(Module, hit, parent, isMain, options);
  }

  return originalResolve.call(Module, mapped, parent, isMain, options);
}

if (!anyModule[kPatched]) {
  const originalResolve = anyModule._resolveFilename;

  anyModule._resolveFilename = function (
    request: string,
    parent: unknown,
    isMain: boolean,
    options: unknown,
  ) {
    if (request === "@") {
      return resolveWithTsFallback(originalResolve, srcRoot, parent, isMain, options);
    }

    if (request.startsWith("@/")) {
      const mapped = path.join(srcRoot, request.slice(2)); // "@/x" -> "<srcRoot>/x"
      return resolveWithTsFallback(originalResolve, mapped, parent, isMain, options);
    }

    return originalResolve.call(this, request, parent, isMain, options);
  };

  anyModule[kPatched] = true;
}

type StorageLike = Pick<
  Storage,
  "clear" | "getItem" | "key" | "removeItem" | "setItem" | "length"
>;

function createMemoryStorage(): StorageLike {
  const entries = new Map<string, string>();

  return {
    get length() {
      return entries.size;
    },
    clear() {
      entries.clear();
    },
    getItem(key: string) {
      return entries.has(key) ? entries.get(key)! : null;
    },
    key(index: number) {
      return Array.from(entries.keys())[index] ?? null;
    },
    removeItem(key: string) {
      entries.delete(key);
    },
    setItem(key: string, value: string) {
      entries.set(key, String(value));
    },
  };
}

function installStorage(name: "localStorage" | "sessionStorage") {
  const storage = createMemoryStorage();

  for (const target of [globalThis, typeof window !== "undefined" ? window : undefined]) {
    if (!target) continue;

    Object.defineProperty(target, name, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: storage,
    });
  }
}

/**
 * Optional: common DOM stubs for jsdom stability.
 * (Safe to keep; only applied if missing.)
 */
if (typeof window !== "undefined") {
  installStorage("localStorage");
  installStorage("sessionStorage");

  if (!("matchMedia" in window)) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }

  if (!("ResizeObserver" in window)) {
    const ResizeObserverStub = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    Object.defineProperty(window, "ResizeObserver", {
      writable: true,
      configurable: true,
      value: ResizeObserverStub,
    });

    Object.defineProperty(globalThis, "ResizeObserver", {
      writable: true,
      configurable: true,
      value: ResizeObserverStub,
    });
  }

  if (!("scrollTo" in window)) {
    Object.defineProperty(window, "scrollTo", {
      writable: true,
      value: () => {},
    });
  }
}
