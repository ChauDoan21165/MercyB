import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

function readRepoFile(path: string) {
  return readFileSync(join(repoRoot, path), "utf8");
}

// EXPECTED is the source-of-truth fixture for native identity. Every
// release that touches Bundle IDs, applicationId, version codes, or
// MARKETING_VERSION must update this object — that's the conscious-
// commit point the test guards.
//
// The CI-runnable invariants (suite 1 below) hold three policies:
//   - iOS bundle id mirrors capacitor.config.ts appId (lockstep).
//   - Android applicationId is intentionally divergent from iOS — locked
//     at the first Play Store publish per `project_android_urls` memory;
//     do NOT "align" them.
//   - User-facing version (iOS MARKETING_VERSION / Android versionName)
//     is in lockstep across platforms.
//
// The scaffold-guarded suites (2 + 3) assert the generated native files
// match EXPECTED whenever the local dev environment has run `npx cap sync`.
// They self-skip on a fresh-clone CI runner that lacks ios/ or android/.
const EXPECTED = {
  capacitor: {
    appId: "com.chaudoan.mercyblade",
    appName: "Mercy Blade",
  },
  ios: {
    bundleId: "com.chaudoan.mercyblade",
    bundleDisplayName: "Mercy Blade",
    marketingVersion: "1.0.6",
    currentProjectVersion: "17",
  },
  android: {
    namespace: "com.mercyapps.mercyblade",
    applicationId: "com.mercyapps.mercyblade",
    versionName: "1.0.6",
    versionCode: 16,
    appName: "Mercy Blade",
    packageName: "com.mercyapps.mercyblade",
    customUrlScheme: "com.mercyapps.mercyblade",
  },
} as const;

const ANDROID_SCAFFOLD_PRESENT = existsSync(
  join(repoRoot, "android", "app", "build.gradle"),
);
const IOS_SCAFFOLD_PRESENT = existsSync(
  join(repoRoot, "ios", "App", "App", "Info.plist"),
);

function expectSingleMatch(text: string, pattern: RegExp, label: string) {
  const match = text.match(pattern);
  expect(match, `${label} missing`).not.toBeNull();
  return match?.[1] ?? "";
}

function androidStringValue(xml: string, name: string) {
  return expectSingleMatch(
    xml,
    new RegExp(`<string\\s+name="${name}">([^<]+)</string>`),
    `Android string ${name}`,
  );
}

function plistValue(plist: string, key: string) {
  return expectSingleMatch(
    plist,
    new RegExp(`<key>${key}</key>\\s*<string>([^<]+)</string>`),
    `iOS plist ${key}`,
  );
}

function pbxValues(pbxproj: string, key: string) {
  return Array.from(
    pbxproj.matchAll(new RegExp(`${key}\\s*=\\s*([^;]+);`, "g")),
    (match) => match[1].trim(),
  );
}

// ── Suite 1: CI-runnable. Guards EXPECTED against tracked sources and
//    enforces cross-platform identity policy invariants. Runs in CI and
//    every local environment regardless of cap-sync state.

describe("native identity — CI-runnable guards", () => {
  it("EXPECTED.capacitor matches capacitor.config.ts (tracked source)", () => {
    const capacitorConfig = readRepoFile("capacitor.config.ts");

    expect(
      expectSingleMatch(capacitorConfig, /appId:\s*['"]([^'"]+)['"]/, "Capacitor appId"),
    ).toBe(EXPECTED.capacitor.appId);
    expect(
      expectSingleMatch(capacitorConfig, /appName:\s*['"]([^'"]+)['"]/, "Capacitor appName"),
    ).toBe(EXPECTED.capacitor.appName);
  });

  it("iOS bundle id and display name mirror the Capacitor appId/appName (policy)", () => {
    expect(EXPECTED.ios.bundleId).toBe(EXPECTED.capacitor.appId);
    expect(EXPECTED.ios.bundleDisplayName).toBe(EXPECTED.capacitor.appName);
  });

  it("Android applicationId is intentionally divergent from iOS bundle id (locked at first Play publish)", () => {
    // Per `project_android_urls` memory: Android applicationId is permanently
    // divergent from the iOS bundle id. Do NOT "align" them — a future-self
    // attempting it will trip this test.
    expect(EXPECTED.android.applicationId).not.toBe(EXPECTED.ios.bundleId);
    expect(EXPECTED.android.applicationId).toBe("com.mercyapps.mercyblade");
    expect(EXPECTED.android.namespace).toBe(EXPECTED.android.applicationId);
    expect(EXPECTED.android.packageName).toBe(EXPECTED.android.applicationId);
    expect(EXPECTED.android.customUrlScheme).toBe(EXPECTED.android.applicationId);
  });

  it("user-facing version is in lockstep across iOS and Android", () => {
    expect(EXPECTED.ios.marketingVersion).toBe(EXPECTED.android.versionName);
  });

  it("app display name is in lockstep across iOS, Android, and Capacitor", () => {
    expect(EXPECTED.android.appName).toBe(EXPECTED.capacitor.appName);
    expect(EXPECTED.ios.bundleDisplayName).toBe(EXPECTED.capacitor.appName);
  });
});

// ── Suite 2: scaffold-guarded. Asserts generated Android files match
//    EXPECTED.android. Runs only where `npx cap sync android` has produced
//    the scaffolding.

describe("native identity — Android scaffold check (skips on fresh-clone CI)", () => {
  it.skipIf(!ANDROID_SCAFFOLD_PRESENT)(
    "generated Android files match EXPECTED.android",
    () => {
      const buildGradle = readRepoFile("android/app/build.gradle");
      const stringsXml = readRepoFile("android/app/src/main/res/values/strings.xml");

      expect(
        expectSingleMatch(buildGradle, /namespace\s*=?\s*["']([^"']+)["']/, "Android namespace"),
      ).toBe(EXPECTED.android.namespace);
      expect(
        expectSingleMatch(buildGradle, /applicationId\s+["']([^"']+)["']/, "Android applicationId"),
      ).toBe(EXPECTED.android.applicationId);
      expect(
        Number(expectSingleMatch(buildGradle, /versionCode\s+(\d+)/, "Android versionCode")),
      ).toBe(EXPECTED.android.versionCode);
      expect(
        expectSingleMatch(buildGradle, /versionName\s+["']([^"']+)["']/, "Android versionName"),
      ).toBe(EXPECTED.android.versionName);

      expect(androidStringValue(stringsXml, "app_name")).toBe(EXPECTED.android.appName);
      expect(androidStringValue(stringsXml, "package_name")).toBe(EXPECTED.android.packageName);
      expect(androidStringValue(stringsXml, "custom_url_scheme")).toBe(
        EXPECTED.android.customUrlScheme,
      );
    },
  );
});

// ── Suite 3: scaffold-guarded. Asserts generated iOS files match
//    EXPECTED.ios. Runs only where `npx cap sync ios` has produced the
//    scaffolding.

describe("native identity — iOS scaffold check (skips on fresh-clone CI)", () => {
  it.skipIf(!IOS_SCAFFOLD_PRESENT)(
    "generated iOS files match EXPECTED.ios",
    () => {
      const infoPlist = readRepoFile("ios/App/App/Info.plist");
      const pbxproj = readRepoFile("ios/App/App.xcodeproj/project.pbxproj");

      expect(plistValue(infoPlist, "CFBundleDisplayName")).toBe(EXPECTED.ios.bundleDisplayName);
      expect(pbxValues(pbxproj, "PRODUCT_BUNDLE_IDENTIFIER")).toEqual([
        EXPECTED.ios.bundleId,
        EXPECTED.ios.bundleId,
      ]);
      expect(pbxValues(pbxproj, "CURRENT_PROJECT_VERSION")).toEqual([
        EXPECTED.ios.currentProjectVersion,
        EXPECTED.ios.currentProjectVersion,
      ]);
      expect(pbxValues(pbxproj, "MARKETING_VERSION")).toEqual([
        EXPECTED.ios.marketingVersion,
        EXPECTED.ios.marketingVersion,
      ]);
    },
  );
});
