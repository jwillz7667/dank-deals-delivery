import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { ApiResponse, API_ERROR_CODES } from '@/lib/types/api';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
}

/**
 * Middleware to verify authentication for API routes
 */
export function withAuth<T extends any[]>(
  handler: (req: AuthenticatedRequest, ...args: T) => Promise<NextResponse>
): (req: NextRequest, ...args: T) => Promise<NextResponse> {
  return async (req: NextRequest, ...args: T) => {
    try {
      const user = await stackServerApp.getUser();
      
      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: API_ERROR_CODES.UNAUTHORIZED,
            message: 'Authentication required',
            statusCode: 401,
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
        
        return NextResponse.json(response, { status: 401 });
      }
      
      // Add userId to request
      (req as AuthenticatedRequest).userId = user.id;
      
      return handler(req as AuthenticatedRequest, ...args);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      
      const response: ApiResponse = {
        success: false,
        error: {
          code: API_ERROR_CODES.INTERNAL_ERROR,
          message: 'Authentication verification failed',
          statusCode: 500,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
      
      return NextResponse.json(response, { status: 500 });
    }
  };
}

/**
 * Optional auth middleware - continues even if user is not authenticated
 */
export function withOptionalAuth<T extends any[]>(
  handler: (req: AuthenticatedRequest, ...args: T) => Promise<NextResponse>
): (req: NextRequest, ...args: T) => Promise<NextResponse> {
  return async (req: NextRequest, ...args: T) => {
    try {
      const user = await stackServerApp.getUser();
      
      if (user) {
        (req as AuthenticatedRequest).userId = user.id;
      }
      
      return handler(req as AuthenticatedRequest, ...args);
    } catch (error) {
      console.error('Optional auth middleware error:', error);
      // Continue without auth
      return handler(req as AuthenticatedRequest, ...args);
    }
  };
}

/**
 * Rate limiting middleware
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  limit: number = 60, // requests per minute
  windowMs: number = 60000 // 1 minute
): (handler: (req: NextRequest) => Promise<NextResponse>) => (req: NextRequest) => Promise<NextResponse> {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      const identifier = req.headers.get('x-forwarded-for') || 
                        req.headers.get('x-real-ip') || 
                        'anonymous';
      
      const now = Date.now();
      const userLimit = rateLimitMap.get(identifier);
      
      if (!userLimit || now > userLimit.resetTime) {
        rateLimitMap.set(identifier, {
          count: 1,
          resetTime: now + windowMs,
        });
      } else {
        userLimit.count++;
        
        if (userLimit.count > limit) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: API_ERROR_CODES.RATE_LIMIT_EXCEEDED,
              message: 'Too many requests',
              statusCode: 429,
              details: {
                retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
              },
            },
            meta: {
              timestamp: new Date().toISOString(),
            },
          };
          
          return NextResponse.json(response, { 
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((userLimit.resetTime - now) / 1000)),
              'X-RateLimit-Limit': String(limit),
              'X-RateLimit-Remaining': String(Math.max(0, limit - userLimit.count)),
              'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString(),
            },
          });
        }
      }
      
      // Clean up old entries periodically
      if (rateLimitMap.size > 1000) {
        for (const [key, value] of rateLimitMap.entries()) {
          if (now > value.resetTime) {
            rateLimitMap.delete(key);
          }
        }
      }
      
      return handler(req);
    };
  };
} 