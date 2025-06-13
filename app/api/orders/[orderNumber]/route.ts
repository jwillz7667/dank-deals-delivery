import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { OrderService } from '@/lib/services/order.service';
import { successResponse, handleApiError } from '@/lib/api/utils';

interface RouteParams {
  params: {
    orderNumber: string;
  };
}

/**
 * GET /api/orders/[orderNumber]
 * Get a specific order by order number
 */
async function getOrder(
  req: AuthenticatedRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    const { orderNumber } = params;
    
    const order = await OrderService.getOrderByNumber(orderNumber, userId);
    
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: 'Order not found',
            statusCode: 404,
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }
    
    return successResponse(order);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/orders/[orderNumber]
 * Cancel an order
 */
async function cancelOrder(
  req: AuthenticatedRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const userId = req.userId!;
    const { orderNumber } = params;
    const body = await req.json();
    
    if (body.action !== 'cancel') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: 'Invalid action',
            statusCode: 400,
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }
    
    // Get order first
    const order = await OrderService.getOrderByNumber(orderNumber, userId);
    
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: 'Order not found',
            statusCode: 404,
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }
    
    // Cancel the order
    const cancelledOrder = await OrderService.cancelOrder(order.id, userId);
    
    // TODO: Send cancellation email
    // await EmailService.sendOrderCancellation(userId, cancelledOrder);
    
    return successResponse({
      order: cancelledOrder,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(getOrder);
export const POST = withAuth(cancelOrder); 