import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import { ApiResponse, ApiError, API_ERROR_CODES, ValidationError } from '@/lib/types/api';

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  
  return NextResponse.json(response, { status: statusCode });
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: Partial<ApiError> & { message: string },
  statusCode: number = 400
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: {
      code: error.code || API_ERROR_CODES.INTERNAL_ERROR,
      message: error.message,
      details: error.details,
      statusCode,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  
  return NextResponse.json(response, { status: statusCode });
}

/**
 * Handle and format various error types
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  // Zod validation errors
  if (error instanceof ZodError) {
    const validationErrors: ValidationError[] = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));
    
    return errorResponse({
      code: API_ERROR_CODES.VALIDATION_ERROR,
      message: 'Validation failed',
      details: { errors: validationErrors },
    }, 400);
  }
  
  // Database errors
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('unique constraint') || message.includes('duplicate')) {
      return errorResponse({
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'This record already exists',
      }, 409);
    }
    
    if (message.includes('foreign key') || message.includes('constraint')) {
      return errorResponse({
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid reference to related data',
      }, 400);
    }
    
    if (message.includes('connection') || message.includes('timeout')) {
      return errorResponse({
        code: API_ERROR_CODES.DATABASE_ERROR,
        message: 'Database connection error',
      }, 503);
    }
  }
  
  // Default error
  return errorResponse({
    code: API_ERROR_CODES.INTERNAL_ERROR,
    message: 'An unexpected error occurred',
  }, 500);
}

/**
 * Validate request body against a Zod schema
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON in request body');
    }
    throw error;
  }
}

/**
 * Parse and validate query parameters
 */
export function parseQueryParams<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): T {
  const params: Record<string, any> = {};
  
  searchParams.forEach((value, key) => {
    // Handle array parameters (e.g., ?ids=1&ids=2)
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  });
  
  return schema.parse(params);
}

/**
 * Calculate order totals
 */
export function calculateOrderTotals(
  subtotal: number,
  taxRate: number = 0.08875, // Example: 8.875% tax rate
  deliveryFee: number = 5.00
): {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
} {
  const tax = subtotal * taxRate;
  const total = subtotal + tax + deliveryFee;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DD${timestamp}${random}`;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Check if a value is a valid positive integer
 */
export function isPositiveInteger(value: any): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * Get client IP address
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return headers.get('x-forwarded-for')?.split(',')[0] || 
         headers.get('x-real-ip') || 
         headers.get('cf-connecting-ip') || 
         'unknown';
} 