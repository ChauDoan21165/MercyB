import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getVoiceStatus,
  speakTutorText,
  stopTutorSpeech,
} from "@/lib/teacher-mercy/voiceEngine";

const { fetchCloudTtsUrl } = vi.hoisted(() => ({
  fetchCloudTtsUrl: vi.fn(),
}));

vi.mock("@/lib/mercyVoice", () => ({
  fetchCloudTtsUrl,
}));

class FakeUtterance {
  text: string;
  lang = "";
  rate = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

class EndingAudio {
  static last: EndingAudio | null = null;
  src: string;
  onplay: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  pause = vi.fn();

  constructor(src: string) {
    this.src = src;
    (this.constructor as typeof EndingAudio).last = this;
  }

  async play() {
    this.onplay?.();
    this.onended?.();
  }
}

class HoldingAudio extends EndingAudio {
  async play() {
    this.onplay?.();
  }
}

function installSpeechSynthesis() {
  const speak = vi.fn((utterance: FakeUtterance) => {
    utterance.onstart?.();
    utterance.onend?.();
  });
  const cancel = vi.fn();
  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    configurable: true,
    value: FakeUtterance,
  });
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: {
      speak,
      cancel,
      getVoices: vi.fn(() => []),
      resume: vi.fn(),
    },
  });
  return { speak, cancel };
}

describe("Teacher Mercy voiceEngine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stopTutorSpeech();
    installSpeechSynthesis();
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: EndingAudio,
    });
    EndingAudio.last = null;
  });

  it("calls cloud Mercy voice first when enabled", async () => {
    const synth = installSpeechSynthesis();
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.test/mercy.mp3", cached: false });

    const result = await speakTutorText("Mercy reads this.", {
      targetLanguage: "en",
      preferCloudVoice: true,
      fallbackToBrowserTts: true,
    });

    expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: "Mercy reads this.",
      language: "en",
    });
    expect(EndingAudio.last?.src).toBe("https://example.test/mercy.mp3");
    expect(synth.speak).not.toHaveBeenCalled();
    expect(result.cloud).toBe(true);
  });

  it("uses browser fallback when cloud fails", async () => {
    const synth = installSpeechSynthesis();
    fetchCloudTtsUrl.mockResolvedValue(null);

    const result = await speakTutorText("Use device voice.", {
      targetLanguage: "en",
      preferCloudVoice: true,
      fallbackToBrowserTts: true,
    });

    expect(fetchCloudTtsUrl).toHaveBeenCalled();
    expect(synth.speak).toHaveBeenCalledTimes(1);
    expect(result.fallback).toBe(true);
  });

  it("stop cancels playback", async () => {
    const synth = installSpeechSynthesis();
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.test/hold.mp3", cached: false });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: HoldingAudio,
    });

    void speakTutorText("Long line.", {
      targetLanguage: "en",
      preferCloudVoice: true,
      fallbackToBrowserTts: true,
    });
    await vi.waitFor(() => expect(getVoiceStatus().speaking).toBe(true));

    const audio = HoldingAudio.last;
    stopTutorSpeech();

    expect(audio?.pause).toHaveBeenCalled();
    expect(synth.cancel).toHaveBeenCalled();
    expect(getVoiceStatus().status).toBe("idle");
  });

  it("does not speak raw wrong input by default", async () => {
    const synth = installSpeechSynthesis();

    const result = await speakTutorText("She go to school.", {
      targetLanguage: "en",
      preferCloudVoice: true,
      fallbackToBrowserTts: true,
      rawUserInput: "She go to school.",
    });

    expect(result.spoken).toBe(false);
    expect(result.text).toBe("");
    expect(fetchCloudTtsUrl).not.toHaveBeenCalled();
    expect(synth.speak).not.toHaveBeenCalled();
  });

  it("maps target language to the correct browser voice locale", async () => {
    const synth = installSpeechSynthesis();

    await speakTutorText("Bonjour.", {
      targetLanguage: "fr",
      preferCloudVoice: false,
      fallbackToBrowserTts: true,
    });

    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.lang).toBe("fr-FR");
  });

  it("still attempts cloud Mercy voice first for multilingual tutor targets", async () => {
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.test/french.mp3", cached: false });

    const result = await speakTutorText("Bonjour.", {
      targetLanguage: "fr",
      preferCloudVoice: true,
      fallbackToBrowserTts: true,
    });

    expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: "Bonjour.",
      language: "en",
    });
    expect(result.cloud).toBe(true);
    expect(result.locale).toBe("fr-FR");
  });
});
