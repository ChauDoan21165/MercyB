// src/lib/tracking/__tests__/utm.test.ts

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  __resetUtmStorageForTests,
  attachUtmToSignup,
  captureUtmFromCurrentUrl,
  getStoredUtm,
  parseUtmParams,
  storeUtmInSession,
} from "../utm";

beforeEach(() => {
  __resetUtmStorageForTests();
});

afterEach(() => {
  __resetUtmStorageForTests();
});

describe("parseUtmParams", () => {
  it("extracts all five UTM params", () => {
    const url =
      "https://mercyblade.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=spring2026&utm_term=ielts&utm_content=ad1";
    expect(parseUtmParams(url)).toEqual({
      utm_source: "facebook",
      utm_medium: "cpc",
      utm_campaign: "spring2026",
      utm_term: "ielts",
      utm_content: "ad1",
    });
  });

  it("returns null when URL has no UTM params", () => {
    expect(parseUtmParams("https://mercyblade.com/")).toBeNull();
  });

  it("returns null on malformed URL", () => {
    expect(parseUtmParams("not a url")).toBeNull();
  });

  it("ignores empty/whitespace UTM values", () => {
    const url = "https://mercyblade.com/?utm_source=&utm_campaign=%20%20";
    expect(parseUtmParams(url)).toBeNull();
  });

  it("returns partial UTM when only some keys are present", () => {
    const url =
      "https://mercyblade.com/?utm_source=tiktok&utm_campaign=launch";
    expect(parseUtmParams(url)).toEqual({
      utm_source: "tiktok",
      utm_medium: null,
      utm_campaign: "launch",
      utm_term: null,
      utm_content: null,
    });
  });

  it("trims surrounding whitespace from values", () => {
    const url = "https://mercyblade.com/?utm_source=%20facebook%20";
    expect(parseUtmParams(url)?.utm_source).toBe("facebook");
  });
});

describe("storeUtmInSession + getStoredUtm — first-touch wins", () => {
  it("stores and retrieves UTM in sessionStorage", () => {
    const utm = parseUtmParams("https://x.com/?utm_source=fb&utm_campaign=c1");
    expect(utm).not.toBeNull();
    storeUtmInSession(utm!);
    expect(getStoredUtm()).toEqual(utm);
  });

  it("does not overwrite once a value is stored (first touch wins)", () => {
    const first = parseUtmParams("https://x.com/?utm_source=fb")!;
    const second = parseUtmParams("https://x.com/?utm_source=tiktok")!;
    storeUtmInSession(first);
    storeUtmInSession(second);
    expect(getStoredUtm()?.utm_source).toBe("fb");
  });

  it("returns null when sessionStorage is empty", () => {
    expect(getStoredUtm()).toBeNull();
  });

  it("returns null when stored value is unparseable", () => {
    window.sessionStorage.setItem("mb_utm_first_touch", "{not valid json");
    expect(getStoredUtm()).toBeNull();
  });
});

describe("captureUtmFromCurrentUrl", () => {
  const originalHref = window.location.href;

  afterEach(() => {
    window.history.replaceState(null, "", originalHref);
  });

  it("captures UTM from window.location and persists it", () => {
    window.history.replaceState(
      null,
      "",
      "/?utm_source=instagram&utm_campaign=launch",
    );
    const captured = captureUtmFromCurrentUrl();
    expect(captured?.utm_source).toBe("instagram");
    expect(getStoredUtm()?.utm_campaign).toBe("launch");
  });

  it("returns null and stores nothing when current URL has no UTM", () => {
    window.history.replaceState(null, "", "/");
    expect(captureUtmFromCurrentUrl()).toBeNull();
    expect(getStoredUtm()).toBeNull();
  });
});

describe("attachUtmToSignup", () => {
  it("merges stored UTM into signup payload", () => {
    storeUtmInSession({
      utm_source: "fb",
      utm_medium: "cpc",
      utm_campaign: "c1",
      utm_term: null,
      utm_content: null,
    });
    const signup = attachUtmToSignup({ display_name: "Lan" });
    expect(signup).toEqual({
      display_name: "Lan",
      utm_source: "fb",
      utm_medium: "cpc",
      utm_campaign: "c1",
    });
  });

  it("returns input unchanged when nothing is stored", () => {
    const signup = attachUtmToSignup({ display_name: "Lan" });
    expect(signup).toEqual({ display_name: "Lan" });
  });

  it("does not overwrite existing utm_* keys on the input", () => {
    storeUtmInSession({
      utm_source: "fb",
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
    });
    const signup = attachUtmToSignup({
      display_name: "Lan",
      utm_source: "explicit",
    });
    expect(signup.utm_source).toBe("explicit");
  });

  it("does not mutate the input object", () => {
    storeUtmInSession({
      utm_source: "fb",
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
    });
    const input = { display_name: "Lan" };
    const out = attachUtmToSignup(input);
    expect(input).toEqual({ display_name: "Lan" });
    expect(out).not.toBe(input);
  });
});
