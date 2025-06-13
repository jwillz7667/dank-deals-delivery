import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Configure Neon for better performance
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Create the Neon SQL query function
const sql = neon(process.env.DATABASE_URL);

// Create drizzle instance
export const db = drizzle(sql);

// Helper function for executing queries with retry logic
export async function executeWithRetry<T>(
  queryFn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    retryDelay?: number;
  }
): Promise<T> {
  const maxRetries = options?.maxRetries || 3;
  const retryDelay = options?.retryDelay || 1000;
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      console.error(`Database query failed (attempt ${attempt + 1}/${maxRetries}):`, error);
      
      // Don't retry on certain errors
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
          message.includes('syntax') ||
          message.includes('constraint') ||
          message.includes('duplicate') ||
          message.includes('foreign key')
        ) {
          throw error; // Don't retry on query errors
        }
      }
      
      if (attempt < maxRetries - 1) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
}

// Export transaction helper
export async function withTransaction<T>(
  callback: (tx: typeof db) => Promise<T>
): Promise<T> {
  // Note: Neon doesn't support transactions in serverless mode
  // This is a wrapper for future migration to a different driver if needed
  return callback(db);
}

// Database health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
} 