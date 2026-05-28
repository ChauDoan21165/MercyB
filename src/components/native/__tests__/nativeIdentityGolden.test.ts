import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

function readRepoFile(path: string) {
  return readFileSync(join(repoRoot, path), "utf8");
}

// The Android and iOS sub-tests pin identity values that live in
// Capacitor-managed native scaffolding (`android/`, `ios/`). Those
// directories are gitignored — they only exist locally after
// `npx cap sync android` / `npx cap sync ios`. On a fresh-clone CI
// runner the files are absent, which would make the tests fail with
// `ENOENT` even when nothing is actually wrong. We gate each sub-test
// on the presence of a sentinel file from the corresponding platform
// so the guard skips the test cleanly in CI and runs it for real in
// any dev environment where Capacitor has been synced.
//
// The Capacitor sub-test (`capacitor.config.ts`) is unguarded because
// that file IS tracked in git and is always present.
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

describe("native identity golden files", () => {
  it("pins the Capacitor app identity", () => {
    const capacitorConfig = readRepoFile("capacitor.config.ts");

    expect(expectSingleMatch(capacitorConfig, /appId:\s*['"]([^'"]+)['"]/, "Capacitor appId")).toBe(
      "com.chaudoan.mercyblade",
    );
    expect(expectSingleMatch(capacitorConfig, /appName:\s*['"]([^'"]+)['"]/, "Capacitor appName")).toBe(
      "Mercy Blade",
    );
  });

  it.skipIf(!ANDROID_SCAFFOLD_PRESENT)("pins the Android package identity and release version", () => {
    const buildGradle = readRepoFile("android/app/build.gradle");
    const stringsXml = readRepoFile("android/app/src/main/res/values/strings.xml");

    expect(expectSingleMatch(buildGradle, /namespace\s+["']([^"']+)["']/, "Android namespace")).toBe(
      "com.mercyapps.mercyblade",
    );
    expect(expectSingleMatch(buildGradle, /applicationId\s+["']([^"']+)["']/, "Android applicationId")).toBe(
      "com.mercyapps.mercyblade",
    );
    expect(Number(expectSingleMatch(buildGradle, /versionCode\s+(\d+)/, "Android versionCode"))).toBe(16);
    expect(expectSingleMatch(buildGradle, /versionName\s+["']([^"']+)["']/, "Android versionName")).toBe(
      "1.0.6",
    );

    expect(androidStringValue(stringsXml, "app_name")).toBe("Mercy Blade");
    expect(androidStringValue(stringsXml, "package_name")).toBe("com.mercyapps.mercyblade");
    expect(androidStringValue(stringsXml, "custom_url_scheme")).toBe("com.mercyapps.mercyblade");
  });

  it.skipIf(!IOS_SCAFFOLD_PRESENT)("pins the iOS bundle identity and release version", () => {
    const infoPlist = readRepoFile("ios/App/App/Info.plist");
    const pbxproj = readRepoFile("ios/App/App.xcodeproj/project.pbxproj");

    expect(plistValue(infoPlist, "CFBundleDisplayName")).toBe("Mercy Blade");
    expect(pbxValues(pbxproj, "PRODUCT_BUNDLE_IDENTIFIER")).toEqual([
      "com.chaudoan.mercyblade",
      "com.chaudoan.mercyblade",
    ]);
    expect(pbxValues(pbxproj, "CURRENT_PROJECT_VERSION")).toEqual(["17", "17"]);
    expect(pbxValues(pbxproj, "MARKETING_VERSION")).toEqual(["1.0.6", "1.0.6"]);
  });
});
