// FILE: src/pages/Account.tsx
// PURPOSE: Legacy compatibility shim.
// - Older code may import "@/pages/Account".
// - Real implementation lives in AccountPage.tsx.
// - This file simply re-exports it safely.

export { default } from "@/pages/AccountPage";
export * from "@/pages/AccountPage";