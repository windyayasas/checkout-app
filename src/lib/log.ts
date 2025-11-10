// Simple logging helpers; expand with external service integration later.
export function logInfo(message: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, meta || '');
  }
}

export function logError(message: string, error?: unknown, meta?: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.error(`[ERROR] ${message}`, { error, ...meta });
}
