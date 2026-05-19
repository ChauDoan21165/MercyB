// Single source of truth for the medical / emergency safe-response copy.
//
// VI is composed DIRECTLY in natural Vietnamese — NOT translated from
// the EN. Register matches the canonical Mercy persona in
// src/config/mercyPersona.ts: informal-friendly, female teacher, Mercy
// self-refers as "mình", learner addressed as "bạn". Never "thầy"
// (the male term — Mercy is female) and never the strict-formal "em"
// register (reverted with PR #690's register half).
//
// Safety LOGIC (the crisis-keyword detection + the gate that fires this
// message) stays in each edge function and is unchanged. Only this
// user-facing copy is centralised, so guide-assistant and
// guide-english-helper can never drift into two different wordings for
// the same safety event again.
export const SAFE_RESPONSE = {
  en: "I can't safely help with medical or emergency situations. Please reach out to a doctor, a therapist, someone you trust, or your local emergency number. You deserve real support from a real person.",
  vi: "Việc này mình không hỗ trợ được — nó cần bác sĩ hoặc chuyên gia thật sự. Bạn liên hệ ngay với bác sĩ, chuyên gia tâm lý, người thân tin cậy, hoặc gọi số cấp cứu gần nhất nhé. Bạn không phải tự mình xoay xở chuyện này đâu.",
} as const;

// Brief native closing used where only a short encouragement slot fits
// (e.g. guide-english-helper's encouragement field on a crisis hit).
export const SAFE_ENCOURAGEMENT = {
  en: "Please take care of yourself.",
  vi: "Bạn nhớ chăm sóc bản thân nhé.",
} as const;
