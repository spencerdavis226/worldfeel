/**
 * Lightweight performance timing utilities
 *
 * Only active in development mode (NODE_ENV !== 'production')
 * Provides minimal overhead timing for critical paths
 */

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Time a function execution and log the result
 */
export function timeFunction<T>(
  name: string,
  fn: () => T,
  threshold?: number
): T {
  if (!isDev) return fn();

  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  if (threshold === undefined || duration > threshold) {
    console.log(`⏱️  ${name}: ${duration.toFixed(2)}ms`);
  }

  return result;
}

/**
 * Time an async function execution and log the result
 */
export async function timeAsyncFunction<T>(
  name: string,
  fn: () => Promise<T>,
  threshold?: number
): Promise<T> {
  if (!isDev) return fn();

  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  if (threshold === undefined || duration > threshold) {
    console.log(`⏱️  ${name}: ${duration.toFixed(2)}ms`);
  }

  return result;
}

/**
 * Start a timer (for manual timing)
 */
export function startTimer(name: string): string {
  if (!isDev) return '';

  const timerId = `${name}_${Date.now()}`;
  console.time(`⏱️  ${name}`);
  return timerId;
}

/**
 * End a timer (for manual timing)
 */
export function endTimer(name: string): void {
  if (!isDev) return;

  console.timeEnd(`⏱️  ${name}`);
}

/**
 * Log a performance metric
 */
export function logMetric(
  name: string,
  value: number,
  unit: string = 'ms'
): void {
  if (!isDev) return;

  console.log(`📊 ${name}: ${value}${unit}`);
}
