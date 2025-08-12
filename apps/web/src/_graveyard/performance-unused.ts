/**
 * Unused performance functions moved to _graveyard
 *
 * These functions were identified as unused by ts-prune:
 * - startTimer
 * - endTimer
 * - logMetric
 *
 * They may be useful for future debugging or performance monitoring.
 */

/**
 * Start a timer (for manual timing)
 */
export function startTimer(name: string): string {
  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev) return '';

  const timerId = `${name}_${Date.now()}`;
  console.time(`⏱️  ${name}`);
  return timerId;
}

/**
 * End a timer (for manual timing)
 */
export function endTimer(name: string): void {
  const isDev = process.env.NODE_ENV !== 'production';
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
  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev) return;

  console.log(`📊 ${name}: ${value}${unit}`);
}
