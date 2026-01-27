/**
 * Web Worker utilities
 * Move heavy tasks to background threads
 */

/**
 * Create a web worker from a function
 *
 * NOTE:
 * - This helper is best-effort for simple tasks.
 * - You cannot safely capture outer-scope variables (like `task`) inside the worker unless you inline it.
 */
export function createWorkerFromFunction(fn: () => void): Worker {
  const blob = new Blob([`(${fn.toString()})()`], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

/**
 * Run task in web worker
 *
 * IMPORTANT:
 * - We serialize `task` into the worker as a string, reconstruct it via `new Function(...)`,
 *   and run it against posted `data`.
 * - This is intended for internal tooling/simulation tasks, not untrusted input.
 */
export async function runInWorker<T, R>(task: (data: T) => R, data: T): Promise<R> {
  return new Promise((resolve, reject) => {
    const worker = createWorkerFromFunction(() => {
      // Worker global scope (no TS types here)
      const ctx: any = self as any;

      ctx.onmessage = (e: any) => {
        const { taskSource, payload } = e.data || {};
        try {
          // Recreate the function inside the worker
          // eslint-disable-next-line no-new-func
          const fn = new Function(`return (${taskSource});`)() as (x: any) => any;
          const result = fn(payload);
          ctx.postMessage({ success: true, result });
        } catch (err: any) {
          ctx.postMessage({ success: false, error: err?.message ?? String(err) });
        }
      };
    });

    worker.onmessage = (e: MessageEvent) => {
      worker.terminate();
      const msg: any = (e as any).data;
      if (msg?.success) {
        resolve(msg.result as R);
      } else {
        reject(new Error(msg?.error ?? "Worker task failed"));
      }
    };

    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };

    worker.postMessage({ taskSource: task.toString(), payload: data });
  });
}

/**
 * JSON parsing in worker
 */
export async function parseJSONInWorker<T>(jsonString: string): Promise<T> {
  return runInWorker((data: string) => JSON.parse(data) as T, jsonString);
}

/**
 * Heavy computation in worker
 */
type WorkerPoolQueueItem = {
  task: (data: any) => any;
  data: any;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
};

export class WorkerPool {
  // NOTE: This implementation uses runInWorker (ephemeral workers) and does not keep a pool of live workers.
  // We keep these fields for API compatibility and future reuse.
  private workers: Worker[] = [];
  private queue: WorkerPoolQueueItem[] = [];
  private maxWorkers: number;
  private activeCount = 0;

  constructor(maxWorkers: number = (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4) {
    this.maxWorkers = maxWorkers;
  }

  async execute<T, R>(task: (data: T) => R, data: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.queue.push({
        task: task as (d: any) => any,
        data,
        resolve: resolve as (v: any) => void,
        reject: reject as (r: any) => void,
      });
      this.processQueue();
    });
  }

  private processQueue() {
    if (this.queue.length === 0) return;
    if (this.activeCount >= this.maxWorkers) return;

    const item = this.queue.shift();
    if (!item) return;

    this.activeCount += 1;

    runInWorker(item.task, item.data)
      .then((val) => item.resolve(val))
      .catch((err) => item.reject(err))
      .finally(() => {
        this.activeCount -= 1;
        this.processQueue();
      });
  }

  terminate() {
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
    this.queue = [];
    this.activeCount = 0;
  }
}

/**
 * Link validation in worker
 */
export async function validateLinksInWorker(
  urls: string[]
): Promise<Array<{ url: string; valid: boolean }>> {
  return runInWorker(
    (list: string[]) => {
      return list.map((url) => ({
        url,
        valid: url.startsWith("http://") || url.startsWith("https://"),
      }));
    },
    urls
  );
}

/**
 * Deep scan in worker
 */
export async function deepScanInWorker(data: any): Promise<any> {
  return runInWorker(
    (payload: any) => {
      // Perform deep validation (placeholder)
      return {
        valid: true,
        errors: [],
        payload,
      };
    },
    data
  );
}
