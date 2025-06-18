import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Optimized Neon configuration without deprecated options
// Note: fetchConnectionCache is now always true by default in newer versions

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Create the Neon SQL query function with optimized configuration
const sql = neon(process.env.DATABASE_URL);

// Create drizzle instance with performance optimizations
export const db = drizzle(sql, {
  // Add any future drizzle-specific optimizations here
});

// Enhanced helper function for executing queries with retry logic and performance monitoring
export async function executeWithRetry<T>(
  queryFn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    retryDelay?: number;
    timeoutMs?: number;
  }
): Promise<T> {
  const maxRetries = options?.maxRetries || 3;
  const retryDelay = options?.retryDelay || 1000;
  const timeoutMs = options?.timeoutMs || 30000;
  
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Add timeout protection for better performance
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), timeoutMs);
      });
      
      const queryPromise = queryFn();
      const result = await Promise.race([queryPromise, timeoutPromise]) as T;
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Enhanced error logging with performance context
      if (process.env.NODE_ENV === 'development') {
        console.error(`Database query failed (attempt ${attempt + 1}/${maxRetries}):`, {
          error: error instanceof Error ? error.message : error,
          attempt: attempt + 1,
          maxRetries
        });
      }
      
      // Don't retry on certain errors (performance optimization)
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
          message.includes('syntax') ||
          message.includes('constraint') ||
          message.includes('duplicate') ||
          message.includes('foreign key') ||
          message.includes('timeout')
        ) {
          throw error; // Don't retry on these specific errors
        }
      }
      
      if (attempt < maxRetries - 1) {
        // Optimized exponential backoff with jitter
        const delay = retryDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Optimized transaction helper with better error handling
export async function withTransaction<T>(
  callback: (tx: typeof db) => Promise<T>
): Promise<T> {
  // Note: Neon HTTP doesn't support traditional transactions in serverless mode
  // This is a wrapper for potential future migration to a different driver
  try {
    return await callback(db);
  } catch (error) {
    // Enhanced error handling for better debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Transaction failed:', error);
    }
    throw error;
  }
}

// Enhanced database health check with performance monitoring
export async function checkDatabaseConnection(): Promise<{
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
}> {
  const startTime = performance.now();
  
  try {
    await sql`SELECT 1`;
    const responseTime = performance.now() - startTime;
    
    return {
      isHealthy: true,
      responseTime
    };
  } catch (error) {
    const responseTime = performance.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (process.env.NODE_ENV === 'development') {
      console.error('Database connection check failed:', {
        error: errorMessage,
        responseTime
      });
    }
    
    return {
      isHealthy: false,
      responseTime,
      error: errorMessage
    };
  }
}

// Export connection status for monitoring
export const connectionStatus = {
  lastCheck: null as Date | null,
  isHealthy: null as boolean | null,
  responseTime: null as number | null
}; 