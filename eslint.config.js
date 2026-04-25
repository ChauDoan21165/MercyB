// eslint.config.js

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default [
  /* ===============================
   * GLOBAL IGNORES (HARD)
   * =============================== */
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".vite/**",
      ".vercel/**",
      "**/*.map",
      "**/*.min.js",

      // legacy / infra noise
      "scripts/**",
      "supabase/migrations/**",
      "supabase/seed.sql",
      "src/_legacy_next_pages/**",

      // repo-root stray files (not in src)
      "public/**",
      ".husky/**",

      // Capacitor-generated native bundles. These are minified copies
      // of the vite build, dropped into ios/ and android/ by
      // `npx cap sync`. They're committed to the repo so the iOS
      // and Android Studio projects open without a fresh sync, but
      // they're not source — never lint them.
      "ios/App/App/public/**",
      "android/app/src/main/assets/public/**",
      "android/app/build/**",
    ],
  },

  /* ===============================
   * BASE
   * =============================== */
  js.configs.recommended,
  ...tseslint.configs.recommended,

  /* ===============================
   * REACT APP (src) — REALITY MODE
   * =============================== */
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      /* React */
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "off",

      /* Hooks — ALL CHURN OFF */
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/use-memo": "off",
      "react-hooks/use-callback": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/static-components": "off",

      /* TypeScript reality */
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",

      /* Control-flow / infra */
      "no-unsafe-finally": "off",
      "no-constant-condition": "off",
      "prefer-const": "off",

      /* MercyB reality */
      "no-empty": "off",
      "no-useless-escape": "off",

      /* Mercy grammar guardrails */
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "./tabs/GrammarWritingTab",
              message: "Use ./tabs/grammar-writing/GrammarWritingTab only.",
            },
            {
              name: "@/components/mercy-guide/tabs/GrammarWritingTab",
              message: "Use the split grammar-writing tab only.",
            },
            {
              name: "./tabs/grammar-writing/fallback",
              message: "Grammar flow must be API-only. Do not import fallback.",
            },
            {
              name: "@/components/mercy-guide/tabs/grammar-writing/fallback",
              message: "Grammar flow must be API-only. Do not import fallback.",
            },
          ],
          patterns: [
            {
              group: ["**/tabs/GrammarWritingTab", "**/tabs/GrammarWritingTab.*"],
              message: "Old monolith GrammarWritingTab is forbidden.",
            },
            {
              group: ["**/grammar-writing/fallback", "**/grammar-writing/fallback.*"],
              message: "Fallback grammar logic is forbidden.",
            },
          ],
        },
      ],
    },
  },

  /* ===============================
   * SUPABASE EDGE (Deno)
   * =============================== */
  {
    files: ["supabase/functions/**/*.ts"],
    languageOptions: {
      globals: { ...globals.deno },
    },
    rules: {
      "no-constant-condition": "off",
      "no-empty": "off",
      "no-control-regex": "off",
      "no-useless-escape": "off",
      "prefer-const": "off",

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },

  /* ===============================
   * NON-REACT TS (TOOLS / LOADERS)
   * =============================== */
  {
    files: ["**/*.ts"],
    ignores: ["src/**", "supabase/functions/**"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",

      "no-undef": "off",
      "no-console": "off",
      "no-redeclare": "off",
      "prefer-const": "off",
      "no-empty": "off",
      "no-useless-escape": "off",
    },
  },

  /* ===============================
   * NODE SCRIPTS (.js/.cjs/.mjs)
   * =============================== */
  {
    files: ["**/*.{js,cjs,mjs}"],
    ignores: ["src/**", "supabase/functions/**"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    rules: {
      "no-undef": "off",
      "no-console": "off",
      "no-redeclare": "off",
      "prefer-const": "off",

      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];