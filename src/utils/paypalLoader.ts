// src/utils/paypalLoader.ts

const PAYPAL_SDK_TIMEOUT_MS = 15000;

declare global {
  interface Window {
    paypal?: unknown;
  }
}

/**
 * Load PayPal SDK with timeout protection.
 * Throws on timeout or script load error.
 */
export async function loadPayPalSdk(clientId: string): Promise<void> {
  if (window.paypal) {
    if (import.meta.env.DEV) console.log("✅ PayPal SDK already loaded");
    return;
  }

  const existing = document.getElementById("paypal-sdk");
  if (existing) {
    if (import.meta.env.DEV) console.log("⏳ PayPal SDK script exists, waiting…");
    return waitForPayPal();
  }

  if (import.meta.env.DEV) console.log("📦 Loading PayPal SDK…");

  return new Promise((resolve, reject) => {
    const script   = document.createElement("script");
    script.id      = "paypal-sdk";
    script.src     = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons&intent=capture&commit=true&enable-funding=paypal&disable-funding=card,venmo,credit,sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort`;
    script.async   = true;

    const timeout = window.setTimeout(() => {
      script.remove();
      reject(new Error("PAYPAL_SDK_TIMEOUT"));
    }, PAYPAL_SDK_TIMEOUT_MS);

    script.onload = () => {
      window.clearTimeout(timeout);
      if (import.meta.env.DEV) console.log("✅ PayPal SDK loaded successfully");
      resolve();
    };

    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      if (import.meta.env.DEV) console.error("❌ Failed to load PayPal SDK script");
      reject(new Error("PAYPAL_SDK_LOAD_ERROR"));
    };

    document.body.appendChild(script);
  });
}

function waitForPayPal(): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkInterval = window.setInterval(() => {
      if (window.paypal) {
        window.clearInterval(checkInterval);
        resolve();
        return;
      }

      if (Date.now() - startTime > PAYPAL_SDK_TIMEOUT_MS) {
        window.clearInterval(checkInterval);
        reject(new Error("PAYPAL_SDK_TIMEOUT"));
      }
    }, 100);
  });
}