import {
  VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
  generateToneReferenceAudio,
} from "../../src/lib/pronunciation/__fixtures__/vietnameseToneReferenceAudioFixtures";

type FixtureAudioResponse = {
  body: Uint8Array;
  headers: Record<string, string>;
  status: number;
};

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function encodePcm16Wav(samples: Float32Array): Uint8Array {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE, true);
  view.setUint32(28, VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, dataSize, true);

  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    const pcm = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(44 + index * bytesPerSample, pcm | 0, true);
  }

  return new Uint8Array(buffer);
}

export function vietnameseTtsAudioFixture(): FixtureAudioResponse {
  const samples = generateToneReferenceAudio({
    startHz: 185,
    endHz: 230,
    durationSeconds: 0.72,
  });
  const body = encodePcm16Wav(samples);

  return {
    status: 200,
    headers: {
      "content-type": "audio/wav",
      "x-tts-provider": "azure",
    },
    body,
  };
}
