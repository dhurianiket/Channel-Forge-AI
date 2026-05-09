export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 2000,
  maxDelayMs: 30000,
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig
): Promise<T> {
  let attempt = 0;
  
  while (attempt <= config.maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      
      const isRetriable = isErrorRetriable(error);
      
      if (attempt > config.maxRetries || !isRetriable) {
        throw error;
      }
      
      const delay = Math.min(config.baseDelayMs * Math.pow(2, attempt - 1), config.maxDelayMs);
      console.warn(`[RetryPolicy] Operation failed, retrying in ${delay}ms (attempt ${attempt}/${config.maxRetries}). Error: ${error.message}`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Retry logic failed unexpectedly");
}

function isErrorRetriable(error: any): boolean {
  // Add specific logic based on error types
  // e.g. Network errors (502, 503, 504), rate limits (429)
  if (error && error.status) {
    return [408, 429, 500, 502, 503, 504].includes(error.status);
  }
  // Fast fail for 400, 401, 403, 404
  if (error && error.status >= 400 && error.status < 500 && error.status !== 429 && error.status !== 408) {
     return false;
  }
  return true; // Default to retriable for generic errors
}
