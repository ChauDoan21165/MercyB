const PAYPAL_SDK_TIMEOUT_MS = 15000;

declare global {
  interface Window {
    paypal?: any;
  }
}

/**
 * Load PayPal SDK with timeout protection
 * Returns clientId on success, throws on timeout or error
 */
export async function loadPayPalSdk(clientId: string): Promise<void> {
  // Already loaded
  if (window.paypal) {
    console.log('✅ PayPal SDK already loaded');
    return;
  }

  // Script tag exists but paypal not ready yet
  const existing = document.getElementById('paypal-sdk');
  if (existing) {
    console.log('⏳ PayPal SDK script exists, waiting...');
    // Wait for it with timeout
    return waitForPayPal();
  }

  console.log('📦 Loading PayPal SDK...');

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons&intent=capture&commit=true&enable-funding=paypal&disable-funding=card,venmo,credit,sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort`;
    script.async = true;

    // Set timeout to catch slow/hanging loads
    const timeout = setTimeout(() => {
      script.remove();
      reject(new Error('PAYPAL_SDK_TIMEOUT'));
    }, PAYPAL_SDK_TIMEOUT_MS);

    script.onload = () => {
      clearTimeout(timeout);
      console.log('✅ PayPal SDK loaded successfully');
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeout);
      script.remove();
      console.error('❌ Failed to load PayPal SDK script');
      reject(new Error('PAYPAL_SDK_LOAD_ERROR'));
    };

    document.body.appendChild(script);
  });
}

/**
 * Wait for existing PayPal SDK to become ready (with timeout)
 */
function waitForPayPal(): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkInterval = setInterval(() => {
      if (window.paypal) {
        clearInterval(checkInterval);
        resolve();
        return;
      }

      if (Date.now() - startTime > PAYPAL_SDK_TIMEOUT_MS) {
        clearInterval(checkInterval);
        reject(new Error('PAYPAL_SDK_TIMEOUT'));
      }
    }, 100);
  });
}
