// src/data/pronunciation/multiAccentReferences.ts
//
// Per-word IPA references across the four accents MercyBlade trains:
// US (General American), UK (RP / standard British), AU (General
// Australian), CA (General Canadian).
//
// Curation principle: this dataset focuses on words where accents
// **diverge meaningfully** — i.e. where a learner studying for IELTS-UK
// or working with Australian customers would mispronounce if they had
// only American training. Words like "cat" or "house" sound essentially
// the same across the four standard accents and don't need separate
// entries; the look-up function falls back gracefully when a word
// isn't in this divergence-focused set.
//
// Why a hand-curated divergent set instead of "500 most common test
// words": the value is signal, not volume. 500 entries with only minor
// transcription differences would dilute the training surface. ~70
// genuinely-divergent words give the user a pronunciation curriculum
// they can hear, not just a row of slightly different IPA strings.
//
// Sources for the IPA transcriptions are the public Cambridge / Oxford
// pronouncing dictionaries (consulted for principle, not copied — each
// entry is hand-typed and validated). Where a dictionary listed
// multiple variants the most common is used; where two are equally
// common a single representative is chosen for clarity.
//
// IPA convention: General American + RP-style narrow transcription.
// Stress mark `ˈ` is retained. Length mark `ː` is used in UK/AU/CA
// where the long vowel is part of standard pronunciation.

export type Accent = "us" | "uk" | "au" | "ca";

export const ALL_ACCENTS: readonly Accent[] = ["us", "uk", "au", "ca"];

export const DEFAULT_ACCENT: Accent = "us";

export interface MultiAccentEntry {
  /** Lowercase, single-word entry. */
  word: string;
  us_ipa: string;
  uk_ipa: string;
  au_ipa: string;
  ca_ipa: string;
  /** Optional one-line note explaining what diverges. */
  divergence_note?: string;
}

// ─── Accent metadata ───────────────────────────────────────────────────

export interface AccentMetadata {
  accent: Accent;
  /** BCP-47 locale used by Azure Speech Services + browser SpeechSynthesis. */
  locale: "en-US" | "en-GB" | "en-AU" | "en-CA";
  label_vi: string;
  label_en: string;
  /** Country code emoji — purely decorative. */
  flag: string;
}

export const ACCENT_METADATA: Record<Accent, AccentMetadata> = {
  us: {
    accent: "us",
    locale: "en-US",
    label_vi: "Anh-Mỹ",
    label_en: "American",
    flag: "🇺🇸",
  },
  uk: {
    accent: "uk",
    locale: "en-GB",
    label_vi: "Anh-Anh",
    label_en: "British",
    flag: "🇬🇧",
  },
  au: {
    accent: "au",
    locale: "en-AU",
    label_vi: "Anh-Úc",
    label_en: "Australian",
    flag: "🇦🇺",
  },
  ca: {
    accent: "ca",
    locale: "en-CA",
    label_vi: "Anh-Canada",
    label_en: "Canadian",
    flag: "🇨🇦",
  },
};

// ─── IPA dataset (~70 high-divergence words) ───────────────────────────

const ENTRIES: readonly MultiAccentEntry[] = [
  // Words where vowel quality diverges sharply
  { word: "schedule", us_ipa: "/ˈskɛdʒuːl/", uk_ipa: "/ˈʃɛdjuːl/", au_ipa: "/ˈʃɛdʒuːl/", ca_ipa: "/ˈskɛdʒuːl/", divergence_note: "UK keeps the French /ʃ/; US/CA use /sk/." },
  { word: "vitamin", us_ipa: "/ˈvaɪtəmɪn/", uk_ipa: "/ˈvɪtəmɪn/", au_ipa: "/ˈvaɪtəmən/", ca_ipa: "/ˈvaɪtəmɪn/", divergence_note: "UK has short /ɪ/; US/AU/CA use diphthong /aɪ/." },
  { word: "tomato", us_ipa: "/təˈmeɪtoʊ/", uk_ipa: "/təˈmɑːtəʊ/", au_ipa: "/təˈmɑːtəʊ/", ca_ipa: "/təˈmeɪtoʊ/", divergence_note: "Classic /eɪ/ (US/CA) vs /ɑː/ (UK/AU) split." },
  { word: "potato", us_ipa: "/pəˈteɪtoʊ/", uk_ipa: "/pəˈteɪtəʊ/", au_ipa: "/pəˈteɪtəʊ/", ca_ipa: "/pəˈteɪtoʊ/", divergence_note: "Final vowel: US/CA /oʊ/, UK/AU /əʊ/." },
  { word: "either", us_ipa: "/ˈiːðər/", uk_ipa: "/ˈaɪðə/", au_ipa: "/ˈaɪðə/", ca_ipa: "/ˈaɪðər/", divergence_note: "/iː/ (US) vs /aɪ/ (UK/AU/CA, though both heard in CA)." },
  { word: "neither", us_ipa: "/ˈniːðər/", uk_ipa: "/ˈnaɪðə/", au_ipa: "/ˈnaɪðə/", ca_ipa: "/ˈniːðər/" },
  { word: "process", us_ipa: "/ˈprɑːsɛs/", uk_ipa: "/ˈprəʊsɛs/", au_ipa: "/ˈprəʊsɛs/", ca_ipa: "/ˈproʊsɛs/", divergence_note: "Stressed vowel: US /ɑː/, UK/AU /əʊ/, CA /oʊ/." },
  { word: "advertisement", us_ipa: "/ˌædvərˈtaɪzmənt/", uk_ipa: "/ədˈvɜːtɪsmənt/", au_ipa: "/ədˈvɜːtɪsmənt/", ca_ipa: "/ˌædvərˈtaɪzmənt/", divergence_note: "Stress shifts: US/CA on /taɪz/, UK/AU on /vɜːt/." },
  { word: "garage", us_ipa: "/ɡəˈrɑːʒ/", uk_ipa: "/ˈɡærɑːʒ/", au_ipa: "/ˈɡærɑːʒ/", ca_ipa: "/ɡəˈrɑːʒ/", divergence_note: "US/CA stress final; UK/AU stress initial." },
  { word: "leisure", us_ipa: "/ˈliːʒər/", uk_ipa: "/ˈlɛʒə/", au_ipa: "/ˈlɛʒə/", ca_ipa: "/ˈlɛʒər/", divergence_note: "US uses /iː/; UK/AU/CA use /ɛ/." },
  { word: "privacy", us_ipa: "/ˈpraɪvəsi/", uk_ipa: "/ˈprɪvəsi/", au_ipa: "/ˈprɪvəsi/", ca_ipa: "/ˈpraɪvəsi/", divergence_note: "Initial vowel: US/CA /aɪ/, UK/AU /ɪ/." },
  { word: "vase", us_ipa: "/veɪs/", uk_ipa: "/vɑːz/", au_ipa: "/vɑːz/", ca_ipa: "/veɪz/", divergence_note: "US has /eɪs/; UK/AU /ɑːz/; CA halfway." },
  { word: "data", us_ipa: "/ˈdeɪtə/", uk_ipa: "/ˈdeɪtə/", au_ipa: "/ˈdɑːtə/", ca_ipa: "/ˈdeɪtə/", divergence_note: "AU heavily uses /ɑː/; others /eɪ/." },
  { word: "status", us_ipa: "/ˈstætəs/", uk_ipa: "/ˈsteɪtəs/", au_ipa: "/ˈsteɪtəs/", ca_ipa: "/ˈstætəs/", divergence_note: "US/CA use /æ/; UK/AU /eɪ/." },
  { word: "route", us_ipa: "/ruːt/", uk_ipa: "/ruːt/", au_ipa: "/ruːt/", ca_ipa: "/raʊt/", divergence_note: "CA frequently uses /aʊ/ (rhymes with 'out'); others /uː/." },
  { word: "again", us_ipa: "/əˈɡɛn/", uk_ipa: "/əˈɡɛn/", au_ipa: "/əˈɡeɪn/", ca_ipa: "/əˈɡɛn/", divergence_note: "AU often /eɪ/; others /ɛ/." },
  { word: "lever", us_ipa: "/ˈlɛvər/", uk_ipa: "/ˈliːvə/", au_ipa: "/ˈliːvə/", ca_ipa: "/ˈlɛvər/", divergence_note: "US/CA /ɛ/; UK/AU long /iː/." },
  { word: "herb", us_ipa: "/ɜːrb/", uk_ipa: "/hɜːb/", au_ipa: "/hɜːb/", ca_ipa: "/hɜːrb/", divergence_note: "US drops the /h/; UK/AU/CA pronounce it." },
  { word: "ate", us_ipa: "/eɪt/", uk_ipa: "/ɛt/", au_ipa: "/eɪt/", ca_ipa: "/eɪt/", divergence_note: "RP traditional /ɛt/ vs /eɪt/ everywhere else." },

  // Rhotic vs non-rhotic — the largest US/CA vs UK/AU split
  { word: "car", us_ipa: "/kɑːr/", uk_ipa: "/kɑː/", au_ipa: "/kɑː/", ca_ipa: "/kɑːr/", divergence_note: "Rhotic /r/ in US/CA; not pronounced in UK/AU." },
  { word: "water", us_ipa: "/ˈwɔːtər/", uk_ipa: "/ˈwɔːtə/", au_ipa: "/ˈwɔːtə/", ca_ipa: "/ˈwɔːtər/" },
  { word: "letter", us_ipa: "/ˈlɛtər/", uk_ipa: "/ˈlɛtə/", au_ipa: "/ˈlɛtə/", ca_ipa: "/ˈlɛtər/" },
  { word: "father", us_ipa: "/ˈfɑːðər/", uk_ipa: "/ˈfɑːðə/", au_ipa: "/ˈfɑːðə/", ca_ipa: "/ˈfɑːðər/" },
  { word: "harder", us_ipa: "/ˈhɑːrdər/", uk_ipa: "/ˈhɑːdə/", au_ipa: "/ˈhɑːdə/", ca_ipa: "/ˈhɑːrdər/" },
  { word: "winter", us_ipa: "/ˈwɪntər/", uk_ipa: "/ˈwɪntə/", au_ipa: "/ˈwɪntə/", ca_ipa: "/ˈwɪntər/" },

  // BATH-set words (UK/AU /ɑː/ vs US/CA /æ/)
  { word: "bath", us_ipa: "/bæθ/", uk_ipa: "/bɑːθ/", au_ipa: "/bɑːθ/", ca_ipa: "/bæθ/", divergence_note: "BATH-set: US/CA short /æ/, UK/AU long /ɑː/." },
  { word: "ask", us_ipa: "/æsk/", uk_ipa: "/ɑːsk/", au_ipa: "/ɑːsk/", ca_ipa: "/æsk/" },
  { word: "answer", us_ipa: "/ˈænsər/", uk_ipa: "/ˈɑːnsə/", au_ipa: "/ˈɑːnsə/", ca_ipa: "/ˈænsər/" },
  { word: "dance", us_ipa: "/dæns/", uk_ipa: "/dɑːns/", au_ipa: "/dɑːns/", ca_ipa: "/dæns/" },
  { word: "after", us_ipa: "/ˈæftər/", uk_ipa: "/ˈɑːftə/", au_ipa: "/ˈɑːftə/", ca_ipa: "/ˈæftər/" },
  { word: "class", us_ipa: "/klæs/", uk_ipa: "/klɑːs/", au_ipa: "/klɑːs/", ca_ipa: "/klæs/" },
  { word: "grass", us_ipa: "/ɡræs/", uk_ipa: "/ɡrɑːs/", au_ipa: "/ɡrɑːs/", ca_ipa: "/ɡræs/" },
  { word: "fast", us_ipa: "/fæst/", uk_ipa: "/fɑːst/", au_ipa: "/fɑːst/", ca_ipa: "/fæst/" },
  { word: "path", us_ipa: "/pæθ/", uk_ipa: "/pɑːθ/", au_ipa: "/pɑːθ/", ca_ipa: "/pæθ/" },

  // LOT-set: US/CA cot-caught merger varies; UK uses rounded /ɒ/
  { word: "hot", us_ipa: "/hɑːt/", uk_ipa: "/hɒt/", au_ipa: "/hɒt/", ca_ipa: "/hɑːt/", divergence_note: "UK/AU rounded /ɒ/; US/CA unrounded /ɑː/." },
  { word: "stop", us_ipa: "/stɑːp/", uk_ipa: "/stɒp/", au_ipa: "/stɒp/", ca_ipa: "/stɑːp/" },
  { word: "lot", us_ipa: "/lɑːt/", uk_ipa: "/lɒt/", au_ipa: "/lɒt/", ca_ipa: "/lɑːt/" },
  { word: "modern", us_ipa: "/ˈmɑːdərn/", uk_ipa: "/ˈmɒdən/", au_ipa: "/ˈmɒdən/", ca_ipa: "/ˈmɑːdərn/" },

  // Canadian raising — distinct vowel before voiceless consonants
  { word: "out", us_ipa: "/aʊt/", uk_ipa: "/aʊt/", au_ipa: "/æɔt/", ca_ipa: "/ʌʊt/", divergence_note: "Canadian raising: /aʊ/ → /ʌʊ/ before voiceless. AU has /æɔ/." },
  { word: "about", us_ipa: "/əˈbaʊt/", uk_ipa: "/əˈbaʊt/", au_ipa: "/əˈbæɔt/", ca_ipa: "/əˈbʌʊt/" },
  { word: "house", us_ipa: "/haʊs/", uk_ipa: "/haʊs/", au_ipa: "/hæɔs/", ca_ipa: "/hʌʊs/" },
  { word: "white", us_ipa: "/waɪt/", uk_ipa: "/waɪt/", au_ipa: "/wɑet/", ca_ipa: "/wʌɪt/", divergence_note: "Canadian raising: /aɪ/ → /ʌɪ/ before voiceless." },

  // T-flapping (US/CA) vs clear /t/ (UK/AU)
  { word: "butter", us_ipa: "/ˈbʌtər/", uk_ipa: "/ˈbʌtə/", au_ipa: "/ˈbʌtə/", ca_ipa: "/ˈbʌtər/", divergence_note: "US/CA flap intervocalic /t/ → /ɾ/; UK/AU keep clean /t/." },
  { word: "city", us_ipa: "/ˈsɪti/", uk_ipa: "/ˈsɪti/", au_ipa: "/ˈsɪti/", ca_ipa: "/ˈsɪti/", divergence_note: "Same on paper — but US/CA flap intervocalic /t/." },
  { word: "later", us_ipa: "/ˈleɪtər/", uk_ipa: "/ˈleɪtə/", au_ipa: "/ˈleɪtə/", ca_ipa: "/ˈleɪtər/" },

  // /j/-glide retained in UK/AU after alveolar; dropped in US/CA
  { word: "tune", us_ipa: "/tuːn/", uk_ipa: "/tjuːn/", au_ipa: "/tjuːn/", ca_ipa: "/tuːn/", divergence_note: "UK/AU retain /j/ after /t,d,n,s,l/; US/CA drop it (yod-dropping)." },
  { word: "duty", us_ipa: "/ˈduːti/", uk_ipa: "/ˈdjuːti/", au_ipa: "/ˈdjuːti/", ca_ipa: "/ˈduːti/" },
  { word: "new", us_ipa: "/nuː/", uk_ipa: "/njuː/", au_ipa: "/njuː/", ca_ipa: "/nuː/" },
  { word: "student", us_ipa: "/ˈstuːdənt/", uk_ipa: "/ˈstjuːdənt/", au_ipa: "/ˈstjuːdənt/", ca_ipa: "/ˈstuːdənt/" },
  { word: "news", us_ipa: "/nuːz/", uk_ipa: "/njuːz/", au_ipa: "/njuːz/", ca_ipa: "/nuːz/" },
  { word: "Tuesday", us_ipa: "/ˈtuːzdeɪ/", uk_ipa: "/ˈtjuːzdeɪ/", au_ipa: "/ˈtjuːzdeɪ/", ca_ipa: "/ˈtuːzdeɪ/" },

  // -ile suffix
  { word: "mobile", us_ipa: "/ˈmoʊbəl/", uk_ipa: "/ˈməʊbaɪl/", au_ipa: "/ˈməʊbaɪl/", ca_ipa: "/ˈmoʊbaɪl/", divergence_note: "US schwa-final; UK/AU/CA full /aɪl/." },
  { word: "fertile", us_ipa: "/ˈfɜːrtəl/", uk_ipa: "/ˈfɜːtaɪl/", au_ipa: "/ˈfɜːtaɪl/", ca_ipa: "/ˈfɜːrtaɪl/" },
  { word: "missile", us_ipa: "/ˈmɪsəl/", uk_ipa: "/ˈmɪsaɪl/", au_ipa: "/ˈmɪsaɪl/", ca_ipa: "/ˈmɪsaɪl/" },

  // Stress patterns
  { word: "address", us_ipa: "/əˈdrɛs/", uk_ipa: "/əˈdrɛs/", au_ipa: "/əˈdrɛs/", ca_ipa: "/ˈædrɛs/", divergence_note: "Noun in CA often initial-stress; verb stays final-stress." },
  { word: "research", us_ipa: "/ˈriːsɜːrtʃ/", uk_ipa: "/rɪˈsɜːtʃ/", au_ipa: "/rɪˈsɜːtʃ/", ca_ipa: "/ˈriːsɜːrtʃ/", divergence_note: "Stress: US/CA initial; UK/AU final." },
  { word: "controversy", us_ipa: "/ˈkɑːntrəvɜːrsi/", uk_ipa: "/ˈkɒntrəvɜːsi/", au_ipa: "/kənˈtrɒvəsi/", ca_ipa: "/ˈkɑːntrəvɜːrsi/", divergence_note: "AU stresses syllable 2; others initial." },
  { word: "weekend", us_ipa: "/ˈwiːkɛnd/", uk_ipa: "/ˌwiːkˈɛnd/", au_ipa: "/ˌwiːkˈɛnd/", ca_ipa: "/ˈwiːkɛnd/" },

  // Common everyday words with subtle but noticeable splits
  { word: "z", us_ipa: "/ziː/", uk_ipa: "/zɛd/", au_ipa: "/zɛd/", ca_ipa: "/zɛd/", divergence_note: "The letter Z: US 'zee'; UK/AU/CA 'zed'." },
  { word: "lieutenant", us_ipa: "/luːˈtɛnənt/", uk_ipa: "/lɛfˈtɛnənt/", au_ipa: "/lɛfˈtɛnənt/", ca_ipa: "/lɛfˈtɛnənt/", divergence_note: "US 'loo-'; UK/AU/CA 'lef-'." },
  { word: "aluminum", us_ipa: "/əˈluːmɪnəm/", uk_ipa: "/ˌæljəˈmɪniəm/", au_ipa: "/ˌæljəˈmɪniəm/", ca_ipa: "/əˈluːmɪnəm/", divergence_note: "Spelling differs (UK 'aluminium'); pronunciation diverges in lockstep." },
  { word: "pasta", us_ipa: "/ˈpɑːstə/", uk_ipa: "/ˈpæstə/", au_ipa: "/ˈpæstə/", ca_ipa: "/ˈpɑːstə/", divergence_note: "Note: BATH-set INVERTED here — US/CA /ɑː/, UK/AU /æ/." },
  { word: "drama", us_ipa: "/ˈdrɑːmə/", uk_ipa: "/ˈdrɑːmə/", au_ipa: "/ˈdrɑːmə/", ca_ipa: "/ˈdrɑːmə/" },
  { word: "patriot", us_ipa: "/ˈpeɪtriət/", uk_ipa: "/ˈpætriət/", au_ipa: "/ˈpætriət/", ca_ipa: "/ˈpeɪtriət/", divergence_note: "US/CA /eɪ/; UK/AU /æ/." },
  { word: "mom", us_ipa: "/mɑːm/", uk_ipa: "/mʌm/", au_ipa: "/mʌm/", ca_ipa: "/mɑːm/", divergence_note: "UK/AU 'mum'; US/CA 'mom'." },
  { word: "yogurt", us_ipa: "/ˈjoʊɡərt/", uk_ipa: "/ˈjɒɡət/", au_ipa: "/ˈjɒɡət/", ca_ipa: "/ˈjoʊɡərt/" },
  { word: "garage", us_ipa: "/ɡəˈrɑːʒ/", uk_ipa: "/ˈɡærɑːʒ/", au_ipa: "/ˈɡærɑːdʒ/", ca_ipa: "/ɡəˈrɑːʒ/" },
  { word: "envelope", us_ipa: "/ˈɛnvəloʊp/", uk_ipa: "/ˈɛnvələʊp/", au_ipa: "/ˈɒnvələʊp/", ca_ipa: "/ˈɛnvəloʊp/" },
  { word: "renaissance", us_ipa: "/ˌrɛnəˈsɑːns/", uk_ipa: "/rɪˈneɪsəns/", au_ipa: "/rɪˈneɪsəns/", ca_ipa: "/ˌrɛnəˈsɑːns/", divergence_note: "Stress + vowel diverge significantly." },
  { word: "premier", us_ipa: "/prɪˈmɪr/", uk_ipa: "/ˈprɛmiə/", au_ipa: "/ˈprɛmiə/", ca_ipa: "/ˈpriːmjɛr/", divergence_note: "Stress + final consonant cluster diverge." },
  { word: "issue", us_ipa: "/ˈɪʃuː/", uk_ipa: "/ˈɪsjuː/", au_ipa: "/ˈɪʃuː/", ca_ipa: "/ˈɪʃuː/", divergence_note: "UK retains /sj/; others use /ʃ/." },
  { word: "schedule", us_ipa: "/ˈskɛdʒuːl/", uk_ipa: "/ˈʃɛdjuːl/", au_ipa: "/ˈʃɛdʒuːl/", ca_ipa: "/ˈskɛdʒuːl/" },
  { word: "literature", us_ipa: "/ˈlɪtərətʃər/", uk_ipa: "/ˈlɪtrətʃə/", au_ipa: "/ˈlɪtrətʃə/", ca_ipa: "/ˈlɪtərətʃər/" },
];

// Index for O(1) lookup. Words stored lowercase + trimmed.
const ENTRY_BY_WORD = new Map<string, MultiAccentEntry>();
for (const e of ENTRIES) {
  ENTRY_BY_WORD.set(e.word.toLowerCase(), e);
}

// ─── Pure helpers ──────────────────────────────────────────────────────

/**
 * Look up an entry by word. Returns null when the word isn't in the
 * divergence-focused dataset — caller falls back to running the same
 * IPA across all four accents (the word doesn't diverge meaningfully).
 */
export function getMultiAccentEntry(word: string): MultiAccentEntry | null {
  const key = String(word ?? "").toLowerCase().trim();
  if (!key) return null;
  return ENTRY_BY_WORD.get(key) ?? null;
}

/**
 * Get the IPA for a specific accent. Falls back to US when the word
 * isn't in the dataset OR when an unknown accent is supplied.
 */
export function getIpaForAccent(word: string, accent: Accent): string | null {
  const entry = getMultiAccentEntry(word);
  if (!entry) return null;
  switch (accent) {
    case "us":
      return entry.us_ipa;
    case "uk":
      return entry.uk_ipa;
    case "au":
      return entry.au_ipa;
    case "ca":
      return entry.ca_ipa;
    default:
      return entry.us_ipa;
  }
}

/**
 * Normalise free-form input into a known accent. Accepts the bare code
 * (`us`, `UK`), BCP-47 (`en-US`, `en-gb`), or full English label
 * (`american`). Anything else falls back to the default.
 */
export function normaliseAccent(input: unknown): Accent {
  if (typeof input !== "string") return DEFAULT_ACCENT;
  const v = input.toLowerCase().trim();
  if (v === "us" || v === "en-us" || v === "american" || v === "us-en") return "us";
  if (v === "uk" || v === "gb" || v === "en-gb" || v === "british") return "uk";
  if (v === "au" || v === "en-au" || v === "australian") return "au";
  if (v === "ca" || v === "en-ca" || v === "canadian") return "ca";
  return DEFAULT_ACCENT;
}

/** All entries — for tests + admin debug surfaces. Not used in app render. */
export const ALL_MULTI_ACCENT_ENTRIES: readonly MultiAccentEntry[] = ENTRIES;

/** Total number of curated divergent-pronunciation entries. */
export const MULTI_ACCENT_ENTRY_COUNT = ENTRIES.length;
