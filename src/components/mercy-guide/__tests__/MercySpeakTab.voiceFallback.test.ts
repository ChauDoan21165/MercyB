import { describe, expect, it } from 'vitest';
import { selectEnglishBrowserTtsVoice } from '../MercySpeakTab';

type TestVoice = Pick<SpeechSynthesisVoice, 'lang' | 'name'>;

function voice(name: string, lang: string): TestVoice {
  return { name, lang };
}

describe('selectEnglishBrowserTtsVoice', () => {
  it('does not assign a non-English first device voice when only non-English voices exist', () => {
    const voices = [
      voice('Amelie', 'fr-FR'),
      voice('Linh', 'vi-VN'),
    ];

    expect(selectEnglishBrowserTtsVoice(voices)).toBeUndefined();
  });

  it('selects an English voice when it appears after a non-English first voice', () => {
    const englishVoice = voice('Daniel', 'en-GB');
    const voices = [
      voice('Amelie', 'fr-FR'),
      englishVoice,
    ];

    expect(selectEnglishBrowserTtsVoice(voices)).toBe(englishVoice);
  });

  it('preserves preferred en-US named voice behavior', () => {
    const preferredVoice = voice('Samantha', 'en-US');
    const voices = [
      voice('Alex', 'en-US'),
      voice('Daniel', 'en-GB'),
      preferredVoice,
    ];

    expect(selectEnglishBrowserTtsVoice(voices)).toBe(preferredVoice);
  });
});
