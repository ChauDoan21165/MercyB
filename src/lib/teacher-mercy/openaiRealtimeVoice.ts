import { supabase } from "@/lib/supabaseClient";

export type RealtimeTutorMode = "journey" | "speak";
export type OpenAiRealtimeStatus = "idle" | "connecting" | "connected" | "fallback" | "error";

export interface RealtimeSessionRequest {
  mode: RealtimeTutorMode;
  targetLanguage: string;
  explainLanguage: string;
}

export interface RealtimeSessionSecret {
  clientSecret: string;
  expiresAt: number | null;
  model: string;
  voice: string;
}

export interface RealtimeVoiceConnection {
  status: "connected";
  stop: () => void;
}

export function supportsOpenAiRealtimeVoice(): boolean {
  return typeof window !== "undefined" &&
    typeof window.RTCPeerConnection !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia;
}

export function sanitizeRealtimeFallbackText(text: string): string {
  return String(text ?? "").replace(/\s+/g, " ").trim();
}

export async function fetchOpenAiRealtimeSession(
  request: RealtimeSessionRequest,
): Promise<RealtimeSessionSecret | null> {
  const { data, error } = await supabase.functions.invoke<Partial<RealtimeSessionSecret>>(
    "openai-realtime-session",
    {
      body: {
        mode: request.mode,
        targetLanguage: request.targetLanguage,
        explainLanguage: request.explainLanguage,
      },
    },
  );

  if (error || typeof data?.clientSecret !== "string" || !data.clientSecret) return null;
  return {
    clientSecret: data.clientSecret,
    expiresAt: typeof data.expiresAt === "number" ? data.expiresAt : null,
    model: typeof data.model === "string" ? data.model : "gpt-realtime",
    voice: typeof data.voice === "string" ? data.voice : "marin",
  };
}

export async function connectOpenAiRealtimeVoice(
  session: RealtimeSessionSecret,
): Promise<RealtimeVoiceConnection> {
  if (!supportsOpenAiRealtimeVoice()) {
    throw new Error("Realtime voice is not supported in this browser.");
  }

  const peerConnection = new window.RTCPeerConnection();
  const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioElement = document.createElement("audio");
  audioElement.autoplay = true;
  audioElement.dataset.teacherMercyRealtime = "true";

  peerConnection.ontrack = (event) => {
    audioElement.srcObject = event.streams[0] ?? null;
  };

  for (const track of localStream.getAudioTracks()) {
    peerConnection.addTrack(track, localStream);
  }

  peerConnection.createDataChannel("oai-events");
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    body: offer.sdp ?? "",
    headers: {
      Authorization: `Bearer ${session.clientSecret}`,
      "Content-Type": "application/sdp",
    },
  });

  if (!sdpResponse.ok) {
    for (const track of localStream.getTracks()) track.stop();
    peerConnection.close();
    throw new Error("Realtime voice connection failed.");
  }

  await peerConnection.setRemoteDescription({
    type: "answer",
    sdp: await sdpResponse.text(),
  });

  document.body.appendChild(audioElement);

  return {
    status: "connected",
    stop: () => {
      for (const track of localStream.getTracks()) track.stop();
      peerConnection.close();
      audioElement.remove();
    },
  };
}
