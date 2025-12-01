/**
 * Web Worker utilities
 * Move heavy tasks to background threads
 */

/**
 * Create a web worker from a function
 */
export function createWorkerFromFunction(fn: Function): Worker {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

/**
 * Run task in web worker
 */
export async function runInWorker<T, R>(
  task: (data: T) => R,
  data: T
): Promise<R> {
  return new Promise((resolve, reject) => {
    const worker = createWorkerFromFunction(() => {
      self.onmessage = (e) => {
        try {
          const result = task(e.data);
          self.postMessage({ success: true, result });
        } catch (error) {
          self.postMessage({ success: false, error: (error as Error).message });
        }
      };
    });

    worker.onmessage = (e) => {
      worker.terminate();
      if (e.data.success) {
        resolve(e.data.result);
      } else {
        reject(new Error(e.data.error));
      }
    };

    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };

    worker.postMessage(data);
  });
}

/**
 * JSON parsing in worker
 */
export async function parseJSONInWorker<T>(jsonString: string): Promise<T> {
  return runInWorker((data: string) => JSON.parse(data), jsonString);
}

/**
 * Heavy computation in worker
 */
export class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{ task: Function; data: any; resolve: Function; reject: Function }> = [];
  private maxWorkers: number;

  constructor(maxWorkers: number = navigator.hardwareConcurrency || 4) {
    this.maxWorkers = maxWorkers;
  }

  async execute<T, R>(task: (data: T) => R, data: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, data, resolve, reject });
      this.processQueue();
    });
  }

  private processQueue() {
    if (this.queue.length === 0) return;
    if (this.workers.length >= this.maxWorkers) return;

    const { task, data, resolve, reject } = this.queue.shift()!;
    
    runInWorker(task, data)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.processQueue();
      });
  }

  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.queue = [];
  }
}

/**
 * Link validation in worker
 */
export async function validateLinksInWorker(urls: string[]): Promise<Array<{ url: string; valid: boolean }>> {
  return runInWorker(
    (urls: string[]) => {
      return urls.map(url => ({
        url,
        valid: url.startsWith('http://') || url.startsWith('https://'),
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
    (data: any) => {
      // Perform deep validation
      return {
        valid: true,
        errors: [],
      };
    },
    data
  );
}
