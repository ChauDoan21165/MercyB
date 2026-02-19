// src/lib/audio/getSignedAudio.ts
export async function getSignedAudio(path: string) {
  const res = await fetch("/functions/v1/sign-audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucket: "audio-private",
      path, // e.g. "vip3/test_private.mp3"
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to sign audio");
  }

  const { url } = await res.json();
  return url as string;
}
