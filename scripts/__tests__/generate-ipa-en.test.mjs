import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  FIXTURE_WORDS,
  arpabetPhonesToIpa,
  loadCmuDict,
  tokenizeEnglish,
} from "../cell-os/generate-ipa-en.mjs";

const expectedFixtureIpa = new Map([
  ["hello", "həlˈoʊ"],
  ["water", "wˈɔtɚ"],
  ["teacher", "tˈitʃɚ"],
  ["hospital", "hˈɑspˌɪtəl"],
  ["ticket", "tˈɪkət"],
  ["coffee", "kˈɑfi"],
  ["airport", "ˈɛrpˌɔrt"],
  ["doctor", "dˈɑktɚ"],
  ["pharmacy", "fˈɑrməsi"],
  ["apartment", "əpˈɑrtmənt"],
  ["restaurant", "rˈɛstɚˌɑnt"],
  ["address", "ˈædrˌɛs"],
  ["weekend", "wˈikˌɛnd"],
  ["what's", "wˈʌts"],
  ["o'clock", "əklˈɑk"],
]);

describe("generate-ipa-en", () => {
  it("keeps contractions while stripping surrounding punctuation", () => {
    expect(tokenizeEnglish("What's this? Seven o'clock, okay.")).toEqual([
      "what's",
      "this",
      "seven",
      "o'clock",
      "okay",
    ]);
  });

  it("converts the 15 reviewed CMUdict fixture words to expected IPA", () => {
    const dictText = fs.readFileSync(path.join(process.cwd(), "scripts/data/cmudict.dict"), "utf8");
    const { entries } = loadCmuDict(dictText);

    expect(FIXTURE_WORDS).toEqual([...expectedFixtureIpa.keys()]);

    for (const word of FIXTURE_WORDS) {
      const phones = entries.get(word);
      expect(phones, `${word} exists in CMUdict`).toBeTruthy();
      expect(arpabetPhonesToIpa(phones), word).toBe(expectedFixtureIpa.get(word));
    }
  });
});
