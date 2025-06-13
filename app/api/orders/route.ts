import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { OrderService } from '@/lib/services/order.service';
import { successResponse, handleApiError } from '@/lib/api/utils';

/**
 * GET /api/orders
 * Get user's orders with pagination and filtering
 */
async function getOrders(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status') || undefined;
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : undefined;
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : undefined;
    
    const result = await OrderService.getUserOrders(userId, {
      limit,
      offset,
      status,
      startDate,
      endDate,
    });
    
    return successResponse({
      orders: result.orders,
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore: offset + limit < result.total,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(getOrders); 