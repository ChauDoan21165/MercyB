export type NetworkTimeoutReason = "timeout" | "network_error";

export class NetworkTimeoutError extends Error {
  constructor(
    message: string,
    public readonly reason: NetworkTimeoutReason = "timeout",
  ) {
    super(message);
    this.name = "NetworkTimeoutError";
  }
}

type FetchWithTimeoutInit = RequestInit & {
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

const DEFAULT_FETCH_TIMEOUT_MS = 15_000;

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: FetchWithTimeoutInit = {},
): Promise<Response> {
  const {
    timeoutMs = DEFAULT_FETCH_TIMEOUT_MS,
    fetchImpl = globalThis.fetch,
    signal: upstreamSignal,
    ...requestInit
  } = init;
  const controller = new AbortController();
  let didTimeout = false;

  const abortFromUpstream = () => controller.abort(upstreamSignal?.reason);
  if (upstreamSignal?.aborted) {
    abortFromUpstream();
  } else {
    upstreamSignal?.addEventListener("abort", abortFromUpstream, { once: true });
  }

  const timer = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, Math.max(1, timeoutMs));

  try {
    return await fetchImpl(input, {
      ...requestInit,
      signal: controller.signal,
    });
  } catch (error) {
    if (
      didTimeout ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw new NetworkTimeoutError(`Network request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
    upstreamSignal?.removeEventListener("abort", abortFromUpstream);
  }
}

type InvokeOptions = {
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  [key: string]: unknown;
};

type InvokeResult<T> = {
  data: T | null;
  error: unknown;
};

type SupabaseFunctionsClient = {
  functions: {
    invoke: <T = unknown>(
      functionName: string,
      options?: never,
    ) => Promise<InvokeResult<T> | { data: T | null; error: Error | null }>;
  };
};

export async function invokeFunctionWithTimeout<T>(
  client: SupabaseFunctionsClient,
  functionName: string,
  options: InvokeOptions = {},
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS,
): Promise<InvokeResult<T>> {
  const controller = new AbortController();
  let didTimeout = false;
  const timer = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, Math.max(1, timeoutMs));

  try {
    return await client.functions.invoke<T>(functionName, {
      ...options,
      signal: controller.signal,
    } as never);
  } catch (error) {
    if (
      didTimeout ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw new NetworkTimeoutError(
        `Function ${functionName} timed out after ${timeoutMs}ms`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
