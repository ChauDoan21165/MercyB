import { detectAudioObservations } from "../obs/detectors/audio";
import { detectLearningObservation } from "../obs/detectors/learning";
import { detectSpeechObservations } from "../obs/detectors/speech";
import { createObservationPacket } from "../obs/evidencePacket";
import type { AudioObservationInput, LearningObservationInput, ObservationPacket, SpeechObservationInput } from "../obs/types";

export function observationPacketFromAudio(input: AudioObservationInput, observedAt?: string): ObservationPacket {
  return createObservationPacket(detectAudioObservations(input, observedAt), observedAt);
}

export function observationPacketFromSpeech(input: SpeechObservationInput, observedAt?: string): ObservationPacket {
  return createObservationPacket(detectSpeechObservations(input, observedAt), observedAt);
}

export function observationPacketFromLearning(inputs: LearningObservationInput[], observedAt?: string): ObservationPacket {
  return createObservationPacket(inputs.map((input) => detectLearningObservation(input, observedAt)), observedAt);
}
