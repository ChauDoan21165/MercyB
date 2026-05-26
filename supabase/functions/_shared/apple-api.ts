import { AppleEnvironment, AppleRenewalInfo, AppleTransaction } from './apple-billing.ts';

type AppleApiConfig = {
  issuerId: string;
  keyId: string;
  privateKeyPem: string;
  bundleId: string;
  appAppleId?: number;
};

type TransactionInfoResponse = {
  signedTransactionInfo: string;
};

const APPLE_API_AUDIENCE = 'appstoreconnect-v1';
const APPLE_TOKEN_TTL_SECONDS = 60 * 5;

export function getAppleApiConfig(): AppleApiConfig {
  const issuerId = requiredEnv('APPLE_IAP_ISSUER_ID');
  const keyId = requiredEnv('APPLE_IAP_KEY_ID');
  const privateKeyPem = requiredEnv('APPLE_IAP_PRIVATE_KEY').replace(/\\n/g, '\n');
  const bundleId = requiredEnv('APPLE_BUNDLE_ID');
  const appAppleIdRaw = Deno.env.get('APPLE_APP_ID');

  return {
    issuerId,
    keyId,
    privateKeyPem,
    bundleId,
    appAppleId: appAppleIdRaw ? Number(appAppleIdRaw) : undefined,
  };
}

export async function verifyTransactionWithApple(args: {
  signedTransactionInfo?: string;
  transactionId?: string;
  environmentHint?: AppleEnvironment;
}): Promise<AppleTransaction> {
  const locallyDecoded = args.signedTransactionInfo
    ? decodeAndValidateTransaction(args.signedTransactionInfo)
    : null;

  const official = await fetchTransactionInfoFromApple({
    transactionId: args.transactionId ?? locallyDecoded?.transactionId ?? null,
    environmentHint: args.environmentHint ?? locallyDecoded?.environment,
  });

  if (locallyDecoded) {
    ensureTransactionMatches(locallyDecoded, official);
  }

  return official;
}

export async function fetchTransactionInfoFromApple(args: {
  transactionId: string | null;
  environmentHint?: AppleEnvironment;
}): Promise<AppleTransaction> {
  if (!args.transactionId) {
    throw new Error('transaction_id_required');
  }

  const config = getAppleApiConfig();
  const environments = orderedEnvironments(args.environmentHint);
  let lastError: Error | null = null;

  for (const environment of environments) {
    try {
      const token = await createAppleApiToken(config);
      const response = await fetch(
        `${appleBaseUrl(environment)}/inApps/v1/transactions/${encodeURIComponent(args.transactionId)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        const bodyText = await response.text();
        lastError = new Error(
          `apple_transaction_lookup_failed:${environment}:${response.status}:${bodyText}`,
        );
        continue;
      }

      const json = (await response.json()) as TransactionInfoResponse;
      const tx = decodeAndValidateTransaction(json.signedTransactionInfo);
      validateBundleAndApp(config, tx);
      return tx;
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error('apple_transaction_lookup_failed');
    }
  }

  throw lastError ?? new Error('apple_transaction_lookup_failed');
}

export function decodeAndValidateTransaction(
  signedTransactionInfo: string,
): AppleTransaction {
  const json = decodeJWSPayload<Record<string, unknown>>(
    signedTransactionInfo,
    'invalid_signed_transaction_info',
  );
  validateAppleTransaction(json);
  return json as AppleTransaction;
}

export function decodeAndValidateRenewalInfo(
  signedRenewalInfo: string,
): AppleRenewalInfo {
  const json = decodeJWSPayload<Record<string, unknown>>(
    signedRenewalInfo,
    'invalid_signed_renewal_info',
  );
  return json as AppleRenewalInfo;
}

export function decodeJWSPayload<T>(jws: string, errorCode = 'invalid_jws'): T {
  const parts = jws.split('.');
  if (parts.length < 2 || !parts[1]) {
    throw new Error(errorCode);
  }

  return JSON.parse(decodeBase64Url(parts[1])) as T;
}

export function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

export function validateAppleTransaction(
  value: unknown,
): asserts value is AppleTransaction {
  if (!value || typeof value !== 'object') throw new Error('invalid_transaction_payload');
  const tx = value as Record<string, unknown>;
  if (typeof tx.originalTransactionId !== 'string') {
    throw new Error('missing_original_transaction_id');
  }
  if (typeof tx.transactionId !== 'string') {
    throw new Error('missing_transaction_id');
  }
  if (typeof tx.productId !== 'string') {
    throw new Error('missing_product_id');
  }
  if (typeof tx.purchaseDate !== 'number') {
    throw new Error('missing_purchase_date');
  }
}

function validateBundleAndApp(config: AppleApiConfig, tx: AppleTransaction): void {
  if (tx.bundleId && tx.bundleId !== config.bundleId) {
    throw new Error(`bundle_id_mismatch:${tx.bundleId}`);
  }

  if (
    typeof config.appAppleId === 'number' &&
    typeof tx.appAppleId === 'number' &&
    tx.appAppleId !== config.appAppleId
  ) {
    throw new Error(`app_apple_id_mismatch:${tx.appAppleId}`);
  }
}

function ensureTransactionMatches(
  local: AppleTransaction,
  official: AppleTransaction,
): void {
  const mismatches: string[] = [];
  if (local.transactionId !== official.transactionId) mismatches.push('transactionId');
  if (local.originalTransactionId !== official.originalTransactionId) {
    mismatches.push('originalTransactionId');
  }
  if (local.productId !== official.productId) mismatches.push('productId');
  if (local.bundleId && official.bundleId && local.bundleId !== official.bundleId) {
    mismatches.push('bundleId');
  }
  if ((local.expiresDate ?? null) !== (official.expiresDate ?? null)) {
    mismatches.push('expiresDate');
  }

  if (mismatches.length > 0) {
    throw new Error(`apple_transaction_mismatch:${mismatches.join(',')}`);
  }
}

async function createAppleApiToken(config: AppleApiConfig): Promise<string> {
  const header = {
    alg: 'ES256',
    kid: config.keyId,
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: config.issuerId,
    iat: now,
    exp: now + APPLE_TOKEN_TTL_SECONDS,
    aud: APPLE_API_AUDIENCE,
    bid: config.bundleId,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const key = await importApplePrivateKey(config.privateKeyPem);
  const derSignature = new Uint8Array(
    await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      key,
      new TextEncoder().encode(unsigned),
    ),
  );

  return `${unsigned}.${base64UrlEncodeBytes(derToJose(derSignature, 64))}`;
}

async function importApplePrivateKey(privateKeyPem: string): Promise<CryptoKey> {
  const pemContents = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '');
  const keyBytes = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
}

function appleBaseUrl(environment: AppleEnvironment): string {
  if (environment === 'Sandbox' || environment === 'Xcode') {
    return 'https://api.storekit-sandbox.itunes.apple.com';
  }
  return 'https://api.storekit.itunes.apple.com';
}

function orderedEnvironments(hint?: AppleEnvironment): AppleEnvironment[] {
  if (hint === 'Sandbox' || hint === 'Xcode') return ['Sandbox'];
  if (hint === 'Production') return ['Production', 'Sandbox'];
  return ['Production', 'Sandbox'];
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`missing_env:${name}`);
  return value;
}

function base64UrlEncode(value: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function derToJose(der: Uint8Array, partLength: number): Uint8Array {
  let offset = 0;
  if (der[offset++] !== 0x30) throw new Error('invalid_der_signature');
  const seqLen = readDerLength(der, { current: offset });
  offset = seqLen.offset;

  const r = readDerInteger(der, { current: offset });
  offset = r.offset;
  const s = readDerInteger(der, { current: offset });
  offset = s.offset;

  const jose = new Uint8Array(partLength * 2);
  jose.set(leftPad(r.value, partLength), 0);
  jose.set(leftPad(s.value, partLength), partLength);
  return jose;
}

function readDerLength(
  input: Uint8Array,
  cursor: { current: number },
): { length: number; offset: number } {
  let length = input[cursor.current++];
  if ((length & 0x80) === 0) {
    return { length, offset: cursor.current };
  }
  const bytesToRead = length & 0x7f;
  length = 0;
  for (let i = 0; i < bytesToRead; i += 1) {
    length = (length << 8) | input[cursor.current++];
  }
  return { length, offset: cursor.current };
}

function readDerInteger(
  input: Uint8Array,
  cursor: { current: number },
): { value: Uint8Array; offset: number } {
  if (input[cursor.current++] !== 0x02) throw new Error('invalid_der_integer');
  const lengthInfo = readDerLength(input, cursor);
  cursor.current = lengthInfo.offset;
  let value = input.slice(cursor.current, cursor.current + lengthInfo.length);
  cursor.current += lengthInfo.length;
  while (value.length > 0 && value[0] === 0x00) {
    value = value.slice(1);
  }
  return { value, offset: cursor.current };
}

function leftPad(value: Uint8Array, length: number): Uint8Array {
  if (value.length > length) {
    return value.slice(value.length - length);
  }
  if (value.length === length) {
    return value;
  }
  const padded = new Uint8Array(length);
  padded.set(value, length - value.length);
  return padded;
}