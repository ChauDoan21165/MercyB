/**
 * Web Worker utilities
 * Move heavy tasks to background threads
 *
 * FIXES:
 * - Do NOT try to close over `task` inside the worker blob (it doesn't exist there).
 * - Strongly type resolve/reject callbacks (no `Function`).
 * - Properly manage a real worker pool (reuse workers instead of spawning per job).
 */

type ResolveFn<R> = (value: R | PromiseLike<R>) => void;
type RejectFn = (reason?: unknown) => void;

type WorkerMessage =
  | { id: string; ok: true; result: unknown }
  | { id: string; ok: false; error: string };

type WorkerRequest = { id: string; fn: string; data: unknown };

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Create a web worker from source code string
 */
function createWorkerFromSource(source: string): Worker {
  const blob = new Blob([source], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

/**
 * A generic worker that accepts a serialized function and data,
 * runs it, then posts back {id, ok, result|error}.
 */
const GENERIC_WORKER_SOURCE = `
self.onmessage = async (e) => {
  const msg = e.data || {};
  const id = msg.id;
  try {
    // Rehydrate function from string
    const fn = (0, eval)('(' + msg.fn + ')');
    const result = await fn(msg.data);
    self.postMessage({ id, ok: true, result });
  } catch (err) {
    const message = (err && err.message) ? err.message : String(err);
    self.postMessage({ id, ok: false, error: message });
  }
};
`;

/**
 * Run task in a dedicated one-off worker (simple API).
 * NOTE: task must be pure (no closure over outer scope).
 */
export async function runInWorker<T, R>(task: (data: T) => R | Promise<R>, data: T): Promise<R> {
  return new Promise<R>((resolve, reject) => {
    const worker = createWorkerFromSource(GENERIC_WORKER_SOURCE);
    const id = uid();

    const cleanup = () => {
      worker.terminate();
    };

    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      const msg = e.data;
      if (!msg || msg.id !== id) return;
      cleanup();
      if (msg.ok) resolve(msg.result as R);
      else reject(new Error(msg.error));
    };

    worker.onerror = (err) => {
      cleanup();
      reject(err);
    };

    const payload: WorkerRequest = { id, fn: task.toString(), data };
    worker.postMessage(payload);
  });
}

/**
 * JSON parsing in worker
 */
export async function parseJSONInWorker<T>(jsonString: string): Promise<T> {
  return runInWorker((s: string) => JSON.parse(s) as T, jsonString);
}

/**
 * WorkerPool: reuses workers and limits concurrency.
 * NOTE: task must be pure (no closure). Must be serializable via toString().
 */
export class WorkerPool {
  private readonly maxWorkers: number;
  private readonly idle: Worker[] = [];
  private readonly busy: Map<string, { worker: Worker; resolve: ResolveFn<any>; reject: RejectFn }> =
    new Map();
  private readonly queue: Array<{ id: string; fn: string; data: unknown; resolve: ResolveFn<any>; reject: RejectFn }> =
    [];

  constructor(maxWorkers: number = (typeof navigator !== "undefined" && navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : 4) {
    this.maxWorkers = Math.max(1, maxWorkers);
  }

  async execute<T, R>(task: (data: T) => R | Promise<R>, data: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const id = uid();
      this.queue.push({ id, fn: task.toString(), data, resolve, reject });
      this.pump();
    });
  }

  private makeWorker(): Worker {
    const worker = createWorkerFromSource(GENERIC_WORKER_SOURCE);

    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      const msg = e.data;
      if (!msg) return;

      const inflight = this.busy.get(msg.id);
      if (!inflight) return;

      this.busy.delete(msg.id);

      // Return worker to idle pool
      this.idle.push(inflight.worker);

      if (msg.ok) inflight.resolve(msg.result);
      else inflight.reject(new Error(msg.error));

      this.pump();
    };

    worker.onerror = (err) => {
      // If a worker errors, we can't reliably map it to an id; fail all busy jobs on that worker.
      // (Conservative, but prevents hung promises.)
      for (const [id, inflight] of this.busy.entries()) {
        if (inflight.worker === worker) {
          this.busy.delete(id);
          inflight.reject(err);
        }
      }
      try {
        worker.terminate();
      } catch {
        // ignore
      }
      this.pump();
    };

    return worker;
  }

  private getWorker(): Worker | null {
    if (this.idle.length > 0) return this.idle.pop()!;
    const total = this.idle.length + this.busy.size;
    if (total < this.maxWorkers) return this.makeWorker();
    return null;
  }

  private pump(): void {
    while (this.queue.length > 0) {
      const worker = this.getWorker();
      if (!worker) return;

      const job = this.queue.shift()!;
      this.busy.set(job.id, { worker, resolve: job.resolve, reject: job.reject });

      const payload: WorkerRequest = { id: job.id, fn: job.fn, data: job.data };
      worker.postMessage(payload);
    }
  }

  terminate(): void {
    for (const w of this.idle) {
      try {
        w.terminate();
      } catch {
        // ignore
      }
    }
    this.idle.length = 0;

    for (const [, inflight] of this.busy) {
      try {
        inflight.worker.terminate();
      } catch {
        // ignore
      }
      inflight.reject(new Error("WorkerPool terminated"));
    }
    this.busy.clear();

    for (const job of this.queue) {
      job.reject(new Error("WorkerPool terminated"));
    }
    this.queue.length = 0;
  }
}

/**
 * Link validation in worker
 */
export async function validateLinksInWorker(
  urls: string[]
): Promise<Array<{ url: string; valid: boolean }>> {
  return runInWorker((list: string[]) => {
    return list.map((url) => ({
      url,
      valid: url.startsWith("http://") || url.startsWith("https://"),
    }));
  }, urls);
}

/**
 * Deep scan in worker (stub)
 */
export async function deepScanInWorker(data: unknown): Promise<{ valid: boolean; errors: string[] }> {
  return runInWorker((payload: unknown) => {
    // Perform deep validation (stub)
    return { valid: true, errors: [] as string[] };
  }, data);
}